// "use client";

// import Link from "next/link";
// import { useParams } from "next/navigation";

// import {
//   ArrowLeft,
//   Flag,
// } from "lucide-react";

// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// import {
//   usePracticeStore,
//   type PracticeQuestion,
// } from "@/stores/practiceStore";

// import { PracticeSessionHeader } from "@/components/practice/session/PracticeSessionHeader";

// import QuestionNavigator from "@/components/practice/session/QuestionNavigator";

// import { PracticeQuestionCard } from "@/components/practice/session/PracticeQuestionCard";

// import { PracticeNavigation } from "@/components/practice/session/PracticeNavigation";

// export default function PracticeSessionPage() {
//   const params = useParams();

//   /* ============================================================
//      ROUTE PARAMS
//      ============================================================ */

//   const examType =
//     typeof params.examType === "string"
//       ? params.examType.toLowerCase()
//       : "";

//   const subjectSlug =
//     typeof params.subject === "string"
//       ? params.subject
//       : "";

//   const year =
//     typeof params.year === "string"
//       ? params.year
//       : "";

//   /* ============================================================
//      PRACTICE STORE
//      ============================================================ */

//   const questions = usePracticeStore(
//     (state) => state.questions
//   );

//   const session = usePracticeStore(
//     (state) => state.session
//   );

//   const nextQuestion = usePracticeStore(
//     (state) => state.nextQuestion
//   );

//   const previousQuestion = usePracticeStore(
//     (state) => state.previousQuestion
//   );

//   const setCurrentQuestion = usePracticeStore(
//     (state) => state.setCurrentQuestion
//   );

//   const selectAnswer = usePracticeStore(
//     (state) => state.selectAnswer
//   );

//   /* ============================================================
//      BACK TO YEARS URL
//      ============================================================ */

//   const yearsUrl =
//     `/student/practice/${examType}/${subjectSlug}/years`;

//   /* ============================================================
//      NO SESSION / QUESTIONS
//      ============================================================ */

//   if (!session || !questions.length) {
//     return (
//       <main className="min-h-screen bg-slate-50">
//         <div className="container mx-auto px-4 py-16">
//           <Card className="mx-auto max-w-xl p-8 text-center">

//             <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
//               <Flag className="h-7 w-7 text-slate-500" />
//             </div>

//             <h1 className="mt-5 text-2xl font-bold text-slate-900">
//               No Practice Session Found
//             </h1>

//             <p className="mt-3 text-slate-600">
//               Your practice questions are not
//               available. Please go back and
//               select a year again.
//             </p>

//             <div className="mt-6">
//               <Link href={yearsUrl}>
//                 <Button
//                   fullWidth
//                   leftIcon={
//                     <ArrowLeft className="h-4 w-4" />
//                   }
//                 >
//                   Back to Years
//                 </Button>
//               </Link>
//             </div>

//           </Card>
//         </div>
//       </main>
//     );
//   }

//   /* ============================================================
//      CURRENT QUESTION
//      ============================================================ */

//   const currentQuestionIndex =
//     session.currentQuestionIndex;

//   const currentQuestion:
//     | PracticeQuestion
//     | undefined =
//     questions[currentQuestionIndex];

//   if (!currentQuestion) {
//     return (
//       <main className="min-h-screen bg-slate-50">
//         <div className="container mx-auto px-4 py-16">
//           <Card className="mx-auto max-w-xl p-8 text-center">

//             <h1 className="text-xl font-bold text-slate-900">
//               Question Not Found
//             </h1>

//             <p className="mt-2 text-slate-600">
//               The current question could not
//               be loaded.
//             </p>

//             <div className="mt-6">
//               <Link href={yearsUrl}>
//                 <Button
//                   fullWidth
//                   leftIcon={
//                     <ArrowLeft className="h-4 w-4" />
//                   }
//                 >
//                   Back to Years
//                 </Button>
//               </Link>
//             </div>

//           </Card>
//         </div>
//       </main>
//     );
//   }

//   /* ============================================================
//      ANSWER
//      ============================================================ */

//   const selectedAnswer =
//     session.answers[currentQuestion._id];

//   /* ============================================================
//      PROGRESS
//      ============================================================ */

