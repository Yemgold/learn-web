
// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import {
//   ArrowLeft,
//   CheckCircle2,
//   ChevronDown,
//   Copy,
//   Database,
//   FileSearch,
//   Loader2,
//   RefreshCw,
//   Search,
//   Trash2,
//   AlertTriangle,
//   BookOpen,
//   Filter,
//   Download,
//   Layers3,
//   ShieldCheck,
//   AlertCircle,
// } from "lucide-react";

// import { getSubjectsByPlan } from "@/lib/api/subjects";
// import {
//   getQuestionBanks,
//   type QuestionDifficulty,
// } from "../../competitions/createquestion/questions";

// type ExamType = "jamb" | "waec" | "neco";

// type Subject = {
//   _id: string;
//   name: string;
//   slug?: string;
// };

// type QuestionOption = {
//   label: string;
//   value: string;
// };

// type QuestionContent = {
//   type: string;
//   order: number;
//   segments?: {
//     text: string;
//     styles?: string[];
//   }[];
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
// };

// type QuestionBankItem = {
//   content: QuestionContent[];
//   question: string;
//   instruction: string;
//   topic: string;
//   section: string;
//   options: QuestionOption[];
//   correctAnswers: string[];
//   explanation: string;
//   explanationSteps: string[];
//   difficulty: "easy" | "medium" | "hard";
//   examType: ExamType;
//   apiSubjectName: string;
//   isMultipleAnswer: boolean;
// };

// type QuestionWithId = QuestionBankItem & {
//   localId: string;
//   difficultySource: QuestionDifficulty;
//   sourceIndex: number;
// };

// type DuplicateGroup = {
//   fingerprint: string;
//   questions: QuestionWithId[];
// };

// type DifficultyStats = {
//   simple: number;
//   medium: number;
//   hard: number;
// };

// type CrossDifficultyPair = {
//   key: string;
//   label: string;
//   first: QuestionWithId;
//   second: QuestionWithId;
// };

// const DIFFICULTY_LABELS: Record<
//   QuestionDifficulty,
//   string
// > = {
//   simple: "Simple / Easy",
//   medium: "Medium",
//   hard: "Hard",
// };

// const DIFFICULTY_COLORS: Record<
//   QuestionDifficulty,
//   string
// > = {
//   simple: "text-emerald-300 bg-emerald-400/10",
//   medium: "text-cyan-300 bg-cyan-400/10",
//   hard: "text-purple-300 bg-purple-400/10",
// };

// function createLocalId(
//   difficulty: QuestionDifficulty,
//   index: number,
// ) {
//   return `question-${difficulty}-${Date.now()}-${index}-${Math.random()
//     .toString(36)
//     .slice(2, 8)}`;
// }

// /**
//  * Normalizes text so obvious formatting differences
//  * do not prevent duplicate detection.
//  */
// function normalizeText(value: string) {
//   return value
//     .toLowerCase()
//     .replace(/[“”‘’]/g, "'")
//     .replace(/[–—]/g, "-")
//     .replace(/\s+/g, " ")
//     .replace(/\s+([,.!?;:])/g, "$1")
//     .trim();
// }

// /**
//  * Creates an exact-duplicate fingerprint.
//  *
//  * IMPORTANT:
//  * Difficulty is deliberately NOT included.
//  *
//  * This allows:
//  *
//  * Simple question
//  *      ↕
//  * Medium question
//  *
//  * to be detected as duplicates if they are actually identical.
//  */
// function getFingerprint(
//   question: QuestionBankItem,
// ) {
//   const questionText = normalizeText(
//     question.question,
//   );

//   const options = question.options
//     .map((option) =>
//       normalizeText(option.value),
//     )
//     .sort()
//     .join("|");

//   return [
//     normalizeText(question.apiSubjectName),
//     question.examType,
//     questionText,
//     options,
//   ].join("::");
// }

// /**
//  * Converts a static question bank into editable
//  * in-memory objects.
//  */
// function convertBankToLocal(
//   bank: QuestionBankItem[],
//   difficultySource: QuestionDifficulty,
// ): QuestionWithId[] {
//   return bank.map((question, index) => ({
//     ...question,

//     localId: createLocalId(
//       difficultySource,
//       index,
//     ),

//     difficultySource,

//     sourceIndex: index,

//     content:
//       question.content?.map((block) => ({
//         ...block,

//         segments: block.segments?.map(
//           (segment) => ({
//             ...segment,
//             styles: segment.styles
//               ? [...segment.styles]
//               : undefined,
//           }),
//         ),

//         table: block.table?.map((row) => [
//           ...row,
//         ]),

//         graph: block.graph
//           ? {
//               ...block.graph,

//               labels: [
//                 ...block.graph.labels,
//               ],

//               datasets:
//                 block.graph.datasets.map(
//                   (dataset) => ({
//                     ...dataset,
//                     data: [
//                       ...dataset.data,
//                     ],
//                   }),
//                 ),
//             }
//           : undefined,
//       })) ?? [],

//     options: question.options.map(
//       (option) => ({
//         ...option,
//       }),
//     ),

//     correctAnswers: [
//       ...question.correctAnswers,
//     ],

//     explanationSteps: [
//       ...question.explanationSteps,
//     ],
//   }));
// }

// /**
//  * Returns the expected schema difficulty
//  * for each source folder.
//  *
//  * simple folder -> easy schema value
//  * medium folder -> medium
//  * hard folder -> hard
//  */
// function getExpectedDifficulty(
//   source: QuestionDifficulty,
// ): QuestionBankItem["difficulty"] {
//   if (source === "simple") {
//     return "easy";
//   }

//   return source;
// }

// /**
//  * Creates the output filename for an individual
//  * difficulty bank.
//  */
// function createFileName(
//   subjectName: string,
//   examType: ExamType,
//   difficulty: QuestionDifficulty,
// ) {
//   const subjectSlug = subjectName
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/^-+|-+$/g, "");

//   const difficultyFolder =
//     difficulty === "simple"
//       ? "simple"
//       : difficulty;

//   return `${subjectSlug}-${examType}-${difficultyFolder}.ts`;
// }

// /**
//  * Creates the import path used by the generated
//  * TypeScript file.
//  *
//  * Example:
//  *
//  * biology/simple/jamb.ts
//  *
//  * imports:
//  *
//  * import type { QuestionBankItem } from "../../types";
//  *
//  * because the downloaded file is expected to be
//  * placed inside:
//  *
//  * questions/biology/simple/
//  */
// function createFileContent(
//   questions: QuestionBankItem[],
// ) {
//   return `import type { QuestionBankItem } from "../../types";

// const questions: QuestionBankItem[] = ${JSON.stringify(
//     questions,
//     null,
//     2,
//   )};

// export default questions;
// `;
// }

// export default function QuestionBankValidatorPage() {
//   const [subjects, setSubjects] = useState<
//     Subject[]
//   >([]);

//   const [
//     selectedSubjectId,
//     setSelectedSubjectId,
//   ] = useState("");

//   const [
//     selectedExamType,
//     setSelectedExamType,
//   ] = useState<ExamType>("jamb");

//   const [
//     questions,
//     setQuestions,
//   ] = useState<QuestionWithId[]>([]);

//   const [
//     loadingSubjects,
//     setLoadingSubjects,
//   ] = useState(true);

//   const [
//     loadingBank,
//     setLoadingBank,
//   ] = useState(false);

//   const [
//     pageError,
//     setPageError,
//   ] = useState("");

//   const [
//     successMessage,
//     setSuccessMessage,
//   ] = useState("");

//   const [
//     searchTerm,
//     setSearchTerm,
//   ] = useState("");

//   const [
//     selectedDuplicateIds,
//     setSelectedDuplicateIds,
//   ] = useState<string[]>([]);

//   const [
//     expandedGroups,
//     setExpandedGroups,
//   ] = useState<string[]>([]);

//   /*
//    * ============================================================
//    * LOAD SUBJECTS
//    * ============================================================
//    */

//   useEffect(() => {
//     async function loadSubjects() {
//       try {
//         setLoadingSubjects(true);
//         setPageError("");

//         const response =
//           await getSubjectsByPlan(
//             "SECONDARY",
//             1,
//             100,
//           );

//         const loadedSubjects: Subject[] =
//           response?.data?.subjectObj ?? [];

//         setSubjects(loadedSubjects);

//         if (loadedSubjects.length > 0) {
//           setSelectedSubjectId(
//             loadedSubjects[0]._id,
//           );
//         }
//       } catch (error) {
//         console.error(
//           "Failed to load subjects:",
//           error,
//         );

//         setPageError(
//           "Unable to load secondary subjects. Please try again.",
//         );
//       } finally {
//         setLoadingSubjects(false);
//       }
//     }

//     loadSubjects();
//   }, []);

//   /*
//    * ============================================================
//    * SELECTED SUBJECT
//    * ============================================================
//    */

//   const selectedSubject = useMemo(
//     () =>
//       subjects.find(
//         (subject) =>
//           subject._id ===
//           selectedSubjectId,
//       ),
//     [
//       subjects,
//       selectedSubjectId,
//     ],
//   );

//   /*
//    * ============================================================
//    * AVAILABLE QUESTION BANKS
//    * ============================================================
//    */

//   const availableBanks = useMemo(() => {
//     if (!selectedSubject) {
//       return {
//         simple: [],
//         medium: [],
//         hard: [],
//       };
//     }

//     return getQuestionBanks(
//       selectedSubject.name,
//       selectedExamType,
//     );
//   }, [
//     selectedSubject,
//     selectedExamType,
//   ]);

//   /*
//    * ============================================================
//    * AVAILABLE TOTAL
//    * ============================================================
//    */

//   const availableTotal =
//     availableBanks.simple.length +
//     availableBanks.medium.length +
//     availableBanks.hard.length;

//   /*
//    * ============================================================
//    * DIFFICULTY COUNTS
//    * ============================================================
//    */

//   const difficultyStats =
//     useMemo<DifficultyStats>(
//       () => ({
//         simple: questions.filter(
//           (question) =>
//             question.difficultySource ===
//             "simple",
//         ).length,

//         medium: questions.filter(
//           (question) =>
//             question.difficultySource ===
//             "medium",
//         ).length,

//         hard: questions.filter(
//           (question) =>
//             question.difficultySource ===
//             "hard",
//         ).length,
//       }),
//       [questions],
//     );

//   /*
//    * ============================================================
//    * EXACT DUPLICATE GROUPS
//    * ============================================================
//    *
//    * Difficulty is intentionally ignored.
//    *
//    * Therefore:
//    *
//    * Simple #10
//    * Medium #921
//    *
//    * with the same fingerprint are placed
//    * in the same duplicate group.
//    * ============================================================
//    */

//   const duplicateGroups =
//     useMemo<DuplicateGroup[]>(
//       () => {
//         const groups = new Map<
//           string,
//           QuestionWithId[]
//         >();

//         for (const question of questions) {
//           const fingerprint =
//             getFingerprint(question);

//           const existing =
//             groups.get(fingerprint);

//           if (existing) {
//             existing.push(question);
//           } else {
//             groups.set(fingerprint, [
//               question,
//             ]);
//           }
//         }

//         return Array.from(
//           groups.entries(),
//         )
//           .filter(
//             ([, group]) =>
//               group.length > 1,
//           )
//           .map(
//             ([
//               fingerprint,
//               group,
//             ]) => ({
//               fingerprint,
//               questions: group,
//             }),
//           );
//       },
//       [questions],
//     );

//   /*
//    * ============================================================
//    * CROSS-DIFFICULTY EXACT DUPLICATES
//    * ============================================================
//    */

//   const crossDifficultyDuplicates =
//     useMemo<
//       CrossDifficultyPair[]
//     >(() => {
//       const pairs: CrossDifficultyPair[] =
//         [];

//       for (
//         let i = 0;
//         i < duplicateGroups.length;
//         i++
//       ) {
//         const group =
//           duplicateGroups[i];

//         for (
//           let a = 0;
//           a < group.questions.length;
//           a++
//         ) {
//           for (
//             let b = a + 1;
//             b <
//             group.questions.length;
//             b++
//           ) {
//             const first =
//               group.questions[a];

//             const second =
//               group.questions[b];

//             if (
//               first.difficultySource ===
//               second.difficultySource
//             ) {
//               continue;
//             }

//             const difficulties = [
//               first.difficultySource,
//               second.difficultySource,
//             ].sort();

//             const pairKey = `${group.fingerprint}::${difficulties.join(
//               "-",
//             )}`;

//             pairs.push({
//               key: pairKey,
//               label: `${DIFFICULTY_LABELS[first.difficultySource]} ↔ ${DIFFICULTY_LABELS[second.difficultySource]}`,
//               first,
//               second,
//             });
//           }
//         }
//       }

//       return pairs;
//     }, [duplicateGroups]);

//   /*
//    * ============================================================
//    * CROSS-DIFFICULTY PAIR COUNTS
//    * ============================================================
//    */

//   const crossPairStats = useMemo(
//     () => {
//       let simpleMedium = 0;
//       let simpleHard = 0;
//       let mediumHard = 0;

//       for (const pair of crossDifficultyDuplicates) {
//         const values = [
//           pair.first.difficultySource,
//           pair.second.difficultySource,
//         ].sort();

//         const key = values.join("-");

//         if (key === "medium-simple") {
//           simpleMedium++;
//         }

//         if (key === "hard-simple") {
//           simpleHard++;
//         }

//         if (key === "hard-medium") {
//           mediumHard++;
//         }
//       }

//       return {
//         simpleMedium,
//         simpleHard,
//         mediumHard,
//       };
//     },
//     [crossDifficultyDuplicates],
//   );

//   /*
//    * ============================================================
//    * DUPLICATE QUESTION COUNT
//    * ============================================================
//    */

//   const duplicateQuestionCount =
//     useMemo(
//       () =>
//         duplicateGroups.reduce(
//           (total, group) =>
//             total +
//             group.questions.length,
//           0,
//         ),
//       [duplicateGroups],
//     );

//   /*
//    * ============================================================
//    * DUPLICATE COPIES
//    * ============================================================
//    */

