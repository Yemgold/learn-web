// C:\Users\Lara Spellman\Jamb\jamb-league\src\app\admin\(admin)\secondary\quiz-board\quiz-competitions\create\page.tsx

"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Save,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { getSubjectsByPlan } from "@/lib/api/subjects";

import {
  createQuizCompetition,
} from "@/lib/api/quizCompetition";

import {
  DEFAULT_FORM,
} from "@/lib/quizCompetition/constants";

import {
  createEliminationRound,
  createFinalRound,
  createQuizPresets,
} from "@/lib/quizCompetition/utils";

import {
  validateQuizCompetition,
} from "@/lib/quizCompetition/validation";

import {
  buildCreateQuizCompetitionPayload,
} from "@/lib/quizCompetition/payload";

import type {
  DifficultyBreakdown,
  EliminationRound,
  FinalRound,
  FormState,
  Subject,
} from "@/types/quizCompetition";

import BasicInformationCard from "@/components/admin/quiz-competition/BasicInformationCard";

import CompetitionSummary from "@/components/admin/quiz-competition/CompetitionSummary";

import EliminationRounds from "@/components/admin/quiz-competition/EliminationRounds";

import FinalRoundCard from "@/components/admin/quiz-competition/FinalRoundCard";

import FinalReview from "@/components/admin/quiz-competition/FinalReview";