//   const questionNumber =
//     currentQuestionIndex + 1;

//   const totalQuestions =
//     questions.length;

//   const isFirstQuestion =
//     currentQuestionIndex === 0;

//   const isLastQuestion =
//     currentQuestionIndex ===
//     totalQuestions - 1;

//   /* ============================================================
//      HANDLERS
//      ============================================================ */

//   const handleSelectAnswer = (
//     answer: string
//   ) => {
//     selectAnswer(
//       currentQuestion._id,
//       answer
//     );
//   };

//   const handleNext = () => {
//     if (isLastQuestion) {
//       return;
//     }

//     nextQuestion();

//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   const handlePrevious = () => {
//     if (isFirstQuestion) {
//       return;
//     }

//     previousQuestion();

//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   const handleQuestionNumber = (
//     index: number
//   ) => {
//     setCurrentQuestion(index);

//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   /* ============================================================
//      UI
//      ============================================================ */

//   return (
//     <main className="min-h-screen bg-slate-50">

//       <PracticeSessionHeader
//   examType={examType}
//   subjectSlug={subjectSlug}
//   year={year}
//   subjectName={session.subjectName}
//   questionNumber={questionNumber}
//   totalQuestions={totalQuestions}
// />

//       <div className="container mx-auto max-w-5xl px-4 py-6 sm:py-10">

//         <QuestionNavigator
//           questions={questions}
//           currentQuestionIndex={
//             currentQuestionIndex
//           }
//           answers={session.answers}
//           onQuestionSelect={
//             handleQuestionNumber
//           }
//         />

//         <PracticeQuestionCard
//           question={currentQuestion}
//           questionNumber={questionNumber}
//           selectedAnswer={selectedAnswer}
//           onSelectAnswer={
//             handleSelectAnswer
//           }
//         />

//         <PracticeNavigation
//           isFirstQuestion={
//             isFirstQuestion
//           }
//           isLastQuestion={
//             isLastQuestion
//           }
//           questionNumber={
//             questionNumber
//           }
//           totalQuestions={
//             totalQuestions
//           }
//           onPrevious={handlePrevious}
//           onNext={handleNext}
//         />

//       </div>
//     </main>
//   );
// }








"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
  ArrowLeft,
  Flag,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  usePracticeStore,
  type PracticeQuestion,
} from "@/stores/practiceStore";

import { PracticeSessionHeader } from "@/components/practice/session/PracticeSessionHeader";

import QuestionNavigator from "@/components/practice/session/QuestionNavigator";

import { PracticeQuestionCard } from "@/components/practice/session/PracticeQuestionCard";

import { PracticeNavigation } from "@/components/practice/session/PracticeNavigation";