//   const duplicateCopiesCount =
//     useMemo(
//       () =>
//         duplicateGroups.reduce(
//           (total, group) =>
//             total +
//             group.questions.length -
//             1,
//           0,
//         ),
//       [duplicateGroups],
//     );

//   /*
//    * ============================================================
//    * UNIQUE QUESTIONS
//    * ============================================================
//    */

//   const uniqueQuestionCount =
//     questions.length -
//     duplicateCopiesCount;

//   /*
//    * ============================================================
//    * DIFFICULTY SCHEMA ERRORS
//    * ============================================================
//    *
//    * Detects:
//    *
//    * simple folder containing medium/hard
//    * medium folder containing easy/hard
//    * hard folder containing easy/medium
//    * ============================================================
//    */

//   const difficultyValidationErrors =
//     useMemo(() => {
//       return questions.filter(
//         (question) =>
//           question.difficulty !==
//           getExpectedDifficulty(
//             question.difficultySource,
//           ),
//       );
//     }, [questions]);

//   /*
//    * ============================================================
//    * STRUCTURAL VALIDATION
//    * ============================================================
//    */

//   const structuralValidationErrors =
//     useMemo(() => {
//       return questions.filter(
//         (question) => {
//           if (
//             !question.question?.trim()
//           ) {
//             return true;
//           }

//           if (
//             !Array.isArray(
//               question.options,
//             ) ||
//             question.options.length !==
//               4
//           ) {
//             return true;
//           }

//           if (
//             !Array.isArray(
//               question.correctAnswers,
//             ) ||
//             question.correctAnswers
//               .length !== 1
//           ) {
//             return true;
//           }

//           if (
//             question.section !==
//             "objective"
//           ) {
//             return true;
//           }

//           if (
//             !question.apiSubjectName
//           ) {
//             return true;
//           }

//           if (
//             question.examType !==
//             selectedExamType
//           ) {
//             return true;
//           }

//           if (
//             question.isMultipleAnswer
//           ) {
//             return true;
//           }

//           return false;
//         },
//       );
//     }, [
//       questions,
//       selectedExamType,
//     ]);

//   /*
//    * ============================================================
//    * FILTER DUPLICATE GROUPS
//    * ============================================================
//    */

//   const filteredGroups =
//     useMemo(() => {
//       const normalizedSearch =
//         normalizeText(searchTerm);

//       if (!normalizedSearch) {
//         return duplicateGroups;
//       }

//       return duplicateGroups.filter(
//         (group) =>
//           group.questions.some(
//             (question) =>
//               normalizeText(
//                 question.question,
//               ).includes(
//                 normalizedSearch,
//               ) ||
//               normalizeText(
//                 question.topic,
//               ).includes(
//                 normalizedSearch,
//               ) ||
//               question.options.some(
//                 (option) =>
//                   normalizeText(
//                     option.value,
//                   ).includes(
//                     normalizedSearch,
//                   ),
//               ),
//           ),
//       );
//     }, [
//       duplicateGroups,
//       searchTerm,
//     ]);

//   /*
//    * ============================================================
//    * FILTER CROSS-DIFFICULTY DUPLICATES
//    * ============================================================
//    */

//   const filteredCrossDifficulty =
//     useMemo(() => {
//       const normalizedSearch =
//         normalizeText(searchTerm);

//       if (!normalizedSearch) {
//         return crossDifficultyDuplicates;
//       }

//       return crossDifficultyDuplicates.filter(
//         (pair) =>
//           normalizeText(
//             pair.first.question,
//           ).includes(
//             normalizedSearch,
//           ) ||
//           normalizeText(
//             pair.second.question,
//           ).includes(
//             normalizedSearch,
//           ) ||
//           normalizeText(
//             pair.first.topic,
//           ).includes(
//             normalizedSearch,
//           ) ||
//           normalizeText(
//             pair.second.topic,
//           ).includes(
//             normalizedSearch,
//           ),
//       );
//     }, [
//       crossDifficultyDuplicates,
//       searchTerm,
//     ]);

//   /*
//    * ============================================================
//    * STATES
//    * ============================================================
//    */

//   const hasLoadedQuestions =
//     questions.length > 0;

//   const hasDuplicates =
//     duplicateGroups.length > 0;

//   const hasCrossDifficultyDuplicates =
//     crossDifficultyDuplicates.length >
//     0;

//   const hasValidationErrors =
//     difficultyValidationErrors.length >
//       0 ||
//     structuralValidationErrors.length >
//       0;

//   const isClean =
//     hasLoadedQuestions &&
//     !hasDuplicates &&
//     !hasValidationErrors;

//   /*
//    * ============================================================
//    * LOAD ALL THREE QUESTION BANKS
//    * ============================================================
//    */

//   function loadQuestionFile() {
//     if (!selectedSubject) {
//       setPageError(
//         "Please select a subject first.",
//       );
//       return;
//     }

//     setPageError("");
//     setSuccessMessage("");

//     setSelectedDuplicateIds([]);
//     setExpandedGroups([]);
//     setSearchTerm("");

//     setLoadingBank(true);

//     try {
//       const banks =
//         getQuestionBanks(
//           selectedSubject.name,
//           selectedExamType,
//         );

//       const total =
//         banks.simple.length +
//         banks.medium.length +
//         banks.hard.length;

//       if (total === 0) {
//         setQuestions([]);

//         setPageError(
//           `No ${selectedExamType.toUpperCase()} question banks are available for ${selectedSubject.name}.`,
//         );

//         return;
//       }

//       const loadedQuestions: QuestionWithId[] =
//         [
//           ...convertBankToLocal(
//             banks.simple,
//             "simple",
//           ),

//           ...convertBankToLocal(
//             banks.medium,
//             "medium",
//           ),

//           ...convertBankToLocal(
//             banks.hard,
//             "hard",
//           ),
//         ];

//       setQuestions(
//         loadedQuestions,
//       );

//       setSuccessMessage(
//         `${loadedQuestions.length.toLocaleString()} questions loaded across Simple, Medium, and Hard banks for ${selectedSubject.name} ${selectedExamType.toUpperCase()}.`,
//       );
//     } catch (error) {
//       console.error(
//         "Failed to load question banks:",
//         error,
//       );

//       setQuestions([]);

//       setPageError(
//         "The question banks could not be loaded. Check the question files and try again.",
//       );
//     } finally {
//       setLoadingBank(false);
//     }
//   }

//   /*
//    * ============================================================
//    * TOGGLE QUESTION SELECTION
//    * ============================================================
//    */

//   function toggleDuplicateQuestion(
//     localId: string,
//   ) {
//     setSelectedDuplicateIds(
//       (current) =>
//         current.includes(localId)
//           ? current.filter(
//               (id) =>
//                 id !== localId,
//             )
//           : [
//               ...current,
//               localId,
//             ],
//     );
//   }

//   /*
//    * ============================================================
//    * SELECT ONLY QUESTION
//    * ============================================================
//    */

//   function selectOnlyQuestion(
//     localId: string,
//   ) {
//     setSelectedDuplicateIds(
//       (current) =>
//         current.includes(localId)
//           ? current
//           : [
//               ...current,
//               localId,
//             ],
//     );
//   }

//   /*
//    * ============================================================
//    * DELETE SELECTED QUESTIONS
//    * ============================================================
//    */

//   function deleteSelectedQuestions() {
//     if (
//       !selectedDuplicateIds.length
//     ) {
//       return;
//     }

//     const selectedSet =
//       new Set(
//         selectedDuplicateIds,
//       );

//     setQuestions((current) =>
//       current.filter(
//         (question) =>
//           !selectedSet.has(
//             question.localId,
//           ),
//       ),
//     );

//     const deletedCount =
//       selectedDuplicateIds.length;

//     setSelectedDuplicateIds([]);

//     setSuccessMessage(
//       `${deletedCount} question${
//         deletedCount === 1
//           ? ""
//           : "s"
//       } removed from the current validation session.`,
//     );
//   }

//   /*
//    * ============================================================
//    * DELETE ONE QUESTION
//    * ============================================================
//    */

//   function deleteQuestion(
//     localId: string,
//   ) {
//     setQuestions((current) =>
//       current.filter(
//         (question) =>
//           question.localId !==
//           localId,
//       ),
//     );

//     setSelectedDuplicateIds(
//       (current) =>
//         current.filter(
//           (id) =>
//             id !== localId,
//         ),
//     );

//     setSuccessMessage(
//       "Question removed from the current validation session.",
//     );
//   }

//   /*
//    * ============================================================
//    * TOGGLE GROUP
//    * ============================================================
//    */

//   function toggleGroup(
//     fingerprint: string,
//   ) {
//     setExpandedGroups(
//       (current) =>
//         current.includes(
//           fingerprint,
//         )
//           ? current.filter(
//               (value) =>
//                 value !==
//                 fingerprint,
//             )
//           : [
//               ...current,
//               fingerprint,
//             ],
//     );
//   }

//   /*
//    * ============================================================
//    * SELECT EXTRA DUPLICATES
//    * ============================================================
//    *
//    * For each duplicate group, the first question
//    * is kept and all remaining copies are selected.
//    *
//    * NOTE:
//    *
//    * If the first question is Simple and the duplicate
//    * is Medium, the Simple question is kept by default.
//    *
//    * You can manually change this selection.
//    * ============================================================
//    */

//   function selectAllDuplicates() {
//     const allDuplicateIds =
//       duplicateGroups.flatMap(
//         (group) =>
//           group.questions
//             .slice(1)
//             .map(
//               (question) =>
//                 question.localId,
//             ),
//       );

//     setSelectedDuplicateIds(
//       allDuplicateIds,
//     );
//   }

//   /*
//    * ============================================================
//    * CLEAR SELECTIONS
//    * ============================================================
//    */

//   function clearSelections() {
//     setSelectedDuplicateIds([]);
//   }

//   /*
//    * ============================================================
//    * SAVE A SINGLE DIFFICULTY BANK
//    * ============================================================
//    */

//   function downloadDifficultyBank(
//     difficulty: QuestionDifficulty,
//   ) {
//     if (!selectedSubject) {
//       setPageError(
//         "Please select a subject first.",
//       );
//       return;
//     }

//     const difficultyQuestions =
//       questions.filter(
//         (question) =>
//           question.difficultySource ===
//           difficulty,
//       );

//     if (
//       difficultyQuestions.length ===
//       0
//     ) {
//       setPageError(
//         `There are no ${DIFFICULTY_LABELS[difficulty]} questions to save.`,
//       );
//       return;
//     }

//     const cleanQuestions =
//       difficultyQuestions.map(
//         ({
//           localId,
//           difficultySource,
//           sourceIndex,
//           ...question
//         }) => question,
//       );

//     const fileContent =
//       createFileContent(
//         cleanQuestions,
//       );

//     const blob = new Blob(
//       [fileContent],
//       {
//         type: "text/typescript;charset=utf-8",
//       },
//     );

//     const url =
//       URL.createObjectURL(blob);

//     const link =
//       document.createElement("a");

//     link.href = url;

//     link.download =
//       createFileName(
//         selectedSubject.name,
//         selectedExamType,
//         difficulty,
//       );

//     document.body.appendChild(
//       link,
//     );

//     link.click();

//     document.body.removeChild(
//       link,
//     );

//     URL.revokeObjectURL(url);

//     setSuccessMessage(
//       `${DIFFICULTY_LABELS[difficulty]} bank saved as ${link.download}.`,
//     );
//   }

//   /*
//    * ============================================================
//    * SAVE ALL THREE BANKS
//    * ============================================================
//    */

//   function saveAllCleanedBanks() {
//     if (!isClean) {
//       setPageError(
//         "Resolve all duplicate and validation errors before saving.",
//       );
//       return;
//     }

//     downloadDifficultyBank(
//       "simple",
//     );

//     setTimeout(() => {
//       downloadDifficultyBank(
//         "medium",
//       );
//     }, 300);

//     setTimeout(() => {
//       downloadDifficultyBank(
//         "hard",
//       );
//     }, 600);

//     setSuccessMessage(
//       "Clean Simple, Medium, and Hard question banks are being downloaded separately.",
//     );
//   }

//   /*
//    * ============================================================
//    * RENDER
//    * ============================================================
//    */

//   return (
//     <main className="min-h-screen bg-slate-950 text-white">
//       <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
//         {/* ======================================================
//             HEADER
//         ======================================================= */}

//         <div className="mb-8">
//           <Link
//             href="/admin/secondary/solveandwin"
//             className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Back to Solve & Win
//           </Link>

//           <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
//             <div>
//               <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-300">
//                 <ShieldCheck className="h-3.5 w-3.5" />
//                 Cross-Difficulty Validator
//               </div>

//               <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
//                 Validate Question Banks
//               </h1>

//               <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
//                 Validate Simple, Medium, and
//                 Hard question banks together.
//                 Exact duplicates are detected
//                 across all difficulty levels so
//                 Medium and Hard questions cannot
//                 silently repeat questions already
//                 used elsewhere.
//               </p>
//             </div>

//             <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3">
//               <Database className="h-5 w-5 text-cyan-400" />

//               <div>
//                 <p className="text-xs font-semibold text-slate-500">
//                   Validation
//                 </p>

//                 <p className="text-sm font-bold text-slate-200">
//                   Cross-difficulty
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ======================================================
//             ALERTS
//         ======================================================= */}

//         {pageError && (
//           <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
//             <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

//             <p>{pageError}</p>
//           </div>
//         )}

//         {successMessage && (
//           <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
//             <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

//             <p>{successMessage}</p>
//           </div>
//         )}

//         {/* ======================================================
//             FILE SELECTOR
//         ======================================================= */}

//         <section className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-black/20 sm:p-6">
//           <div className="mb-5 flex items-center gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
//               <BookOpen className="h-5 w-5 text-cyan-400" />
//             </div>

//             <div>
//               <h2 className="font-bold text-white">
//                 Select Question Banks
//               </h2>

//               <p className="text-sm text-slate-500">
//                 The validator will load all three
//                 difficulty levels for comparison.
//               </p>
//             </div>
//           </div>