export default function CreateQuizCompetitionPage() {
  const router = useRouter();

  const [form, setForm] =
    useState<FormState>(DEFAULT_FORM);

  const [subjects, setSubjects] =
    useState<Subject[]>([]);

  const [
    loadingSubjects,
    setLoadingSubjects,
  ] = useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState<string | null>(null);

  const [rounds, setRounds] =
    useState<EliminationRound[]>([]);

  const [finalRound, setFinalRound] =
    useState<FinalRound>(
      createFinalRound(),
    );

  /*
   * ==========================================================
   * LOAD SUBJECTS
   * ==========================================================
   */

  useEffect(() => {
    let mounted = true;

    const loadSubjects = async () => {
      try {
        setLoadingSubjects(true);

        const response =
          await getSubjectsByPlan(
            "SECONDARY",
            1,
            100,
          );

        if (!mounted) {
          return;
        }

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
   * ==========================================================
   * CREATE ELIMINATION ROUNDS
   * ==========================================================
   *
   * number_of_rounds includes the final.
   *
   * Example:
   *
   * 5 total rounds
   * =
   * 4 elimination rounds
   * +
   * 1 final round
   */

  useEffect(() => {
    const totalRounds = Math.max(
      1,
      Number(
        form.number_of_rounds || 1,
      ),
    );

    const eliminationCount =
      Math.max(
        0,
        totalRounds - 1,
      );

    setRounds((previousRounds) => {
      const nextRounds: EliminationRound[] =
        [];

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

  /*
   * ==========================================================
   * SELECTED SUBJECT
   * ==========================================================
   */

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
   * ==========================================================
   * QUIZ PRESETS
   * ==========================================================
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

  /*
   * ==========================================================
   * CALCULATIONS
   * ==========================================================
   */

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

  const eliminationExitTotal =
    useMemo(
      () =>
        rounds.reduce(
          (total, round) =>
            total +
            Number(
              round.exit_number || 0,
            ),
          0,
        ),
      [rounds],
    );

  const remainingAfterExits =
    useMemo(
      () =>
        Number(
          form.no_of_contestants || 0,
        ) -
        eliminationExitTotal,
      [
        form.no_of_contestants,
        eliminationExitTotal,
      ],
    );

  /*
   * ==========================================================
   * GENERIC FORM UPDATE
   * ==========================================================
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
   * ==========================================================
   * SUBJECT CHANGE
   * ==========================================================
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
   * ==========================================================
   * QUIZ PRESET CHANGE
   * ==========================================================
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
   * ==========================================================
   * UPDATE ROUND
   * ==========================================================
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
   * ==========================================================
   * UPDATE ROUND DIFFICULTY
   * ==========================================================
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
   * ==========================================================
   * UPDATE FINAL DIFFICULTY
   * ==========================================================
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
   * ==========================================================
   * SUBMIT
   * ==========================================================
   */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError(null);
    setSuccess(null);

    /*
     * Validate.
     */
    const validationError =
      validateQuizCompetition(
        form,
        rounds,
        finalRound,
        eliminationExitTotal,
      );

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);

      /*
       * Build exact backend payload.
       */
      const payload =
        buildCreateQuizCompetitionPayload(
          form,
          rounds,
          finalRound,
        );

      console.log(
        "Creating quiz competition:",
        payload,
      );

      /*
       * API function.
       */
      const response =
        await createQuizCompetition(
          payload,
        );

      console.log(
        "Quiz competition created:",
        response,
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

  /*
   * ==========================================================
   * UI
   * ==========================================================
   */

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

        {/* Error */}
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

        {/* Success */}
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
          <BasicInformationCard
            form={form}
            subjects={subjects}
            loadingSubjects={
              loadingSubjects
            }
            selectedSubject={
              selectedSubject
            }
            quizPresets={quizPresets}
            updateForm={updateForm}
            handleSubjectChange={
              handleSubjectChange
            }
            handleQuizPresetChange={
              handleQuizPresetChange
            }
          />

          {/* Summary */}
          <CompetitionSummary
            totalRounds={
              form.number_of_rounds
            }
            eliminationRounds={
              rounds.length
            }
            totalQuestions={
              totalQuestions
            }
            remainingAfterExits={
              remainingAfterExits
            }
          />

          {/* Elimination */}
          <EliminationRounds
            rounds={rounds}
            updateRound={updateRound}
            updateRoundDifficulty={
              updateRoundDifficulty
            }
          />

          {/* Final */}
          <FinalRoundCard
            form={form}
            finalRound={finalRound}
            updateForm={updateForm}
            setFinalRound={setFinalRound}
            updateFinalDifficulty={
              updateFinalDifficulty
            }
          />

          {/* Review */}
          <FinalReview
            form={form}
            selectedSubject={
              selectedSubject
            }
            eliminationRounds={
              rounds.length
            }
            eliminationExitTotal={
              eliminationExitTotal
            }
          />

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                router.back()
              }
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









// C:\Users\Lara Spellman\Jamb\jamb-league\src\app\admin\(admin)\secondary\quiz-board\quiz-competitions\create\page.tsx

// "use client";

// import {
//   FormEvent,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import { useRouter } from "next/navigation";

// import {
//   AlertCircle,
//   ArrowLeft,
//   CheckCircle2,
//   Loader2,
//   Save,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";

// import { getSubjectsByPlan } from "@/lib/api/subjects";

// import {
//   createQuizCompetition,
// } from "@/lib/api/quizCompetition";

// import {
//   DEFAULT_FORM,
// } from "@/lib/quizCompetition/constants";

// import {
//   createEliminationRound,
//   createFinalRound,
//   createQuizPresets,
// } from "@/lib/quizCompetition/utils";

// import {
//   validateQuizCompetition,
// } from "@/lib/quizCompetition/validation";

// import {
//   buildCreateQuizCompetitionPayload,
// } from "@/lib/quizCompetition/payload";

// import type {
//   DifficultyBreakdown,
//   EliminationRound,
//   FinalRound,
//   FormState,
//   Subject,
// } from "@/types/quizCompetition";

// import BasicInformationCard from "@/components/admin/quiz-competition/BasicInformationCard";

// import CompetitionSummary from "@/components/admin/quiz-competition/CompetitionSummary";

// import EliminationRounds from "@/components/admin/quiz-competition/EliminationRounds";

// import FinalRoundCard from "@/components/admin/quiz-competition/FinalRoundCard";

// import FinalReview from "@/components/admin/quiz-competition/FinalReview";

// /*
//  * ==========================================================
//  * HELPERS
//  * ==========================================================
//  */

// const getResponseMessage = (
//   response: any,
//   fallback: string,
// ) => {
//   return (
//     response?.data?.message ||
//     response?.message ||
//     response?.data?.error ||
//     response?.error ||
//     fallback
//   );
// };

// const getErrorMessage = (
//   error: any,
//   fallback: string,
// ) => {
//   /*
//    * Standard Axios backend response:
//    *
//    * {
//    *   response: {
//    *     data: {
//    *       message: "...",
//    *       error: "..."
//    *     }
//    *   }
//    * }
//    */

//   const backendMessage =
//     error?.response?.data?.message;

//   const backendError =
//     error?.response?.data?.error;

//   /*
//    * Some APIs may return:
//    *
//    * errors: [...]
//    *
//    * Try to display them as well.
//    */

//   const backendErrors =
//     error?.response?.data?.errors;

//   if (
//     Array.isArray(backendErrors) &&
//     backendErrors.length > 0
//   ) {
//     const formattedErrors =
//       backendErrors
//         .map((item: any) => {
//           if (
//             typeof item === "string"
//           ) {
//             return item;
//           }

//           if (
//             typeof item?.message ===
//             "string"
//           ) {
//             return item.message;
//           }

//           if (
//             typeof item?.error ===
//             "string"
//           ) {
//             return item.error;
//           }

//           return null;
//         })
//         .filter(Boolean);

//     if (formattedErrors.length > 0) {
//       return formattedErrors.join(" ");
//     }
//   }

//   if (
//     typeof backendMessage === "string" &&
//     backendMessage.trim()
//   ) {
//     return backendMessage;
//   }

//   if (
//     typeof backendError === "string" &&
//     backendError.trim()
//   ) {
//     return backendError;
//   }

//   if (
//     typeof error?.message === "string" &&
//     error.message.trim()
//   ) {
//     return error.message;
//   }

//   return fallback;
// };

// /*
//  * ==========================================================
//  * PAGE
//  * ==========================================================
//  */

// export default function CreateQuizCompetitionPage() {
//   const router = useRouter();

//   const [form, setForm] =
//     useState<FormState>(DEFAULT_FORM);

//   const [subjects, setSubjects] =
//     useState<Subject[]>([]);

//   const [
//     loadingSubjects,
//     setLoadingSubjects,
//   ] = useState(true);

//   const [saving, setSaving] =
//     useState(false);

//   /*
//    * Errors related specifically
//    * to loading subjects.
//    */
//   const [subjectError, setSubjectError] =
//     useState<string | null>(null);

//   /*
//    * Errors related specifically
//    * to the Create Competition action.
//    */
//   const [actionError, setActionError] =
//     useState<string | null>(null);

//   /*
//    * Success response related
//    * to the Create Competition action.
//    */
//   const [actionSuccess, setActionSuccess] =
//     useState<string | null>(null);

//   const [rounds, setRounds] =
//     useState<EliminationRound[]>([]);

//   const [finalRound, setFinalRound] =
//     useState<FinalRound>(
//       createFinalRound(),
//     );

//   /*
//    * ==========================================================
//    * LOAD SUBJECTS
//    * ==========================================================
//    */

//   useEffect(() => {
//     let mounted = true;

//     const loadSubjects = async () => {
//       try {
//         setLoadingSubjects(true);
//         setSubjectError(null);

//         const response =
//           await getSubjectsByPlan(
//             "SECONDARY",
//             1,
//             100,
//           );

//         if (!mounted) {
//           return;
//         }

//         setSubjects(
//           response?.data?.subjectObj ?? [],
//         );

//         /*
//          * If the API itself returns success:false,
//          * respect its response message.
//          */
//         if (
//           response?.data?.success === false
//         ) {
//           setSubjectError(
//             getResponseMessage(
//               response,
//               "Unable to load subjects.",
//             ),
//           );
//         }
//       } catch (err: any) {
//         console.error(
//           "Failed to load subjects:",
//           err,
//         );

//         if (mounted) {
//           setSubjects([]);

//           setSubjectError(
//             getErrorMessage(
//               err,
//               "Unable to load subjects. Please refresh the page and try again.",
//             ),
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
//    * ==========================================================
//    * CREATE ELIMINATION ROUNDS
//    * ==========================================================
//    *
//    * number_of_rounds includes the final.
//    *
//    * Example:
//    *
//    * 5 total rounds
//    * =
//    * 4 elimination rounds
//    * +
//    * 1 final round
//    */

//   useEffect(() => {
//     const totalRounds = Math.max(
//       1,
//       Number(
//         form.number_of_rounds || 1,
//       ),
//     );

//     const eliminationCount =
//       Math.max(
//         0,
//         totalRounds - 1,
//       );

//     setRounds((previousRounds) => {
//       const nextRounds: EliminationRound[] =
//         [];

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

//   /*
//    * ==========================================================
//    * SELECTED SUBJECT
//    * ==========================================================
//    */

//   const selectedSubject = useMemo(
//     () =>
//       subjects.find(
//         (subject) =>
//           String(subject._id) ===
//           String(form.subject),
//       ),
//     [subjects, form.subject],
//   );

//   /*
//    * ==========================================================
//    * QUIZ PRESETS
//    * ==========================================================
//    */

//   const quizPresets = useMemo(
//     () =>
//       createQuizPresets(
//         selectedSubject?.name ||
//           selectedSubject?.code ||
//           "",
//       ),
//     [selectedSubject],
//   );

//   /*
//    * ==========================================================
//    * CALCULATIONS
//    * ==========================================================
//    */

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

//   const eliminationExitTotal =
//     useMemo(
//       () =>
//         rounds.reduce(
//           (total, round) =>
//             total +
//             Number(
//               round.exit_number || 0,
//             ),
//           0,
//         ),
//       [rounds],
//     );

//   const remainingAfterExits =
//     useMemo(
//       () =>
//         Number(
//           form.no_of_contestants || 0,
//         ) -
//         eliminationExitTotal,
//       [
//         form.no_of_contestants,
//         eliminationExitTotal,
//       ],
//     );

//   /*
//    * ==========================================================
//    * CLEAR ACTION FEEDBACK
//    * ==========================================================
//    */

//   const clearActionFeedback = () => {
//     setActionError(null);
//     setActionSuccess(null);
//   };

//   /*
//    * ==========================================================
//    * GENERIC FORM UPDATE
//    * ==========================================================
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

//     clearActionFeedback();
//   };

//   /*
//    * ==========================================================
//    * SUBJECT CHANGE
//    * ==========================================================
//    */

//   const handleSubjectChange = (
//     subjectId: string,
//   ) => {
//     setForm((previous) => ({
//       ...previous,
//       subject: subjectId,
//       quiz_title: "",
//       description: "",
//     }));

//     clearActionFeedback();
//   };

//   /*
//    * ==========================================================
//    * QUIZ PRESET CHANGE
//    * ==========================================================
//    */

//   const handleQuizPresetChange = (
//     title: string,
//   ) => {
//     const selectedPreset =
//       quizPresets.find(
//         (preset) =>
//           preset.title === title,
//       );

//     setForm((previous) => ({
//       ...previous,
//       quiz_title: title,
//       description:
//         selectedPreset?.description ??
//         previous.description,
//     }));

//     clearActionFeedback();
//   };

//   /*
//    * ==========================================================
//    * UPDATE ROUND
//    * ==========================================================
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

//     clearActionFeedback();
//   };

//   /*
//    * ==========================================================
//    * UPDATE ROUND DIFFICULTY
//    * ==========================================================
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

//     clearActionFeedback();
//   };

//   /*
//    * ==========================================================
//    * UPDATE FINAL DIFFICULTY
//    * ==========================================================
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

//     clearActionFeedback();
//   };

//   /*
//    * ==========================================================
//    * SUBMIT
//    * ==========================================================
//    */

//   const handleSubmit = async (
//     event: FormEvent<HTMLFormElement>,
//   ) => {
//     event.preventDefault();

//     /*
//      * Clear previous action result
//      * immediately when a new submission starts.
//      */
//     clearActionFeedback();

//     /*
//      * Validate.
//      */
//     const validationError =
//       validateQuizCompetition(
//         form,
//         rounds,
//         finalRound,
//         eliminationExitTotal,
//       );

//     if (validationError) {
//       setActionError(validationError);
//       return;
//     }

//     try {
//       setSaving(true);

//       /*
//        * Build exact backend payload.
//        */
//       const payload =
//         buildCreateQuizCompetitionPayload(
//           form,
//           rounds,
//           finalRound,
//         );

//       console.log(
//         "Creating quiz competition:",
//         payload,
//       );

//       /*
//        * API function.
//        */
//       const response =
//         await createQuizCompetition(
//           payload,
//         );

//       console.log(
//         "Quiz competition created:",
//         response,
//       );

//       /*
//        * Display the backend's actual
//        * success message when available.
//        */
//       const successMessage =
//         getResponseMessage(
//           response,
//           "Quiz competition created successfully.",
//         );

//       setActionSuccess(
//         successMessage,
//       );

//       /*
//        * Give the user enough time to
//        * actually see the response.
//        */
//       setTimeout(() => {
//         router.push(
//           "/admin/secondary/quiz-board/quiz-competitions",
//         );
//       }, 1800);
//     } catch (err: any) {
//       console.error(
//         "Failed to create quiz competition:",
//         err,
//       );

//       /*
//        * Display the actual backend error
//        * message close to the Create button.
//        */
//       setActionError(
//         getErrorMessage(
//           err,
//           "Failed to create quiz competition. Please check the form and try again.",
//         ),
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   /*
//    * ==========================================================
//    * UI
//    * ==========================================================
//    */

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
//               onClick={() => {
//                 clearActionFeedback();
//                 router.back();
//               }}
//               className="mt-1 shrink-0"
//               disabled={saving}
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

//         {/* Subject loading error */}
//         {subjectError && (
//           <div
//             role="alert"
//             className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
//           >
//             <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

//             <div>
//               <p className="font-semibold">
//                 Unable to load subjects
//               </p>

//               <p className="mt-1">
//                 {subjectError}
//               </p>
//             </div>
//           </div>
//         )}

//         <form
//           onSubmit={handleSubmit}
//           className="space-y-6"
//         >
//           {/* Basic Information */}
//           <BasicInformationCard
//             form={form}
//             subjects={subjects}
//             loadingSubjects={
//               loadingSubjects
//             }
//             selectedSubject={
//               selectedSubject
//             }
//             quizPresets={quizPresets}
//             updateForm={updateForm}
//             handleSubjectChange={
//               handleSubjectChange
//             }
//             handleQuizPresetChange={
//               handleQuizPresetChange
//             }
//           />

//           {/* Summary */}
//           <CompetitionSummary
//             totalRounds={
//               form.number_of_rounds
//             }
//             eliminationRounds={
//               rounds.length
//             }
//             totalQuestions={
//               totalQuestions
//             }
//             remainingAfterExits={
//               remainingAfterExits
//             }
//           />

//           {/* Elimination */}
//           <EliminationRounds
//             rounds={rounds}
//             updateRound={updateRound}
//             updateRoundDifficulty={
//               updateRoundDifficulty
//             }
//           />

//           {/* Final */}
//           <FinalRoundCard
//             form={form}
//             finalRound={finalRound}
//             updateForm={updateForm}
//             setFinalRound={setFinalRound}
//             updateFinalDifficulty={
//               updateFinalDifficulty
//             }
//           />

//           {/* Review */}
//           <FinalReview
//             form={form}
//             selectedSubject={
//               selectedSubject
//             }
//             eliminationRounds={
//               rounds.length
//             }
//             eliminationExitTotal={
//               eliminationExitTotal
//             }
//           />

//           {/* ==================================================
//               ACTION AREA
//               ================================================== */}

//           <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
//             {/* Action error */}
//             {actionError && (
//               <div
//                 role="alert"
//                 aria-live="assertive"
//                 className="mb-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
//               >
//                 <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

//                 <div className="min-w-0">
//                   <p className="font-semibold">
//                     Unable to create competition
//                   </p>

//                   <p className="mt-1 whitespace-pre-wrap break-words">
//                     {actionError}
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* Action success */}
//             {actionSuccess && (
//               <div
//                 role="status"
//                 aria-live="polite"
//                 className="mb-4 flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
//               >
//                 <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

//                 <div className="min-w-0">
//                   <p className="font-semibold">
//                     Success
//                   </p>

//                   <p className="mt-1 whitespace-pre-wrap break-words">
//                     {actionSuccess}
//                   </p>

//                   <p className="mt-2 text-xs text-emerald-600">
//                     Redirecting to quiz
//                     competitions...
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* Buttons */}
//             <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => {
//                   clearActionFeedback();
//                   router.back();
//                 }}
//                 disabled={saving}
//               >
//                 Cancel
//               </Button>

//               <Button
//                 type="submit"
//                 disabled={saving}
//                 className="min-w-[180px]"
//               >
//                 {saving ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />

//                     Creating...
//                   </>
//                 ) : (
//                   <>
//                     <Save className="mr-2 h-4 w-4" />

//                     Create Competition
//                   </>
//                 )}
//               </Button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