export default function PracticeSessionPage() {
  const params = useParams();

  /* ============================================================
     ROUTE PARAMS
     ============================================================ */

  const examType =
    typeof params.examType === "string"
      ? params.examType.toLowerCase()
      : "";

  const subjectSlug =
    typeof params.subject === "string"
      ? params.subject
      : "";

  const year =
    typeof params.year === "string"
      ? params.year
      : "";

  /* ============================================================
     PRACTICE STORE
     ============================================================ */

  const questions = usePracticeStore(
    (state) => state.questions
  );

  const session = usePracticeStore(
    (state) => state.session
  );

  const nextQuestion = usePracticeStore(
    (state) => state.nextQuestion
  );

  const previousQuestion = usePracticeStore(
    (state) => state.previousQuestion
  );

  const setCurrentQuestion = usePracticeStore(
    (state) => state.setCurrentQuestion
  );

  const selectAnswer = usePracticeStore(
    (state) => state.selectAnswer
  );

  /* ============================================================
     BACK TO YEARS URL
     ============================================================ */

  const yearsUrl =
    `/student/practice/${examType}/${subjectSlug}/years`;

  /* ============================================================
     NO SESSION / QUESTIONS
     ============================================================ */

  if (!session || !questions.length) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">

        {/* Background glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 overflow-hidden"
        >
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
          <div className="absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-blue-500/[0.06] blur-3xl" />
        </div>

        <div className="container relative mx-auto px-4 py-16">
          <Card className="mx-auto max-w-xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-none">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10">
              <Flag className="h-7 w-7 text-blue-400" />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-white">
              No Practice Session Found
            </h1>

            <p className="mt-3 leading-7 text-slate-400">
              Your practice questions are not
              available. Please go back and
              select a year again.
            </p>

            <div className="mt-6">
              <Link href={yearsUrl}>
                <Button
                  fullWidth
                  leftIcon={
                    <ArrowLeft className="h-4 w-4" />
                  }
                >
                  Back to Years
                </Button>
              </Link>
            </div>

          </Card>
        </div>
      </main>
    );
  }

  /* ============================================================
     CURRENT QUESTION
     ============================================================ */

  const currentQuestionIndex =
    session.currentQuestionIndex;

  const currentQuestion:
    | PracticeQuestion
    | undefined =
    questions[currentQuestionIndex];

  if (!currentQuestion) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">

        {/* Background glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 overflow-hidden"
        >
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
          <div className="absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-blue-500/[0.06] blur-3xl" />
        </div>

        <div className="container relative mx-auto px-4 py-16">
          <Card className="mx-auto max-w-xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-none">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
              <Flag className="h-7 w-7 text-red-400" />
            </div>

            <h1 className="mt-5 text-xl font-bold text-white">
              Question Not Found
            </h1>

            <p className="mt-3 text-slate-400">
              The current question could not
              be loaded.
            </p>

            <div className="mt-6">
              <Link href={yearsUrl}>
                <Button
                  fullWidth
                  leftIcon={
                    <ArrowLeft className="h-4 w-4" />
                  }
                >
                  Back to Years
                </Button>
              </Link>
            </div>

          </Card>
        </div>
      </main>
    );
  }

  /* ============================================================
     ANSWER
     ============================================================ */

  const selectedAnswer =
    session.answers[currentQuestion._id];

  /* ============================================================
     PROGRESS
     ============================================================ */

  const questionNumber =
    currentQuestionIndex + 1;

  const totalQuestions =
    questions.length;

  const isFirstQuestion =
    currentQuestionIndex === 0;

  const isLastQuestion =
    currentQuestionIndex ===
    totalQuestions - 1;

  /* ============================================================
     HANDLERS
     ============================================================ */

  const handleSelectAnswer = (
    answer: string
  ) => {
    selectAnswer(
      currentQuestion._id,
      answer
    );
  };

  const handleNext = () => {
    if (isLastQuestion) {
      return;
    }

    nextQuestion();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handlePrevious = () => {
    if (isFirstQuestion) {
      return;
    }

    previousQuestion();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleQuestionNumber = (
    index: number
  ) => {
    setCurrentQuestion(index);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ============================================================
     UI
     ============================================================ */

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-slate-950 text-white">

      {/* ========================================================
          BACKGROUND GLOW
         ======================================================== */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-blue-500/[0.06] blur-3xl" />
      </div>

      {/* ========================================================
          SESSION HEADER
         ======================================================== */}
      <div className="relative z-10">
        <PracticeSessionHeader
          examType={examType}
          subjectSlug={subjectSlug}
          year={year}
          subjectName={session.subjectName}
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
        />
      </div>

      {/* ========================================================
          QUESTION SESSION
         ======================================================== */}
      <div className="container relative z-10 mx-auto max-w-5xl px-4 py-6 sm:py-10">

        {/* Question navigator */}
        <div className="mb-6">
          <QuestionNavigator
            questions={questions}
            currentQuestionIndex={
              currentQuestionIndex
            }
            answers={session.answers}
            onQuestionSelect={
              handleQuestionNumber
            }
          />
        </div>

        {/* Current question */}
        <div className="mb-6">
          <PracticeQuestionCard
            question={currentQuestion}
            questionNumber={questionNumber}
            selectedAnswer={selectedAnswer}
            onSelectAnswer={
              handleSelectAnswer
            }
          />
        </div>

        {/* Previous / Next navigation */}
        <PracticeNavigation
          isFirstQuestion={
            isFirstQuestion
          }
          isLastQuestion={
            isLastQuestion
          }
          questionNumber={
            questionNumber
          }
          totalQuestions={
            totalQuestions
          }
          onPrevious={handlePrevious}
          onNext={handleNext}
        />

      </div>
    </main>
  );
}