//           <div className="grid gap-4 md:grid-cols-3">
//             {/* SUBJECT */}

//             <div>
//               <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
//                 Subject
//               </label>

//               <select
//                 value={
//                   selectedSubjectId
//                 }
//                 onChange={(event) => {
//                   setSelectedSubjectId(
//                     event.target.value,
//                   );

//                   setQuestions([]);

//                   setSelectedDuplicateIds(
//                     [],
//                   );

//                   setExpandedGroups(
//                     [],
//                   );

//                   setSuccessMessage(
//                     "",
//                   );

//                   setPageError("");
//                 }}
//                 disabled={
//                   loadingSubjects
//                 }
//                 className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 text-sm font-semibold text-white outline-none transition focus:border-cyan-400"
//               >
//                 {loadingSubjects ? (
//                   <option value="">
//                     Loading subjects...
//                   </option>
//                 ) : subjects.length ===
//                   0 ? (
//                   <option value="">
//                     No subjects available
//                   </option>
//                 ) : (
//                   subjects.map(
//                     (subject) => (
//                       <option
//                         key={
//                           subject._id
//                         }
//                         value={
//                           subject._id
//                         }
//                       >
//                         {
//                           subject.name
//                         }
//                       </option>
//                     ),
//                   )
//                 )}
//               </select>
//             </div>

//             {/* EXAM TYPE */}

//             <div>
//               <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
//                 Exam Type
//               </label>

//               <select
//                 value={
//                   selectedExamType
//                 }
//                 onChange={(event) => {
//                   setSelectedExamType(
//                     event.target.value as ExamType,
//                   );

//                   setQuestions([]);

//                   setSelectedDuplicateIds(
//                     [],
//                   );

//                   setExpandedGroups(
//                     [],
//                   );

//                   setSuccessMessage(
//                     "",
//                   );

//                   setPageError("");
//                 }}
//                 className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 text-sm font-semibold text-white outline-none transition focus:border-cyan-400"
//               >
//                 <option value="jamb">
//                   JAMB
//                 </option>

//                 <option value="waec">
//                   WAEC
//                 </option>

//                 <option value="neco">
//                   NECO
//                 </option>
//               </select>
//             </div>

//             {/* LOAD BUTTON */}

//             <div className="flex items-end">
//               <button
//                 type="button"
//                 onClick={
//                   loadQuestionFile
//                 }
//                 disabled={
//                   loadingBank ||
//                   loadingSubjects ||
//                   !selectedSubject
//                 }
//                 className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 text-sm font-black text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 {loadingBank ? (
//                   <>
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     Loading Banks...
//                   </>
//                 ) : (
//                   <>
//                     <Layers3 className="h-4 w-4" />
//                     Load All Banks
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* BANK INFO */}

//           {selectedSubject && (
//             <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
//               <div className="rounded-xl bg-slate-950 p-4">
//                 <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
//                   Subject
//                 </p>

//                 <p className="mt-1 text-sm font-bold text-white">
//                   {
//                     selectedSubject.name
//                   }
//                 </p>
//               </div>

//               <div className="rounded-xl bg-slate-950 p-4">
//                 <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
//                   Exam
//                 </p>

//                 <p className="mt-1 text-sm font-bold text-white">
//                   {selectedExamType.toUpperCase()}
//                 </p>
//               </div>

//               <div className="rounded-xl bg-slate-950 p-4">
//                 <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
//                   Available Banks
//                 </p>

//                 <p className="mt-1 text-sm font-black text-cyan-300">
//                   {availableTotal.toLocaleString()}
//                 </p>
//               </div>

//               <div className="rounded-xl bg-slate-950 p-4">
//                 <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
//                   Validation
//                 </p>

//                 <p className="mt-1 text-sm font-black text-emerald-300">
//                   Simple ↔ Medium ↔ Hard
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* AVAILABLE DIFFICULTIES */}

//           {selectedSubject && (
//             <div className="mt-4 flex flex-wrap gap-2">
//               {(
//                 [
//                   "simple",
//                   "medium",
//                   "hard",
//                 ] as QuestionDifficulty[]
//               ).map(
//                 (difficulty) => (
//                   <span
//                     key={difficulty}
//                     className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wider ${DIFFICULTY_COLORS[difficulty]}`}
//                   >
//                     {
//                       DIFFICULTY_LABELS[
//                         difficulty
//                       ]
//                     }
//                     :{" "}
//                     {availableBanks[
//                       difficulty
//                     ].length.toLocaleString()}
//                   </span>
//                 ),
//               )}
//             </div>
//           )}
//         </section>

//         {/* ======================================================
//             STATISTICS
//         ======================================================= */}

//         {hasLoadedQuestions && (
//           <>
//             <section className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
//               {/* TOTAL */}

//               <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
//                 <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
//                   Loaded
//                 </p>

//                 <p className="mt-2 text-3xl font-black text-white">
//                   {questions.length.toLocaleString()}
//                 </p>

//                 <p className="mt-1 text-xs text-slate-500">
//                   Across all difficulty banks
//                 </p>
//               </div>

//               {/* SIMPLE */}

//               <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
//                 <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
//                   Simple / Easy
//                 </p>

//                 <p className="mt-2 text-3xl font-black text-emerald-300">
//                   {difficultyStats.simple.toLocaleString()}
//                 </p>

//                 <p className="mt-1 text-xs text-slate-500">
//                   Source: simple/jamb.ts
//                 </p>
//               </div>

//               {/* MEDIUM */}

//               <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
//                 <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
//                   Medium
//                 </p>

//                 <p className="mt-2 text-3xl font-black text-cyan-300">
//                   {difficultyStats.medium.toLocaleString()}
//                 </p>

//                 <p className="mt-1 text-xs text-slate-500">
//                   Source: medium/jamb.ts
//                 </p>
//               </div>

//               {/* HARD */}

//               <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
//                 <p className="text-xs font-bold uppercase tracking-wider text-purple-400">
//                   Hard
//                 </p>

//                 <p className="mt-2 text-3xl font-black text-purple-300">
//                   {difficultyStats.hard.toLocaleString()}
//                 </p>

//                 <p className="mt-1 text-xs text-slate-500">
//                   Source: hard/jamb.ts
//                 </p>
//               </div>

//               {/* UNIQUE */}

//               <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
//                 <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
//                   Unique
//                 </p>

//                 <p className="mt-2 text-3xl font-black text-emerald-400">
//                   {uniqueQuestionCount.toLocaleString()}
//                 </p>

//                 <p className="mt-1 text-xs text-slate-500">
//                   After exact duplicates
//                 </p>
//               </div>
//             </section>

//             {/* ==================================================
//                 CROSS-DIFFICULTY STATS
//             =================================================== */}

//             <section className="mb-8 grid gap-4 md:grid-cols-3">
//               <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
//                 <div className="flex items-center justify-between">
//                   <p className="text-xs font-black uppercase tracking-wider text-slate-500">
//                     Simple ↔ Medium
//                   </p>

//                   <Copy className="h-4 w-4 text-amber-400" />
//                 </div>

//                 <p className="mt-2 text-3xl font-black text-amber-300">
//                   {crossPairStats.simpleMedium.toLocaleString()}
//                 </p>

//                 <p className="mt-1 text-xs text-slate-500">
//                   Exact cross-difficulty overlaps
//                 </p>
//               </div>

//               <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
//                 <div className="flex items-center justify-between">
//                   <p className="text-xs font-black uppercase tracking-wider text-slate-500">
//                     Simple ↔ Hard
//                   </p>

//                   <Copy className="h-4 w-4 text-amber-400" />
//                 </div>

//                 <p className="mt-2 text-3xl font-black text-amber-300">
//                   {crossPairStats.simpleHard.toLocaleString()}
//                 </p>

//                 <p className="mt-1 text-xs text-slate-500">
//                   Exact cross-difficulty overlaps
//                 </p>
//               </div>

//               <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
//                 <div className="flex items-center justify-between">
//                   <p className="text-xs font-black uppercase tracking-wider text-slate-500">
//                     Medium ↔ Hard
//                   </p>

//                   <Copy className="h-4 w-4 text-amber-400" />
//                 </div>

//                 <p className="mt-2 text-3xl font-black text-amber-300">
//                   {crossPairStats.mediumHard.toLocaleString()}
//                 </p>

//                 <p className="mt-1 text-xs text-slate-500">
//                   Exact cross-difficulty overlaps
//                 </p>
//               </div>
//             </section>
//           </>
//         )}

//         {/* ======================================================
//             VALIDATION WARNINGS
//         ======================================================= */}

//         {hasLoadedQuestions &&
//           (hasValidationErrors ||
//             hasCrossDifficultyDuplicates) && (
//             <section className="mb-8 grid gap-4 lg:grid-cols-3">
//               {/* EXACT */}

//               <div
//                 className={`rounded-2xl border p-5 ${
//                   hasDuplicates
//                     ? "border-red-500/20 bg-red-500/5"
//                     : "border-emerald-500/20 bg-emerald-500/5"
//                 }`}
//               >
//                 <div className="flex items-center gap-3">
//                   {hasDuplicates ? (
//                     <AlertTriangle className="h-5 w-5 text-red-400" />
//                   ) : (
//                     <CheckCircle2 className="h-5 w-5 text-emerald-400" />
//                   )}

//                   <h3 className="font-black">
//                     Exact Duplicates
//                   </h3>
//                 </div>

//                 <p className="mt-3 text-sm text-slate-400">
//                   {hasDuplicates
//                     ? `${duplicateCopiesCount.toLocaleString()} duplicate copies require review.`
//                     : "No exact duplicates detected."}
//                 </p>
//               </div>

//               {/* DIFFICULTY */}

//               <div
//                 className={`rounded-2xl border p-5 ${
//                   difficultyValidationErrors.length >
//                   0
//                     ? "border-red-500/20 bg-red-500/5"
//                     : "border-emerald-500/20 bg-emerald-500/5"
//                 }`}
//               >
//                 <div className="flex items-center gap-3">
//                   {difficultyValidationErrors.length >
//                   0 ? (
//                     <AlertTriangle className="h-5 w-5 text-red-400" />
//                   ) : (
//                     <CheckCircle2 className="h-5 w-5 text-emerald-400" />
//                   )}

//                   <h3 className="font-black">
//                     Difficulty Integrity
//                   </h3>
//                 </div>

//                 <p className="mt-3 text-sm text-slate-400">
//                   {difficultyValidationErrors.length >
//                   0
//                     ? `${difficultyValidationErrors.length.toLocaleString()} questions have an incorrect difficulty value for their source folder.`
//                     : "All questions match their source difficulty."}
//                 </p>
//               </div>

//               {/* STRUCTURE */}

//               <div
//                 className={`rounded-2xl border p-5 ${
//                   structuralValidationErrors.length >
//                   0
//                     ? "border-red-500/20 bg-red-500/5"
//                     : "border-emerald-500/20 bg-emerald-500/5"
//                 }`}
//               >
//                 <div className="flex items-center gap-3">
//                   {structuralValidationErrors.length >
//                   0 ? (
//                     <AlertTriangle className="h-5 w-5 text-red-400" />
//                   ) : (
//                     <CheckCircle2 className="h-5 w-5 text-emerald-400" />
//                   )}

//                   <h3 className="font-black">
//                     Structure
//                   </h3>
//                 </div>

//                 <p className="mt-3 text-sm text-slate-400">
//                   {structuralValidationErrors.length >
//                   0
//                     ? `${structuralValidationErrors.length.toLocaleString()} questions have structural validation errors.`
//                     : "Question structure is valid."}
//                 </p>
//               </div>
//             </section>
//           )}

//         {/* ======================================================
//             CLEAN STATUS
//         ======================================================= */}

//         {isClean && (
//           <div className="mb-8 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6">
//             <div className="flex items-start gap-4">
//               <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-400/10">
//                 <ShieldCheck className="h-6 w-6 text-emerald-400" />
//               </div>

//               <div className="min-w-0">
//                 <h2 className="text-lg font-black text-emerald-300">
//                   All Three Question Banks Are Clean
//                 </h2>

//                 <p className="mt-1 text-sm leading-6 text-emerald-200/70">
//                   No exact duplicates or
//                   structural validation errors
//                   were detected across Simple,
//                   Medium, and Hard.
//                 </p>

//                 <div className="mt-4 flex flex-wrap gap-2">
//                   <span className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-black text-emerald-300">
//                     Simple:{" "}
//                     {difficultyStats.simple.toLocaleString()}
//                   </span>

//                   <span className="rounded-full bg-cyan-400/10 px-3 py-1.5 text-xs font-black text-cyan-300">
//                     Medium:{" "}
//                     {difficultyStats.medium.toLocaleString()}
//                   </span>

//                   <span className="rounded-full bg-purple-400/10 px-3 py-1.5 text-xs font-black text-purple-300">
//                     Hard:{" "}
//                     {difficultyStats.hard.toLocaleString()}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ======================================================
//             DUPLICATES
//         ======================================================= */}

//         {hasLoadedQuestions &&
//           hasDuplicates && (
//             <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
//               {/* HEADER */}

//               <div className="border-b border-slate-800 p-5 sm:p-6">
//                 <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
//                   <div>
//                     <div className="flex items-center gap-2">
//                       <Copy className="h-5 w-5 text-amber-400" />

//                       <h2 className="text-xl font-black text-white">
//                         Duplicate Questions
//                       </h2>
//                     </div>

//                     <p className="mt-2 text-sm text-slate-400">
//                       Exact duplicates are grouped
//                       together regardless of
//                       difficulty.
//                     </p>
//                   </div>

//                   <div className="flex flex-wrap gap-2">
//                     <button
//                       type="button"
//                       onClick={
//                         selectAllDuplicates
//                       }
//                       className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-200 transition hover:bg-slate-700"
//                     >
//                       Select Extra Copies
//                     </button>

//                     <button
//                       type="button"
//                       onClick={
//                         clearSelections
//                       }
//                       className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-400 transition hover:bg-slate-700"
//                     >
//                       Clear
//                     </button>

//                     <button
//                       type="button"
//                       onClick={
//                         deleteSelectedQuestions
//                       }
//                       disabled={
//                         !selectedDuplicateIds.length
//                       }
//                       className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-xs font-black text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-40"
//                     >
//                       <Trash2 className="h-4 w-4" />

//                       Delete Selected

//                       {selectedDuplicateIds.length >
//                         0 &&
//                         ` (${selectedDuplicateIds.length})`}
//                     </button>
//                   </div>
//                 </div>

//                 {/* SEARCH */}

//                 <div className="mt-5 flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
//                   <Search className="h-4 w-4 text-slate-500" />

//                   <input
//                     value={
//                       searchTerm
//                     }
//                     onChange={(
//                       event,
//                     ) =>
//                       setSearchTerm(
//                         event.target
//                           .value,
//                       )
//                     }
//                     placeholder="Search duplicate questions..."
//                     className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
//                   />

//                   <Filter className="h-4 w-4 text-slate-600" />
//                 </div>
//               </div>

//               {/* GROUPS */}

//               <div className="divide-y divide-slate-800">
//                 {filteredGroups.map(
//                   (
//                     group,
//                     groupIndex,
//                   ) => {
//                     const isExpanded =
//                       expandedGroups.includes(
//                         group.fingerprint,
//                       );

//                     const hasCrossDifficulty =
//                       new Set(
//                         group.questions.map(
//                           (question) =>
//                             question.difficultySource,
//                         ),
//                       ).size > 1;

//                     return (
//                       <div
//                         key={
//                           group.fingerprint
//                         }
//                       >
//                         <button
//                           type="button"
//                           onClick={() =>
//                             toggleGroup(
//                               group.fingerprint,
//                             )
//                           }
//                           className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-slate-800/50 sm:p-6"
//                         >
//                           <div className="flex min-w-0 items-start gap-4">
//                             <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-sm font-black text-amber-300">
//                               {groupIndex +
//                                 1}
//                             </div>

//                             <div className="min-w-0">
//                               <div className="mb-2 flex flex-wrap items-center gap-2">
//                                 <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-red-300">
//                                   Duplicate
//                                 </span>

//                                 {hasCrossDifficulty && (
//                                   <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-cyan-300">
//                                     Cross-Difficulty
//                                   </span>
//                                 )}

//                                 <span className="text-xs font-bold text-slate-500">
//                                   {
//                                     group
//                                       .questions
//                                       .length
//                                   }{" "}
//                                   copies
//                                 </span>
//                               </div>

//                               <p className="line-clamp-2 text-sm font-semibold leading-6 text-slate-200">
//                                 {
//                                   group
//                                     .questions[0]
//                                     .question
//                                 }
//                               </p>
//                             </div>
//                           </div>

//                           <ChevronDown
//                             className={`h-5 w-5 shrink-0 text-slate-500 transition ${
//                               isExpanded
//                                 ? "rotate-180"
//                                 : ""
//                             }`}
//                           />
//                         </button>

//                         {isExpanded && (
//                           <div className="space-y-4 bg-slate-950/60 px-5 pb-5 sm:px-6 sm:pb-6">
//                             {group.questions.map(
//                               (
//                                 question,
//                                 questionIndex,
//                               ) => {
//                                 const isSelected =
//                                   selectedDuplicateIds.includes(
//                                     question.localId,
//                                   );

//                                 const isOriginal =
//                                   questionIndex ===
//                                   0;

//                                 return (
//                                   <div
//                                     key={
//                                       question.localId
//                                     }
//                                     className={`rounded-2xl border p-5 transition ${
//                                       isSelected
//                                         ? "border-red-500/40 bg-red-500/5"
//                                         : "border-slate-800 bg-slate-900"
//                                     }`}
//                                   >
//                                     <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
//                                       <div className="flex min-w-0 gap-4">
//                                         {/* CHECKBOX */}

//                                         <button
//                                           type="button"
//                                           onClick={() =>
//                                             toggleDuplicateQuestion(
//                                               question.localId,
//                                             )
//                                           }
//                                           aria-label={
//                                             isSelected
//                                               ? "Unselect question"
//                                               : "Select question"
//                                           }
//                                           className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${
//                                             isSelected
//                                               ? "border-red-400 bg-red-400 text-slate-950"
//                                               : "border-slate-600 bg-slate-950"
//                                           }`}
//                                         >
//                                           {isSelected && (
//                                             <CheckCircle2 className="h-4 w-4" />
//                                           )}
//                                         </button>

//                                         <div className="min-w-0">
//                                           {/* META */}

//                                           <div className="mb-2 flex flex-wrap items-center gap-2">
//                                             <span className="text-xs font-black uppercase tracking-wider text-slate-500">
//                                               Question{" "}
//                                               {questionIndex +
//                                                 1}
//                                             </span>

//                                             <span
//                                               className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
//                                                 DIFFICULTY_COLORS[
//                                                   question.difficultySource
//                                                 ]
//                                               }`}
//                                             >
//                                               {
//                                                 DIFFICULTY_LABELS[
//                                                   question.difficultySource
//                                                 ]
//                                               }
//                                             </span>

//                                             {isOriginal ? (
//                                               <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-300">
//                                                 Keep
//                                               </span>
//                                             ) : (
//                                               <span className="rounded-full bg-red-400/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-red-300">
//                                                 Duplicate
//                                               </span>
//                                             )}
//                                           </div>

//                                           {/* QUESTION */}

//                                           <p className="text-sm font-semibold leading-6 text-slate-200">
//                                             {
//                                               question.question
//                                             }
//                                           </p>

//                                           {/* DETAILS */}

//                                           <div className="mt-4 flex flex-wrap gap-2">
//                                             <span className="rounded-lg bg-slate-800 px-2.5 py-1.5 text-[11px] font-semibold text-slate-400">
//                                               Topic:{" "}
//                                               {question.topic ||
//                                                 "No topic"}
//                                             </span>

//                                             <span className="rounded-lg bg-slate-800 px-2.5 py-1.5 text-[11px] font-semibold text-slate-400">
//                                               Difficulty value:{" "}
//                                               {
//                                                 question.difficulty
//                                               }
//                                             </span>

//                                             <span className="rounded-lg bg-slate-800 px-2.5 py-1.5 text-[11px] font-semibold text-slate-400">
//                                               Source:{" "}
//                                               {
//                                                 question.difficultySource
//                                               }
//                                             </span>

//                                             <span className="rounded-lg bg-slate-800 px-2.5 py-1.5 text-[11px] font-semibold text-slate-400">
//                                               Exam:{" "}
//                                               {question.examType.toUpperCase()}
//                                             </span>
//                                           </div>

//                                           {/* OPTIONS */}

//                                           <div className="mt-4 grid gap-2">
//                                             {question.options.map(
//                                               (
//                                                 option,
//                                               ) => (
//                                                 <div
//                                                   key={`${question.localId}-${option.label}`}
//                                                   className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-400"
//                                                 >
//                                                   <span className="mr-2 font-black text-slate-300">
//                                                     {
//                                                       option.label
//                                                     }
//                                                     .
//                                                   </span>

//                                                   {
//                                                     option.value
//                                                   }
//                                                 </div>
//                                               ),
//                                             )}
//                                           </div>
//                                         </div>
//                                       </div>

//                                       {/* DELETE */}

//                                       <button
//                                         type="button"
//                                         onClick={() =>
//                                           deleteQuestion(
//                                             question.localId,
//                                           )
//                                         }
//                                         className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-xs font-black text-red-300 transition hover:bg-red-500/20"
//                                       >
//                                         <Trash2 className="h-4 w-4" />
//                                         Delete
//                                       </button>
//                                     </div>

//                                     {!isOriginal && (
//                                       <button
//                                         type="button"
//                                         onClick={() =>
//                                           selectOnlyQuestion(
//                                             question.localId,
//                                           )
//                                         }
//                                         className="mt-4 text-xs font-bold text-cyan-400 hover:text-cyan-300"
//                                       >
//                                         {isSelected
//                                           ? "Selected for deletion"
//                                           : "Select this duplicate for deletion"}
//                                       </button>
//                                     )}
//                                   </div>
//                                 );
//                               },
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     );
//                   },
//                 )}

//                 {filteredGroups.length ===
//                   0 && (
//                   <div className="p-12 text-center">
//                     <Search className="mx-auto h-8 w-8 text-slate-700" />

//                     <p className="mt-4 text-sm font-bold text-slate-400">
//                       No matching duplicate groups found.
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </section>
//           )}

//         {/* ======================================================
//             CROSS-DIFFICULTY SUMMARY
//         ======================================================= */}

//         {hasLoadedQuestions &&
//           hasCrossDifficultyDuplicates && (
//             <section className="mt-8 overflow-hidden rounded-3xl border border-cyan-400/20 bg-cyan-400/5">
//               <div className="border-b border-cyan-400/10 p-5 sm:p-6">
//                 <div className="flex items-start gap-3">
//                   <Layers3 className="mt-0.5 h-5 w-5 text-cyan-400" />

//                   <div>
//                     <h2 className="text-xl font-black text-white">
//                       Cross-Difficulty Duplicates
//                     </h2>

//                     <p className="mt-1 text-sm leading-6 text-slate-400">
//                       These are exact duplicates where the
//                       same question exists in different
//                       difficulty banks.
//                     </p>
//                   </div>
//                 </div>

//                 <div className="mt-5 flex flex-wrap gap-3">
//                   <span className="rounded-xl bg-slate-950 px-4 py-3 text-xs font-bold text-slate-300">
//                     Simple ↔ Medium:{" "}
//                     <strong className="text-amber-300">
//                       {
//                         crossPairStats.simpleMedium
//                       }
//                     </strong>
//                   </span>

//                   <span className="rounded-xl bg-slate-950 px-4 py-3 text-xs font-bold text-slate-300">
//                     Simple ↔ Hard:{" "}
//                     <strong className="text-amber-300">
//                       {
//                         crossPairStats.simpleHard
//                       }
//                     </strong>
//                   </span>

//                   <span className="rounded-xl bg-slate-950 px-4 py-3 text-xs font-bold text-slate-300">
//                     Medium ↔ Hard:{" "}
//                     <strong className="text-amber-300">
//                       {
//                         crossPairStats.mediumHard
//                       }
//                     </strong>
//                   </span>
//                 </div>
//               </div>

//               <div className="divide-y divide-cyan-400/10">
//                 {filteredCrossDifficulty.map(
//                   (
//                     pair,
//                     index,
//                   ) => (
//                     <div
//                       key={`${pair.key}-${index}`}
//                       className="p-5 sm:p-6"
//                     >
//                       <div className="mb-4 flex flex-wrap items-center gap-2">
//                         <span className="rounded-full bg-red-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-red-300">
//                           Exact Overlap
//                         </span>

//                         <span className="rounded-full bg-cyan-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-cyan-300">
//                           {
//                             pair.label
//                           }
//                         </span>
//                       </div>

//                       <div className="grid gap-4 lg:grid-cols-2">
//                         {/* FIRST */}

//                         <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
//                           <div className="mb-3 flex flex-wrap items-center gap-2">
//                             <span
//                               className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${
//                                 DIFFICULTY_COLORS[
//                                   pair.first
//                                     .difficultySource
//                                 ]
//                               }`}
//                             >
//                               {
//                                 DIFFICULTY_LABELS[
//                                   pair.first
//                                     .difficultySource
//                                 ]
//                               }
//                             </span>
//                           </div>

//                           <p className="text-sm font-semibold leading-6 text-slate-200">
//                             {
//                               pair.first
//                                 .question
//                             }
//                           </p>

//                           <p className="mt-3 text-xs text-slate-500">
//                             Topic:{" "}
//                             {
//                               pair.first
//                                 .topic
//                             }
//                           </p>

//                           <button
//                             type="button"
//                             onClick={() =>
//                               deleteQuestion(
//                                 pair.first
//                                   .localId,
//                               )
//                             }
//                             className="mt-4 inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-500/20"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                             Delete This
//                           </button>
//                         </div>

//                         {/* SECOND */}

//                         <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
//                           <div className="mb-3 flex flex-wrap items-center gap-2">
//                             <span
//                               className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${
//                                 DIFFICULTY_COLORS[
//                                   pair.second
//                                     .difficultySource
//                                 ]
//                               }`}
//                             >
//                               {
//                                 DIFFICULTY_LABELS[
//                                   pair.second
//                                     .difficultySource
//                                 ]
//                               }
//                             </span>
//                           </div>

//                           <p className="text-sm font-semibold leading-6 text-slate-200">
//                             {
//                               pair.second
//                                 .question
//                             }
//                           </p>

//                           <p className="mt-3 text-xs text-slate-500">
//                             Topic:{" "}
//                             {
//                               pair.second
//                                 .topic
//                             }
//                           </p>

//                           <button
//                             type="button"
//                             onClick={() =>
//                               deleteQuestion(
//                                 pair.second
//                                   .localId,
//                               )
//                             }
//                             className="mt-4 inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-500/20"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                             Delete This
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ),
//                 )}
//               </div>
//             </section>
//           )}

//         {/* ======================================================
//             EMPTY STATE
//         ======================================================= */}

//         {!hasLoadedQuestions &&
//           !loadingBank && (
//             <section className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center">
//               <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800">
//                 <FileSearch className="h-7 w-7 text-slate-500" />
//               </div>

//               <h2 className="mt-5 text-lg font-black text-slate-300">
//                 No Question Banks Loaded
//               </h2>

//               <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
//                 Select a subject and examination
//                 type, then click Load All Banks.
//                 The validator will compare Simple,
//                 Medium, and Hard together.
//               </p>
//             </section>
//           )}

//         {/* ======================================================
//             CURRENT QUESTION BANK
//         ======================================================= */}

//         {hasLoadedQuestions && (
//           <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
//             <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
//               <div>
//                 <h2 className="font-black text-white">
//                   Validation Session
//                 </h2>

//                 <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
//                   Questions are held in memory while
//                   you review them. Deleting a question
//                   does not modify the original
//                   TypeScript source file.
//                 </p>
//               </div>

//               <div className="flex flex-wrap gap-3">
//                 <button
//                   type="button"
//                   onClick={
//                     loadQuestionFile
//                   }
//                   disabled={
//                     loadingBank
//                   }
//                   className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-xs font-black text-slate-200 transition hover:bg-slate-700 disabled:opacity-50"
//                 >
//                   <RefreshCw className="h-4 w-4" />

//                   Reload All Banks
//                 </button>

//                 <button
//                   type="button"
//                   onClick={
//                     saveAllCleanedBanks
//                   }
//                   disabled={!isClean}
//                   className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 text-xs font-black text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
//                 >
//                   <Download className="h-4 w-4" />

//                   Save All Clean Banks
//                 </button>
//               </div>
//             </div>

//             {/* BANK DOWNLOAD BUTTONS */}

//             <div className="mt-6 grid gap-3 md:grid-cols-3">
//               {(
//                 [
//                   "simple",
//                   "medium",
//                   "hard",
//                 ] as QuestionDifficulty[]
//               ).map(
//                 (difficulty) => (
//                   <button
//                     key={difficulty}
//                     type="button"
//                     onClick={() =>
//                       downloadDifficultyBank(
//                         difficulty,
//                       )
//                     }
//                     disabled={
//                       hasValidationErrors ||
//                       hasDuplicates ||
//                       difficultyStats[
//                         difficulty
//                       ] === 0
//                     }
//                     className={`rounded-2xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-40 ${
//                       difficulty ===
//                       "simple"
//                         ? "border-emerald-400/20 bg-emerald-400/5 hover:bg-emerald-400/10"
//                         : difficulty ===
//                           "medium"
//                         ? "border-cyan-400/20 bg-cyan-400/5 hover:bg-cyan-400/10"
//                         : "border-purple-400/20 bg-purple-400/5 hover:bg-purple-400/10"
//                     }`}
//                   >
//                     <div className="flex items-center justify-between">
//                       <span className="text-xs font-black uppercase tracking-wider">
//                         {
//                           DIFFICULTY_LABELS[
//                             difficulty
//                           ]
//                         }
//                       </span>

//                       <Download className="h-4 w-4" />
//                     </div>

//                     <p className="mt-2 text-2xl font-black">
//                       {difficultyStats[
//                         difficulty
//                       ].toLocaleString()}
//                     </p>

//                     <p className="mt-1 text-xs text-slate-500">
//                       Save this bank separately
//                     </p>
//                   </button>
//                 ),
//               )}
//             </div>

//             {/* SUMMARY */}

//             <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
//               <div className="rounded-xl bg-slate-950 p-4">
//                 <p className="text-xs font-bold text-slate-600">
//                   Current Questions
//                 </p>

//                 <p className="mt-1 text-xl font-black text-white">
//                   {questions.length.toLocaleString()}
//                 </p>
//               </div>

//               <div className="rounded-xl bg-slate-950 p-4">
//                 <p className="text-xs font-bold text-slate-600">
//                   Duplicate Groups
//                 </p>

//                 <p className="mt-1 text-xl font-black text-amber-400">
//                   {duplicateGroups.length.toLocaleString()}
//                 </p>
//               </div>

//               <div className="rounded-xl bg-slate-950 p-4">
//                 <p className="text-xs font-bold text-slate-600">
//                   Cross-Difficulty
//                 </p>

//                 <p className="mt-1 text-xl font-black text-cyan-400">
//                   {crossDifficultyDuplicates.length.toLocaleString()}
//                 </p>
//               </div>

//               <div className="rounded-xl bg-slate-950 p-4">
//                 <p className="text-xs font-bold text-slate-600">
//                   Status
//                 </p>

//                 <p
//                   className={`mt-1 text-xl font-black ${
//                     isClean
//                       ? "text-emerald-400"
//                       : "text-amber-400"
//                   }`}
//                 >
//                   {isClean
//                     ? "CLEAN"
//                     : "NEEDS REVIEW"}
//                 </p>
//               </div>
//             </div>

//             {/* STATUS INFORMATION */}

//             {!isClean && (
//               <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4">
//                 <div className="flex items-start gap-3">
//                   <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />

//                   <div>
//                     <p className="text-sm font-bold text-amber-300">
//                       Validation requires review
//                     </p>

//                     <div className="mt-2 space-y-1 text-xs leading-5 text-slate-400">
//                       {hasDuplicates && (
//                         <p>
//                           •{" "}
//                           {
//                             duplicateCopiesCount
//                           }{" "}
//                           exact duplicate copies
//                           need review.
//                         </p>
//                       )}

//                       {difficultyValidationErrors.length >
//                         0 && (
//                         <p>
//                           •{" "}
//                           {
//                             difficultyValidationErrors.length
//                           }{" "}
//                           difficulty integrity
//                           errors detected.
//                         </p>
//                       )}

//                       {structuralValidationErrors.length >
//                         0 && (
//                         <p>
//                           •{" "}
//                           {
//                             structuralValidationErrors.length
//                           }{" "}
//                           structural errors
//                           detected.
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {isClean && (
//               <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4">
//                 <div className="flex items-start gap-3">
//                   <Download className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />

//                   <div>
//                     <p className="text-sm font-bold text-cyan-300">
//                       Ready to save
//                     </p>

//                     <p className="mt-1 text-xs leading-5 text-slate-400">
//                       The three banks will be
//                       downloaded separately so you
//                       can place them back into:
//                     </p>

//                     <div className="mt-3 space-y-1 font-mono text-[11px] text-slate-500">
//                       <p>
//                         biology/simple/jamb.ts
//                       </p>

//                       <p>
//                         biology/medium/jamb.ts
//                       </p>

//                       <p>
//                         biology/hard/jamb.ts
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </section>
//         )}
//       </div>
//     </main>
//   );
// }




"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Copy,
  Database,
  FileSearch,
  Loader2,
  RefreshCw,
  Search,
  Trash2,
  AlertTriangle,
  BookOpen,
  Filter,
  Download,
  Layers3,
  ShieldCheck,
  AlertCircle,
  Wrench,
  Eye,
  X,
} from "lucide-react";

import { getSubjectsByPlan } from "@/lib/api/subjects";
import {
  getQuestionBanks,
  type QuestionDifficulty,
} from "../../competitions/createquestion/questions";

type ExamType = "jamb" | "waec" | "neco";

type Subject = {
  _id: string;
  name: string;
  slug?: string;
};

type QuestionOption = {
  label: string;
  value: string;
};

type QuestionContent = {
  type: string;
  order: number;
  segments?: {
    text: string;
    styles?: string[];
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
};

type QuestionBankItem = {
  content: QuestionContent[];
  question: string;
  instruction: string;
  topic: string;
  section: string;
  options: QuestionOption[];
  correctAnswers: string[];
  explanation: string;
  explanationSteps: string[];
  difficulty: "easy" | "medium" | "hard";
  examType: ExamType;
  apiSubjectName: string;
  isMultipleAnswer: boolean;
};

type QuestionWithId = QuestionBankItem & {
  localId: string;
  difficultySource: QuestionDifficulty;
  sourceIndex: number;
};

type DuplicateGroup = {
  fingerprint: string;
  questions: QuestionWithId[];
};

type DifficultyStats = {
  simple: number;
  medium: number;
  hard: number;
};

type CrossDifficultyPair = {
  key: string;
  label: string;
  first: QuestionWithId;
  second: QuestionWithId;
};

const DIFFICULTY_LABELS: Record<
  QuestionDifficulty,
  string
> = {
  simple: "Simple / Easy",
  medium: "Medium",
  hard: "Hard",
};

const DIFFICULTY_COLORS: Record<
  QuestionDifficulty,
  string
> = {
  simple: "text-emerald-300 bg-emerald-400/10",
  medium: "text-cyan-300 bg-cyan-400/10",
  hard: "text-purple-300 bg-purple-400/10",
};

function createLocalId(
  difficulty: QuestionDifficulty,
  index: number,
) {
  return `question-${difficulty}-${Date.now()}-${index}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/[“”‘’]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.!?;:])/g, "$1")
    .trim();
}

function getFingerprint(
  question: QuestionBankItem,
) {
  const questionText = normalizeText(
    question.question,
  );

  const options = question.options
    .map((option) =>
      normalizeText(option.value),
    )
    .sort()
    .join("|");

  return [
    normalizeText(question.apiSubjectName),
    question.examType,
    questionText,
    options,
  ].join("::");
}

function convertBankToLocal(
  bank: QuestionBankItem[],
  difficultySource: QuestionDifficulty,
): QuestionWithId[] {
  return bank.map((question, index) => ({
    ...question,

    localId: createLocalId(
      difficultySource,
      index,
    ),

    difficultySource,

    sourceIndex: index,

    content:
      question.content?.map((block) => ({
        ...block,

        segments: block.segments?.map(
          (segment) => ({
            ...segment,
            styles: segment.styles
              ? [...segment.styles]
              : undefined,
          }),
        ),

        table: block.table?.map((row) => [
          ...row,
        ]),

        graph: block.graph
          ? {
              ...block.graph,

              labels: [
                ...block.graph.labels,
              ],

              datasets:
                block.graph.datasets.map(
                  (dataset) => ({
                    ...dataset,
                    data: [
                      ...dataset.data,
                    ],
                  }),
                ),
            }
          : undefined,
      })) ?? [],

    options: question.options.map(
      (option) => ({
        ...option,
      }),
    ),

    correctAnswers: [
      ...question.correctAnswers,
    ],

    explanationSteps: [
      ...question.explanationSteps,
    ],
  }));
}

/**
 * Folder -> schema difficulty
 *
 * simple -> easy
 * medium -> medium
 * hard -> hard
 */
function getExpectedDifficulty(
  source: QuestionDifficulty,
): QuestionBankItem["difficulty"] {
  if (source === "simple") {
    return "easy";
  }

  return source;
}

function createFileName(
  subjectName: string,
  examType: ExamType,
  difficulty: QuestionDifficulty,
) {
  const subjectSlug = subjectName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${subjectSlug}-${examType}-${difficulty}.ts`;
}

function createFileContent(
  questions: QuestionBankItem[],
) {
  return `import type { QuestionBankItem } from "../../types";

const questions: QuestionBankItem[] = ${JSON.stringify(
    questions,
    null,
    2,
  )};

export default questions;
`;
}

export default function QuestionBankValidatorPage() {
  const [subjects, setSubjects] = useState<
    Subject[]
  >([]);

  const [
    selectedSubjectId,
    setSelectedSubjectId,
  ] = useState("");

  const [
    selectedExamType,
    setSelectedExamType,
  ] = useState<ExamType>("jamb");

  const [
    questions,
    setQuestions,
  ] = useState<QuestionWithId[]>([]);

  const [
    loadingSubjects,
    setLoadingSubjects,
  ] = useState(true);

  const [
    loadingBank,
    setLoadingBank,
  ] = useState(false);

  const [
    pageError,
    setPageError,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    selectedDuplicateIds,
    setSelectedDuplicateIds,
  ] = useState<string[]>([]);

  const [
    expandedGroups,
    setExpandedGroups,
  ] = useState<string[]>([]);

  const [
    showDifficultyErrors,
    setShowDifficultyErrors,
  ] = useState(false);

  /*
   * ============================================================
   * LOAD SUBJECTS
   * ============================================================
   */

  useEffect(() => {
    async function loadSubjects() {
      try {
        setLoadingSubjects(true);
        setPageError("");

        const response =
          await getSubjectsByPlan(
            "SECONDARY",
            1,
            100,
          );

        const loadedSubjects: Subject[] =
          response?.data?.subjectObj ?? [];

        setSubjects(loadedSubjects);

        if (loadedSubjects.length > 0) {
          setSelectedSubjectId(
            loadedSubjects[0]._id,
          );
        }
      } catch (error) {
        console.error(
          "Failed to load subjects:",
          error,
        );

        setPageError(
          "Unable to load secondary subjects. Please try again.",
        );
      } finally {
        setLoadingSubjects(false);
      }
    }

    loadSubjects();
  }, []);

  /*
   * ============================================================
   * SELECTED SUBJECT
   * ============================================================
   */

  const selectedSubject = useMemo(
    () =>
      subjects.find(
        (subject) =>
          subject._id ===
          selectedSubjectId,
      ),
    [
      subjects,
      selectedSubjectId,
    ],
  );

  /*
   * ============================================================
   * AVAILABLE BANKS
   * ============================================================
   */

  const availableBanks = useMemo(() => {
    if (!selectedSubject) {
      return {
        simple: [],
        medium: [],
        hard: [],
      };
    }

    return getQuestionBanks(
      selectedSubject.name,
      selectedExamType,
    );
  }, [
    selectedSubject,
    selectedExamType,
  ]);

  const availableTotal =
    availableBanks.simple.length +
    availableBanks.medium.length +
    availableBanks.hard.length;

  /*
   * ============================================================
   * DIFFICULTY COUNTS
   * ============================================================
   */

  const difficultyStats =
    useMemo<DifficultyStats>(
      () => ({
        simple: questions.filter(
          (question) =>
            question.difficultySource ===
            "simple",
        ).length,

        medium: questions.filter(
          (question) =>
            question.difficultySource ===
            "medium",
        ).length,

        hard: questions.filter(
          (question) =>
            question.difficultySource ===
            "hard",
        ).length,
      }),
      [questions],
    );

  /*
   * ============================================================
   * DUPLICATE GROUPS
   * ============================================================
   */

  const duplicateGroups =
    useMemo<DuplicateGroup[]>(
      () => {
        const groups = new Map<
          string,
          QuestionWithId[]
        >();

        for (const question of questions) {
          const fingerprint =
            getFingerprint(question);

          const existing =
            groups.get(fingerprint);

          if (existing) {
            existing.push(question);
          } else {
            groups.set(fingerprint, [
              question,
            ]);
          }
        }

        return Array.from(
          groups.entries(),
        )
          .filter(
            ([, group]) =>
              group.length > 1,
          )
          .map(
            ([
              fingerprint,
              group,
            ]) => ({
              fingerprint,
              questions: group,
            }),
          );
      },
      [questions],
    );

  /*
   * ============================================================
   * CROSS-DIFFICULTY DUPLICATES
   * ============================================================
   */

  const crossDifficultyDuplicates =
    useMemo<
      CrossDifficultyPair[]
    >(() => {
      const pairs: CrossDifficultyPair[] =
        [];

      for (const group of duplicateGroups) {
        for (
          let a = 0;
          a < group.questions.length;
          a++
        ) {
          for (
            let b = a + 1;
            b <
            group.questions.length;
            b++
          ) {
            const first =
              group.questions[a];

            const second =
              group.questions[b];

            if (
              first.difficultySource ===
              second.difficultySource
            ) {
              continue;
            }

            const difficulties = [
              first.difficultySource,
              second.difficultySource,
            ].sort();

            const pairKey = `${group.fingerprint}::${difficulties.join(
              "-",
            )}`;

            pairs.push({
              key: pairKey,
              label: `${DIFFICULTY_LABELS[first.difficultySource]} ↔ ${DIFFICULTY_LABELS[second.difficultySource]}`,
              first,
              second,
            });
          }
        }
      }

      return pairs;
    }, [duplicateGroups]);

  /*
   * ============================================================
   * CROSS-DIFFICULTY COUNTS
   * ============================================================
   */

  const crossPairStats = useMemo(
    () => {
      let simpleMedium = 0;
      let simpleHard = 0;
      let mediumHard = 0;

      for (const pair of crossDifficultyDuplicates) {
        const values = [
          pair.first.difficultySource,
          pair.second.difficultySource,
        ].sort();

        const key = values.join("-");

        if (key === "medium-simple") {
          simpleMedium++;
        }

        if (key === "hard-simple") {
          simpleHard++;
        }

        if (key === "hard-medium") {
          mediumHard++;
        }
      }

      return {
        simpleMedium,
        simpleHard,
        mediumHard,
      };
    },
    [crossDifficultyDuplicates],
  );

  /*
   * ============================================================
   * DUPLICATE COUNTS
   * ============================================================
   */

  const duplicateQuestionCount =
    useMemo(
      () =>
        duplicateGroups.reduce(
          (total, group) =>
            total +
            group.questions.length,
          0,
        ),
      [duplicateGroups],
    );

  const duplicateCopiesCount =
    useMemo(
      () =>
        duplicateGroups.reduce(
          (total, group) =>
            total +
            group.questions.length -
            1,
          0,
        ),
      [duplicateGroups],
    );

  const uniqueQuestionCount =
    questions.length -
    duplicateCopiesCount;

  /*
   * ============================================================
   * DIFFICULTY INTEGRITY
   * ============================================================
   */

  const difficultyValidationErrors =
    useMemo(() => {
      return questions.filter(
        (question) =>
          question.difficulty !==
          getExpectedDifficulty(
            question.difficultySource,
          ),
      );
    }, [questions]);

  /*
   * ============================================================
   * DIFFICULTY ERROR COUNTS BY SOURCE
   * ============================================================
   */

  const difficultyErrorStats =
    useMemo(() => {
      const stats = {
        simple: 0,
        medium: 0,
        hard: 0,
      };

      for (const question of difficultyValidationErrors) {
        stats[question.difficultySource]++;
      }

      return stats;
    }, [
      difficultyValidationErrors,
    ]);

  /*
   * ============================================================
   * STRUCTURAL VALIDATION
   * ============================================================
   */

  const structuralValidationErrors =
    useMemo(() => {
      return questions.filter(
        (question) => {
          if (
            !question.question?.trim()
          ) {
            return true;
          }

          if (
            !Array.isArray(
              question.options,
            ) ||
            question.options.length !==
              4
          ) {
            return true;
          }

          if (
            !Array.isArray(
              question.correctAnswers,
            ) ||
            question.correctAnswers
              .length !== 1
          ) {
            return true;
          }

          if (
            question.section !==
            "objective"
          ) {
            return true;
          }

          if (
            !question.apiSubjectName
          ) {
            return true;
          }

          if (
            question.examType !==
            selectedExamType
          ) {
            return true;
          }

          if (
            question.isMultipleAnswer
          ) {
            return true;
          }

          return false;
        },
      );
    }, [
      questions,
      selectedExamType,
    ]);

  /*
   * ============================================================
   * SEARCH
   * ============================================================
   */

  const filteredGroups =
    useMemo(() => {
      const normalizedSearch =
        normalizeText(searchTerm);

      if (!normalizedSearch) {
        return duplicateGroups;
      }

      return duplicateGroups.filter(
        (group) =>
          group.questions.some(
            (question) =>
              normalizeText(
                question.question,
              ).includes(
                normalizedSearch,
              ) ||
              normalizeText(
                question.topic,
              ).includes(
                normalizedSearch,
              ) ||
              question.options.some(
                (option) =>
                  normalizeText(
                    option.value,
                  ).includes(
                    normalizedSearch,
                  ),
              ),
          ),
      );
    }, [
      duplicateGroups,
      searchTerm,
    ]);

  const filteredCrossDifficulty =
    useMemo(() => {
      const normalizedSearch =
        normalizeText(searchTerm);

      if (!normalizedSearch) {
        return crossDifficultyDuplicates;
      }

      return crossDifficultyDuplicates.filter(
        (pair) =>
          normalizeText(
            pair.first.question,
          ).includes(
            normalizedSearch,
          ) ||
          normalizeText(
            pair.second.question,
          ).includes(
            normalizedSearch,
          ) ||
          normalizeText(
            pair.first.topic,
          ).includes(
            normalizedSearch,
          ) ||
          normalizeText(
            pair.second.topic,
          ).includes(
            normalizedSearch,
          ),
      );
    }, [
      crossDifficultyDuplicates,
      searchTerm,
    ]);

  /*
   * ============================================================
   * STATES
   * ============================================================
   */

  const hasLoadedQuestions =
    questions.length > 0;

  const hasDuplicates =
    duplicateGroups.length > 0;

  const hasCrossDifficultyDuplicates =
    crossDifficultyDuplicates.length >
    0;

  const hasValidationErrors =
    difficultyValidationErrors.length >
      0 ||
    structuralValidationErrors.length >
      0;

  const isClean =
    hasLoadedQuestions &&
    !hasDuplicates &&
    !hasValidationErrors;

  /*
   * ============================================================
   * LOAD BANKS
   * ============================================================
   */

  function loadQuestionFile() {
    if (!selectedSubject) {
      setPageError(
        "Please select a subject first.",
      );
      return;
    }

    setPageError("");
    setSuccessMessage("");
    setSelectedDuplicateIds([]);
    setExpandedGroups([]);
    setSearchTerm("");
    setShowDifficultyErrors(false);
    setLoadingBank(true);

    try {
      const banks =
        getQuestionBanks(
          selectedSubject.name,
          selectedExamType,
        );

      const total =
        banks.simple.length +
        banks.medium.length +
        banks.hard.length;

      if (total === 0) {
        setQuestions([]);

        setPageError(
          `No ${selectedExamType.toUpperCase()} question banks are available for ${selectedSubject.name}.`,
        );

        return;
      }

      const loadedQuestions: QuestionWithId[] =
        [
          ...convertBankToLocal(
            banks.simple,
            "simple",
          ),
          ...convertBankToLocal(
            banks.medium,
            "medium",
          ),
          ...convertBankToLocal(
            banks.hard,
            "hard",
          ),
        ];

      setQuestions(
        loadedQuestions,
      );

      setSuccessMessage(
        `${loadedQuestions.length.toLocaleString()} questions loaded across Simple, Medium, and Hard banks for ${selectedSubject.name} ${selectedExamType.toUpperCase()}.`,
      );
    } catch (error) {
      console.error(
        "Failed to load question banks:",
        error,
      );

      setQuestions([]);

      setPageError(
        "The question banks could not be loaded. Check the question files and try again.",
      );
    } finally {
      setLoadingBank(false);
    }
  }

  /*
   * ============================================================
   * FIX ALL DIFFICULTY VALUES
   * ============================================================
   *
   * IMPORTANT:
   *
   * This changes ONLY the in-memory validation session.
   *
   * It does NOT modify jamb.ts directly.
   *
   * The corrected files are saved when the user
   * downloads the cleaned banks.
   * ============================================================
   */

  function fixAllDifficultyValues() {
    if (
      difficultyValidationErrors.length ===
      0
    ) {
      return;
    }

    setQuestions((current) =>
      current.map((question) => {
        const expected =
          getExpectedDifficulty(
            question.difficultySource,
          );

        if (
          question.difficulty ===
          expected
        ) {
          return question;
        }

        return {
          ...question,
          difficulty: expected,
        };
      }),
    );

    setShowDifficultyErrors(false);

    setSuccessMessage(
      `${difficultyValidationErrors.length.toLocaleString()} difficulty values corrected in the current validation session. Download the cleaned banks to save the corrections.`,
    );
  }

  /*
   * ============================================================
   * TOGGLE DUPLICATE SELECTION
   * ============================================================
   */

  function toggleDuplicateQuestion(
    localId: string,
  ) {
    setSelectedDuplicateIds(
      (current) =>
        current.includes(localId)
          ? current.filter(
              (id) =>
                id !== localId,
            )
          : [
              ...current,
              localId,
            ],
    );
  }

  function selectOnlyQuestion(
    localId: string,
  ) {
    setSelectedDuplicateIds(
      (current) =>
        current.includes(localId)
          ? current
          : [
              ...current,
              localId,
            ],
    );
  }

  /*
   * ============================================================
   * DELETE SELECTED
   * ============================================================
   */

  function deleteSelectedQuestions() {
    if (
      !selectedDuplicateIds.length
    ) {
      return;
    }

    const selectedSet =
      new Set(
        selectedDuplicateIds,
      );

    setQuestions((current) =>
      current.filter(
        (question) =>
          !selectedSet.has(
            question.localId,
          ),
      ),
    );

    const deletedCount =
      selectedDuplicateIds.length;

    setSelectedDuplicateIds([]);

    setSuccessMessage(
      `${deletedCount} question${
        deletedCount === 1
          ? ""
          : "s"
      } removed from the current validation session.`,
    );
  }

  function deleteQuestion(
    localId: string,
  ) {
    setQuestions((current) =>
      current.filter(
        (question) =>
          question.localId !==
          localId,
      ),
    );

    setSelectedDuplicateIds(
      (current) =>
        current.filter(
          (id) =>
            id !== localId,
        ),
    );

    setSuccessMessage(
      "Question removed from the current validation session.",
    );
  }

  /*
   * ============================================================
   * GROUP
   * ============================================================
   */

  function toggleGroup(
    fingerprint: string,
  ) {
    setExpandedGroups(
      (current) =>
        current.includes(
          fingerprint,
        )
          ? current.filter(
              (value) =>
                value !==
                fingerprint,
            )
          : [
              ...current,
              fingerprint,
            ],
    );
  }

  function selectAllDuplicates() {
    const allDuplicateIds =
      duplicateGroups.flatMap(
        (group) =>
          group.questions
            .slice(1)
            .map(
              (question) =>
                question.localId,
            ),
      );

    setSelectedDuplicateIds(
      allDuplicateIds,
    );
  }

  function clearSelections() {
    setSelectedDuplicateIds([]);
  }

  /*
   * ============================================================
   * DOWNLOAD ONE BANK
   * ============================================================
   */

  function downloadDifficultyBank(
    difficulty: QuestionDifficulty,
  ) {
    if (!selectedSubject) {
      setPageError(
        "Please select a subject first.",
      );
      return;
    }

    const difficultyQuestions =
      questions.filter(
        (question) =>
          question.difficultySource ===
          difficulty,
      );

    if (
      difficultyQuestions.length ===
      0
    ) {
      setPageError(
        `There are no ${DIFFICULTY_LABELS[difficulty]} questions to save.`,
      );
      return;
    }

    const cleanQuestions =
      difficultyQuestions.map(
        ({
          localId,
          difficultySource,
          sourceIndex,
          ...question
        }) => question,
      );

    const fileContent =
      createFileContent(
        cleanQuestions,
      );

    const blob = new Blob(
      [fileContent],
      {
        type: "text/typescript;charset=utf-8",
      },
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      createFileName(
        selectedSubject.name,
        selectedExamType,
        difficulty,
      );

    document.body.appendChild(
      link,
    );

    link.click();

    document.body.removeChild(
      link,
    );

    URL.revokeObjectURL(url);

    setSuccessMessage(
      `${DIFFICULTY_LABELS[difficulty]} bank saved as ${link.download}.`,
    );
  }

  /*
   * ============================================================
   * SAVE ALL
   * ============================================================
   */

  function saveAllCleanedBanks() {
    if (!isClean) {
      setPageError(
        "Resolve all duplicate and validation errors before saving.",
      );
      return;
    }

    downloadDifficultyBank(
      "simple",
    );

    setTimeout(() => {
      downloadDifficultyBank(
        "medium",
      );
    }, 300);

    setTimeout(() => {
      downloadDifficultyBank(
        "hard",
      );
    }, 600);

    setSuccessMessage(
      "Clean Simple, Medium, and Hard question banks are being downloaded separately.",
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* HEADER */}

        <div className="mb-8">
          <Link
            href="/admin/secondary/solveandwin"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Solve & Win
          </Link>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                Cross-Difficulty Validator
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Validate Question Banks
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                Validate Simple, Medium, and Hard
                question banks together. Detect
                exact duplicates, difficulty
                mismatches, and structural errors.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3">
              <Database className="h-5 w-5 text-cyan-400" />

              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Validation
                </p>

                <p className="text-sm font-bold text-slate-200">
                  Cross-difficulty
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ALERTS */}

        {pageError && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{pageError}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{successMessage}</p>
          </div>
        )}

        {/* SELECTOR */}

        <section className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-black/20 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
              <BookOpen className="h-5 w-5 text-cyan-400" />
            </div>

            <div>
              <h2 className="font-bold text-white">
                Select Question Banks
              </h2>

              <p className="text-sm text-slate-500">
                The validator loads all three
                difficulty levels.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Subject
              </label>

              <select
                value={selectedSubjectId}
                onChange={(event) => {
                  setSelectedSubjectId(
                    event.target.value,
                  );

                  setQuestions([]);
                  setSelectedDuplicateIds([]);
                  setExpandedGroups([]);
                  setSuccessMessage("");
                  setPageError("");
                  setShowDifficultyErrors(false);
                }}
                disabled={loadingSubjects}
                className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 text-sm font-semibold text-white outline-none transition focus:border-cyan-400"
              >
                {loadingSubjects ? (
                  <option value="">
                    Loading subjects...
                  </option>
                ) : subjects.length ===
                  0 ? (
                  <option value="">
                    No subjects available
                  </option>
                ) : (
                  subjects.map(
                    (subject) => (
                      <option
                        key={subject._id}
                        value={subject._id}
                      >
                        {subject.name}
                      </option>
                    ),
                  )
                )}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Exam Type
              </label>

              <select
                value={selectedExamType}
                onChange={(event) => {
                  setSelectedExamType(
                    event.target.value as ExamType,
                  );

                  setQuestions([]);
                  setSelectedDuplicateIds([]);
                  setExpandedGroups([]);
                  setSuccessMessage("");
                  setPageError("");
                  setShowDifficultyErrors(false);
                }}
                className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 text-sm font-semibold text-white outline-none transition focus:border-cyan-400"
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

            <div className="flex items-end">
              <button
                type="button"
                onClick={loadQuestionFile}
                disabled={
                  loadingBank ||
                  loadingSubjects ||
                  !selectedSubject
                }
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 text-sm font-black text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loadingBank ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading Banks...
                  </>
                ) : (
                  <>
                    <Layers3 className="h-4 w-4" />
                    Load All Banks
                  </>
                )}
              </button>
            </div>
          </div>

          {selectedSubject && (
            <>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl bg-slate-950 p-4">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                    Subject
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    {selectedSubject.name}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-950 p-4">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                    Exam
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    {selectedExamType.toUpperCase()}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-950 p-4">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                    Available Banks
                  </p>

                  <p className="mt-1 text-sm font-black text-cyan-300">
                    {availableTotal.toLocaleString()}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-950 p-4">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                    Validation
                  </p>

                  <p className="mt-1 text-sm font-black text-emerald-300">
                    Simple ↔ Medium ↔ Hard
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {(
                  [
                    "simple",
                    "medium",
                    "hard",
                  ] as QuestionDifficulty[]
                ).map(
                  (difficulty) => (
                    <span
                      key={difficulty}
                      className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wider ${DIFFICULTY_COLORS[difficulty]}`}
                    >
                      {
                        DIFFICULTY_LABELS[
                          difficulty
                        ]
                      }
                      :{" "}
                      {availableBanks[
                        difficulty
                      ].length.toLocaleString()}
                    </span>
                  ),
                )}
              </div>
            </>
          )}
        </section>

        {/* STATISTICS */}

        {hasLoadedQuestions && (
          <>
            <section className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Loaded
                </p>

                <p className="mt-2 text-3xl font-black text-white">
                  {questions.length.toLocaleString()}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Across all difficulty banks
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Simple / Easy
                </p>

                <p className="mt-2 text-3xl font-black text-emerald-300">
                  {difficultyStats.simple.toLocaleString()}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Source: simple/jamb.ts
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Medium
                </p>

                <p className="mt-2 text-3xl font-black text-cyan-300">
                  {difficultyStats.medium.toLocaleString()}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Source: medium/jamb.ts
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  Hard
                </p>

                <p className="mt-2 text-3xl font-black text-purple-300">
                  {difficultyStats.hard.toLocaleString()}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Source: hard/jamb.ts
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Unique
                </p>

                <p className="mt-2 text-3xl font-black text-emerald-400">
                  {uniqueQuestionCount.toLocaleString()}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  After exact duplicates
                </p>
              </div>
            </section>

            <section className="mb-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Simple ↔ Medium
                  </p>

                  <Copy className="h-4 w-4 text-amber-400" />
                </div>

                <p className="mt-2 text-3xl font-black text-amber-300">
                  {crossPairStats.simpleMedium.toLocaleString()}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Simple ↔ Hard
                  </p>

                  <Copy className="h-4 w-4 text-amber-400" />
                </div>

                <p className="mt-2 text-3xl font-black text-amber-300">
                  {crossPairStats.simpleHard.toLocaleString()}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Medium ↔ Hard
                  </p>

                  <Copy className="h-4 w-4 text-amber-400" />
                </div>

                <p className="mt-2 text-3xl font-black text-amber-300">
                  {crossPairStats.mediumHard.toLocaleString()}
                </p>
              </div>
            </section>
          </>
        )}

        {/* VALIDATION CARDS */}

        {hasLoadedQuestions && (
          <section className="mb-8 grid gap-4 lg:grid-cols-3">

            {/* DUPLICATES */}

            <div
              className={`rounded-2xl border p-5 ${
                hasDuplicates
                  ? "border-red-500/20 bg-red-500/5"
                  : "border-emerald-500/20 bg-emerald-500/5"
              }`}
            >
              <div className="flex items-center gap-3">
                {hasDuplicates ? (
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                )}

                <h3 className="font-black">
                  Exact Duplicates
                </h3>
              </div>

              <p className="mt-3 text-sm text-slate-400">
                {hasDuplicates
                  ? `${duplicateCopiesCount.toLocaleString()} duplicate copies require review.`
                  : "No exact duplicates detected."}
              </p>
            </div>

            {/* DIFFICULTY */}

            <button
              type="button"
              onClick={() =>
                setShowDifficultyErrors(
                  true,
                )
              }
              className={`rounded-2xl border p-5 text-left transition hover:brightness-110 ${
                difficultyValidationErrors.length >
                0
                  ? "border-red-500/20 bg-red-500/5"
                  : "border-emerald-500/20 bg-emerald-500/5"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {difficultyValidationErrors.length >
                  0 ? (
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  )}

                  <h3 className="font-black">
                    Difficulty Integrity
                  </h3>
                </div>

                {difficultyValidationErrors.length >
                  0 && (
                  <Eye className="h-4 w-4 text-red-400" />
                )}
              </div>

              <p className="mt-3 text-sm text-slate-400">
                {difficultyValidationErrors.length >
                0
                  ? `${difficultyValidationErrors.length.toLocaleString()} questions have an incorrect difficulty value. Click to inspect.`
                  : "All questions match their source difficulty."}
              </p>

              {difficultyValidationErrors.length >
                0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-black text-emerald-300">
                    Simple:{" "}
                    {
                      difficultyErrorStats.simple
                    }
                  </span>

                  <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-[10px] font-black text-cyan-300">
                    Medium:{" "}
                    {
                      difficultyErrorStats.medium
                    }
                  </span>

                  <span className="rounded-full bg-purple-400/10 px-2.5 py-1 text-[10px] font-black text-purple-300">
                    Hard:{" "}
                    {
                      difficultyErrorStats.hard
                    }
                  </span>
                </div>
              )}
            </button>

            {/* STRUCTURE */}

            <div
              className={`rounded-2xl border p-5 ${
                structuralValidationErrors.length >
                0
                  ? "border-red-500/20 bg-red-500/5"
                  : "border-emerald-500/20 bg-emerald-500/5"
              }`}
            >
              <div className="flex items-center gap-3">
                {structuralValidationErrors.length >
                0 ? (
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                )}

                <h3 className="font-black">
                  Structure
                </h3>
              </div>

              <p className="mt-3 text-sm text-slate-400">
                {structuralValidationErrors.length >
                0
                  ? `${structuralValidationErrors.length.toLocaleString()} questions have structural validation errors.`
                  : "Question structure is valid."}
              </p>
            </div>
          </section>
        )}

        {/* ========================================================
            DIFFICULTY ERROR PANEL
        ========================================================= */}

        {showDifficultyErrors &&
          difficultyValidationErrors.length >
            0 && (
            <section className="mb-8 overflow-hidden rounded-3xl border border-red-500/20 bg-slate-900">

              <div className="border-b border-slate-800 p-5 sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                  <div>
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-6 w-6 text-red-400" />

                      <h2 className="text-xl font-black text-white">
                        Difficulty Integrity Errors
                      </h2>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      These questions have a
                      difficulty value that does not
                      match the folder they came from.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={
                        fixAllDifficultyValues
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 text-xs font-black text-slate-950 transition hover:bg-emerald-300"
                    >
                      <Wrench className="h-4 w-4" />
                      Fix All{" "}
                      {
                        difficultyValidationErrors.length
                      }
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setShowDifficultyErrors(
                          false,
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-xs font-bold text-slate-300 hover:bg-slate-700"
                    >
                      <X className="h-4 w-4" />
                      Close
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-b border-slate-800 bg-slate-950/60 p-4">
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-xl bg-slate-900 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                      Simple Errors
                    </p>

                    <p className="mt-1 text-2xl font-black text-emerald-300">
                      {
                        difficultyErrorStats.simple
                      }
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Expected: easy
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-900 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                      Medium Errors
                    </p>

                    <p className="mt-1 text-2xl font-black text-cyan-300">
                      {
                        difficultyErrorStats.medium
                      }
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Expected: medium
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-900 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                      Hard Errors
                    </p>

                    <p className="mt-1 text-2xl font-black text-purple-300">
                      {
                        difficultyErrorStats.hard
                      }
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Expected: hard
                    </p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-slate-800">
                {difficultyValidationErrors.map(
                  (
                    question,
                    index,
                  ) => {
                    const expected =
                      getExpectedDifficulty(
                        question.difficultySource,
                      );

                    return (
                      <div
                        key={
                          question.localId
                        }
                        className="p-5 sm:p-6"
                      >
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                          <div className="min-w-0">
                            <div className="mb-3 flex flex-wrap items-center gap-2">

                              <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-red-300">
                                Error #{index + 1}
                              </span>

                              <span
                                className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                                  DIFFICULTY_COLORS[
                                    question.difficultySource
                                  ]
                                }`}
                              >
                                Source:{" "}
                                {
                                  question.difficultySource
                                }
                              </span>

                              <span className="rounded-full bg-red-400/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-red-300">
                                Current:{" "}
                                {
                                  question.difficulty
                                }
                              </span>

                              <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-300">
                                Expected:{" "}
                                {expected}
                              </span>
                            </div>

                            <p className="text-sm font-semibold leading-6 text-slate-200">
                              {
                                question.question
                              }
                            </p>

                            <div className="mt-4 flex flex-wrap gap-2">
                              <span className="rounded-lg bg-slate-950 px-3 py-2 text-[11px] font-semibold text-slate-400">
                                Source folder:{" "}
                                <strong className="text-white">
                                  biology/
                                  {
                                    question.difficultySource
                                  }
                                  /
                                  {
                                    selectedExamType
                                  }.ts
                                </strong>
                              </span>

                              <span className="rounded-lg bg-slate-950 px-3 py-2 text-[11px] font-semibold text-slate-400">
                                Source index:{" "}
                                <strong className="text-white">
                                  {
                                    question.sourceIndex
                                  }
                                </strong>
                              </span>

                              <span className="rounded-lg bg-slate-950 px-3 py-2 text-[11px] font-semibold text-slate-400">
                                Topic:{" "}
                                <strong className="text-white">
                                  {
                                    question.topic
                                  }
                                </strong>
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setQuestions(
                                (current) =>
                                  current.map(
                                    (
                                      item,
                                    ) =>
                                      item.localId ===
                                      question.localId
                                        ? {
                                            ...item,
                                            difficulty:
                                              expected,
                                          }
                                        : item,
                                  ),
                              );
                            }}
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-xs font-black text-emerald-300 transition hover:bg-emerald-400/20"
                          >
                            <Wrench className="h-4 w-4" />
                            Fix This
                          </button>
                        </div>

                        <div className="mt-5 rounded-xl border border-red-500/10 bg-red-500/5 p-4">
                          <div className="grid gap-3 sm:grid-cols-3">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                                Source Folder
                              </p>

                              <p className="mt-1 text-sm font-bold text-white">
                                {
                                  question.difficultySource
                                }
                              </p>
                            </div>

                            <div>
                              <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                                Current Value
                              </p>

                              <p className="mt-1 text-sm font-bold text-red-300">
                                {
                                  question.difficulty
                                }
                              </p>
                            </div>

                            <div>
                              <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                                Correct Value
                              </p>

                              <p className="mt-1 text-sm font-bold text-emerald-300">
                                {expected}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </section>
          )}

        {/* CLEAN STATUS */}

        {isClean && (
          <div className="mb-8 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-400/10">
                <ShieldCheck className="h-6 w-6 text-emerald-400" />
              </div>

              <div className="min-w-0">
                <h2 className="text-lg font-black text-emerald-300">
                  All Three Question Banks Are Clean
                </h2>

                <p className="mt-1 text-sm leading-6 text-emerald-200/70">
                  No exact duplicates, difficulty
                  integrity errors, or structural
                  validation errors were detected.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-black text-emerald-300">
                    Simple:{" "}
                    {difficultyStats.simple.toLocaleString()}
                  </span>

                  <span className="rounded-full bg-cyan-400/10 px-3 py-1.5 text-xs font-black text-cyan-300">
                    Medium:{" "}
                    {difficultyStats.medium.toLocaleString()}
                  </span>

                  <span className="rounded-full bg-purple-400/10 px-3 py-1.5 text-xs font-black text-purple-300">
                    Hard:{" "}
                    {difficultyStats.hard.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DUPLICATES */}

        {hasLoadedQuestions &&
          hasDuplicates && (
            <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">

              <div className="border-b border-slate-800 p-5 sm:p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Copy className="h-5 w-5 text-amber-400" />

                      <h2 className="text-xl font-black text-white">
                        Duplicate Questions
                      </h2>
                    </div>

                    <p className="mt-2 text-sm text-slate-400">
                      Exact duplicates are grouped
                      together regardless of difficulty.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={
                        selectAllDuplicates
                      }
                      className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-200 transition hover:bg-slate-700"
                    >
                      Select Extra Copies
                    </button>

                    <button
                      type="button"
                      onClick={
                        clearSelections
                      }
                      className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-400 transition hover:bg-slate-700"
                    >
                      Clear
                    </button>

                    <button
                      type="button"
                      onClick={
                        deleteSelectedQuestions
                      }
                      disabled={
                        !selectedDuplicateIds.length
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-xs font-black text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Trash2 className="h-4 w-4" />

                      Delete Selected

                      {selectedDuplicateIds.length >
                        0 &&
                        ` (${selectedDuplicateIds.length})`}
                    </button>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
                  <Search className="h-4 w-4 text-slate-500" />

                  <input
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(
                        event.target.value,
                      )
                    }
                    placeholder="Search duplicate questions..."
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                  />

                  <Filter className="h-4 w-4 text-slate-600" />
                </div>
              </div>

              <div className="divide-y divide-slate-800">
                {filteredGroups.map(
                  (
                    group,
                    groupIndex,
                  ) => {
                    const isExpanded =
                      expandedGroups.includes(
                        group.fingerprint,
                      );

                    const hasCrossDifficulty =
                      new Set(
                        group.questions.map(
                          (question) =>
                            question.difficultySource,
                        ),
                      ).size > 1;

                    return (
                      <div
                        key={
                          group.fingerprint
                        }
                      >
                        <button
                          type="button"
                          onClick={() =>
                            toggleGroup(
                              group.fingerprint,
                            )
                          }
                          className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-slate-800/50 sm:p-6"
                        >
                          <div className="flex min-w-0 items-start gap-4">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-sm font-black text-amber-300">
                              {groupIndex + 1}
                            </div>

                            <div className="min-w-0">
                              <div className="mb-2 flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-red-300">
                                  Duplicate
                                </span>

                                {hasCrossDifficulty && (
                                  <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-cyan-300">
                                    Cross-Difficulty
                                  </span>
                                )}

                                <span className="text-xs font-bold text-slate-500">
                                  {
                                    group.questions.length
                                  }{" "}
                                  copies
                                </span>
                              </div>

                              <p className="line-clamp-2 text-sm font-semibold leading-6 text-slate-200">
                                {
                                  group.questions[0]
                                    .question
                                }
                              </p>
                            </div>
                          </div>

                          <ChevronDown
                            className={`h-5 w-5 shrink-0 text-slate-500 transition ${
                              isExpanded
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </button>

                        {isExpanded && (
                          <div className="space-y-4 bg-slate-950/60 px-5 pb-5 sm:px-6 sm:pb-6">
                            {group.questions.map(
                              (
                                question,
                                questionIndex,
                              ) => {
                                const isSelected =
                                  selectedDuplicateIds.includes(
                                    question.localId,
                                  );

                                const isOriginal =
                                  questionIndex ===
                                  0;

                                return (
                                  <div
                                    key={
                                      question.localId
                                    }
                                    className={`rounded-2xl border p-5 transition ${
                                      isSelected
                                        ? "border-red-500/40 bg-red-500/5"
                                        : "border-slate-800 bg-slate-900"
                                    }`}
                                  >
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                      <div className="flex min-w-0 gap-4">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            toggleDuplicateQuestion(
                                              question.localId,
                                            )
                                          }
                                          aria-label={
                                            isSelected
                                              ? "Unselect question"
                                              : "Select question"
                                          }
                                          className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${
                                            isSelected
                                              ? "border-red-400 bg-red-400 text-slate-950"
                                              : "border-slate-600 bg-slate-950"
                                          }`}
                                        >
                                          {isSelected && (
                                            <CheckCircle2 className="h-4 w-4" />
                                          )}
                                        </button>

                                        <div className="min-w-0">
                                          <div className="mb-2 flex flex-wrap items-center gap-2">
                                            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                                              Question{" "}
                                              {questionIndex +
                                                1}
                                            </span>

                                            <span
                                              className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                                                DIFFICULTY_COLORS[
                                                  question.difficultySource
                                                ]
                                              }`}
                                            >
                                              {
                                                DIFFICULTY_LABELS[
                                                  question.difficultySource
                                                ]
                                              }
                                            </span>

                                            {isOriginal ? (
                                              <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-300">
                                                Keep
                                              </span>
                                            ) : (
                                              <span className="rounded-full bg-red-400/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-red-300">
                                                Duplicate
                                              </span>
                                            )}
                                          </div>

                                          <p className="text-sm font-semibold leading-6 text-slate-200">
                                            {
                                              question.question
                                            }
                                          </p>

                                          <div className="mt-4 flex flex-wrap gap-2">
                                            <span className="rounded-lg bg-slate-800 px-2.5 py-1.5 text-[11px] font-semibold text-slate-400">
                                              Topic:{" "}
                                              {question.topic ||
                                                "No topic"}
                                            </span>

                                            <span className="rounded-lg bg-slate-800 px-2.5 py-1.5 text-[11px] font-semibold text-slate-400">
                                              Difficulty:{" "}
                                              {
                                                question.difficulty
                                              }
                                            </span>

                                            <span className="rounded-lg bg-slate-800 px-2.5 py-1.5 text-[11px] font-semibold text-slate-400">
                                              Source:{" "}
                                              {
                                                question.difficultySource
                                              }
                                            </span>
                                          </div>

                                          <div className="mt-4 grid gap-2">
                                            {question.options.map(
                                              (
                                                option,
                                              ) => (
                                                <div
                                                  key={`${question.localId}-${option.label}`}
                                                  className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-400"
                                                >
                                                  <span className="mr-2 font-black text-slate-300">
                                                    {
                                                      option.label
                                                    }
                                                    .
                                                  </span>

                                                  {
                                                    option.value
                                                  }
                                                </div>
                                              ),
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          deleteQuestion(
                                            question.localId,
                                          )
                                        }
                                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-xs font-black text-red-300 transition hover:bg-red-500/20"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                        Delete
                                      </button>
                                    </div>

                                    {!isOriginal && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          selectOnlyQuestion(
                                            question.localId,
                                          )
                                        }
                                        className="mt-4 text-xs font-bold text-cyan-400 hover:text-cyan-300"
                                      >
                                        {isSelected
                                          ? "Selected for deletion"
                                          : "Select this duplicate for deletion"}
                                      </button>
                                    )}
                                  </div>
                                );
                              },
                            )}
                          </div>
                        )}
                      </div>
                    );
                  },
                )}

                {filteredGroups.length ===
                  0 && (
                  <div className="p-12 text-center">
                    <Search className="mx-auto h-8 w-8 text-slate-700" />

                    <p className="mt-4 text-sm font-bold text-slate-400">
                      No matching duplicate groups found.
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

        {/* CROSS DIFFICULTY */}

        {hasLoadedQuestions &&
          hasCrossDifficultyDuplicates && (
            <section className="mt-8 overflow-hidden rounded-3xl border border-cyan-400/20 bg-cyan-400/5">
              <div className="border-b border-cyan-400/10 p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <Layers3 className="mt-0.5 h-5 w-5 text-cyan-400" />

                  <div>
                    <h2 className="text-xl font-black text-white">
                      Cross-Difficulty Duplicates
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      Exact duplicates where the same
                      question exists in different
                      difficulty banks.
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <span className="rounded-xl bg-slate-950 px-4 py-3 text-xs font-bold text-slate-300">
                    Simple ↔ Medium:{" "}
                    <strong className="text-amber-300">
                      {
                        crossPairStats.simpleMedium
                      }
                    </strong>
                  </span>

                  <span className="rounded-xl bg-slate-950 px-4 py-3 text-xs font-bold text-slate-300">
                    Simple ↔ Hard:{" "}
                    <strong className="text-amber-300">
                      {
                        crossPairStats.simpleHard
                      }
                    </strong>
                  </span>

                  <span className="rounded-xl bg-slate-950 px-4 py-3 text-xs font-bold text-slate-300">
                    Medium ↔ Hard:{" "}
                    <strong className="text-amber-300">
                      {
                        crossPairStats.mediumHard
                      }
                    </strong>
                  </span>
                </div>
              </div>

              <div className="divide-y divide-cyan-400/10">
                {filteredCrossDifficulty.map(
                  (
                    pair,
                    index,
                  ) => (
                    <div
                      key={`${pair.key}-${index}`}
                      className="p-5 sm:p-6"
                    >
                      <div className="mb-4 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-red-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-red-300">
                          Exact Overlap
                        </span>

                        <span className="rounded-full bg-cyan-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-cyan-300">
                          {pair.label}
                        </span>
                      </div>

                      <div className="grid gap-4 lg:grid-cols-2">
                        {[
                          pair.first,
                          pair.second,
                        ].map(
                          (item) => (
                            <div
                              key={
                                item.localId
                              }
                              className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
                            >
                              <div className="mb-3 flex flex-wrap items-center gap-2">
                                <span
                                  className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${
                                    DIFFICULTY_COLORS[
                                      item.difficultySource
                                    ]
                                  }`}
                                >
                                  {
                                    DIFFICULTY_LABELS[
                                      item.difficultySource
                                    ]
                                  }
                                </span>
                              </div>

                              <p className="text-sm font-semibold leading-6 text-slate-200">
                                {
                                  item.question
                                }
                              </p>

                              <p className="mt-3 text-xs text-slate-500">
                                Topic:{" "}
                                {
                                  item.topic
                                }
                              </p>

                              <button
                                type="button"
                                onClick={() =>
                                  deleteQuestion(
                                    item.localId,
                                  )
                                }
                                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-500/20"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete This
                              </button>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </section>
          )}

        {/* EMPTY */}

        {!hasLoadedQuestions &&
          !loadingBank && (
            <section className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800">
                <FileSearch className="h-7 w-7 text-slate-500" />
              </div>

              <h2 className="mt-5 text-lg font-black text-slate-300">
                No Question Banks Loaded
              </h2>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                Select a subject and examination
                type, then click Load All Banks.
              </p>
            </section>
          )}

        {/* SESSION */}

        {hasLoadedQuestions && (
          <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-black text-white">
                  Validation Session
                </h2>

                <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
                  Changes are held in memory. The
                  original TypeScript files are not
                  modified until you download the
                  corrected banks.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={loadQuestionFile}
                  disabled={loadingBank}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-xs font-black text-slate-200 transition hover:bg-slate-700 disabled:opacity-50"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reload All Banks
                </button>

                <button
                  type="button"
                  onClick={saveAllCleanedBanks}
                  disabled={!isClean}
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 text-xs font-black text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Download className="h-4 w-4" />
                  Save All Clean Banks
                </button>
              </div>
            </div>

            {/* DOWNLOAD BUTTONS */}

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {(
                [
                  "simple",
                  "medium",
                  "hard",
                ] as QuestionDifficulty[]
              ).map(
                (difficulty) => (
                  <button
                    key={difficulty}
                    type="button"
                    onClick={() =>
                      downloadDifficultyBank(
                        difficulty,
                      )
                    }
                    disabled={
                      hasValidationErrors ||
                      hasDuplicates ||
                      difficultyStats[
                        difficulty
                      ] === 0
                    }
                    className={`rounded-2xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-40 ${
                      difficulty ===
                      "simple"
                        ? "border-emerald-400/20 bg-emerald-400/5 hover:bg-emerald-400/10"
                        : difficulty ===
                          "medium"
                        ? "border-cyan-400/20 bg-cyan-400/5 hover:bg-cyan-400/10"
                        : "border-purple-400/20 bg-purple-400/5 hover:bg-purple-400/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider">
                        {
                          DIFFICULTY_LABELS[
                            difficulty
                          ]
                        }
                      </span>

                      <Download className="h-4 w-4" />
                    </div>

                    <p className="mt-2 text-2xl font-black">
                      {difficultyStats[
                        difficulty
                      ].toLocaleString()}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Save this bank separately
                    </p>
                  </button>
                ),
              )}
            </div>

            {/* SUMMARY */}

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-xs font-bold text-slate-600">
                  Current Questions
                </p>

                <p className="mt-1 text-xl font-black text-white">
                  {questions.length.toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-xs font-bold text-slate-600">
                  Duplicate Groups
                </p>

                <p className="mt-1 text-xl font-black text-amber-400">
                  {duplicateGroups.length.toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-xs font-bold text-slate-600">
                  Cross-Difficulty
                </p>

                <p className="mt-1 text-xl font-black text-cyan-400">
                  {crossDifficultyDuplicates.length.toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-xs font-bold text-slate-600">
                  Difficulty Errors
                </p>

                <p
                  className={`mt-1 text-xl font-black ${
                    difficultyValidationErrors.length ===
                    0
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {
                    difficultyValidationErrors.length
                  }
                </p>
              </div>
            </div>

            {/* STATUS */}

            {!isClean && (
              <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />

                  <div>
                    <p className="text-sm font-bold text-amber-300">
                      Validation requires review
                    </p>

                    <div className="mt-2 space-y-1 text-xs leading-5 text-slate-400">
                      {hasDuplicates && (
                        <p>
                          •{" "}
                          {
                            duplicateCopiesCount
                          }{" "}
                          exact duplicate copies
                          need review.
                        </p>
                      )}

                      {difficultyValidationErrors.length >
                        0 && (
                        <p>
                          •{" "}
                          {
                            difficultyValidationErrors.length
                          }{" "}
                          difficulty integrity
                          errors detected.
                        </p>
                      )}

                      {structuralValidationErrors.length >
                        0 && (
                        <p>
                          •{" "}
                          {
                            structuralValidationErrors.length
                          }{" "}
                          structural errors
                          detected.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isClean && (
              <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4">
                <div className="flex items-start gap-3">
                  <Download className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />

                  <div>
                    <p className="text-sm font-bold text-cyan-300">
                      Ready to save
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      The three banks will be downloaded
                      separately.
                    </p>

                    <div className="mt-3 space-y-1 font-mono text-[11px] text-slate-500">
                      <p>
                        biology/simple/jamb.ts
                      </p>

                      <p>
                        biology/medium/jamb.ts
                      </p>

                      <p>
                        biology/hard/jamb.ts
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
