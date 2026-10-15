



"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
  ArrowLeft,
  Flag,
  Loader2,
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
     QUESTION AUTO-SCROLL
     ============================================================ */

  const questionCardRef = useRef<HTMLDivElement>(null);

  const [scrollRequest, setScrollRequest] = useState(0);

  useEffect(() => {
    if (scrollRequest === 0) return;

    questionCardRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [scrollRequest]);

  /* ============================================================
     PRACTICE STORE
     ============================================================ */

  const questions = usePracticeStore(
    (state) => state.questions
  );

  const session = usePracticeStore(
    (state) => state.session
  );

  const hasHydrated = usePracticeStore(
    (state) => state.hasHydrated
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
     SHARED PAGE BACKGROUND
     ============================================================ */

  const pageBackground = (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden"
    >
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

      <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-blue-500/[0.06] blur-3xl" />
    </div>
  );

  /* ============================================================
     RESTORING SESSION
     ============================================================ */

  if (!hasHydrated) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
        {pageBackground}

        <div className="container relative mx-auto px-4 py-16">
          <Card className="mx-auto max-w-xl border border-white/10 bg-white/[0.04] p-8 text-center text-white shadow-none">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10">
              <Loader2 className="h-7 w-7 animate-spin text-blue-400" />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-white">
              Restoring Practice Session
            </h1>

            <p className="mt-3 leading-7 text-slate-400">
              Please wait while we restore your questions
              and previous answers.
            </p>
          </Card>
        </div>
      </main>
    );
  }

  /* ============================================================
     NO SESSION / QUESTIONS
     ============================================================ */

  if (!session || !questions.length) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
        {pageBackground}

        <div className="container relative mx-auto px-4 py-16">
          <Card className="mx-auto max-w-xl border border-white/10 bg-white/[0.04] p-8 text-center text-white shadow-none">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10">
              <Flag className="h-7 w-7 text-blue-400" />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-white">
              No Practice Session Found
            </h1>

            <p className="mt-3 leading-7 text-slate-400">
              We couldn't find a saved practice session.
              Please return to your selected year to start
              a new session.
            </p>

            <div className="mt-6">
              <Link href={yearsUrl}>
                <Button
                  fullWidth
                  leftIcon={<ArrowLeft className="h-4 w-4" />}
                  className="border border-blue-500/20 bg-blue-600 text-white hover:bg-blue-500"
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
    | undefined = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
        {pageBackground}

        <div className="container relative mx-auto px-4 py-16">
          <Card className="mx-auto max-w-xl border border-white/10 bg-white/[0.04] p-8 text-center text-white shadow-none">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
              <Flag className="h-7 w-7 text-red-400" />
            </div>

            <h1 className="mt-5 text-xl font-bold text-white">
              Question Not Found
            </h1>

            <p className="mt-3 text-slate-400">
              The current question could not be loaded.
            </p>

            <div className="mt-6">
              <Link href={yearsUrl}>
                <Button
                  fullWidth
                  leftIcon={<ArrowLeft className="h-4 w-4" />}
                  className="border border-blue-500/20 bg-blue-600 text-white hover:bg-blue-500"
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

  const questionNumber = currentQuestionIndex + 1;
  const totalQuestions = questions.length;

  const isFirstQuestion = currentQuestionIndex === 0;

  const isLastQuestion =
    currentQuestionIndex === totalQuestions - 1;

  /* ============================================================
     HANDLERS
     ============================================================ */

  const handleSelectAnswer = (answer: string) => {
    selectAnswer(currentQuestion._id, answer);
  };

  const handleNext = () => {
    if (isLastQuestion) return;

    nextQuestion();

    setScrollRequest((previous) => previous + 1);
  };

  const handlePrevious = () => {
    if (isFirstQuestion) return;

    previousQuestion();

    setScrollRequest((previous) => previous + 1);
  };

  const handleQuestionNumber = (index: number) => {
    setCurrentQuestion(index);

    // Scroll even if the student clicks the current question.
    setScrollRequest((previous) => previous + 1);
  };

  /* ============================================================
     PRACTICE SESSION UI
     ============================================================ */

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-slate-950 text-white">
      {pageBackground}

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

      <div className="container relative z-10 mx-auto max-w-5xl px-4 py-6 sm:py-10">
        {/* QUESTION NAVIGATOR */}

        <div className="mb-6">
          <QuestionNavigator
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            answers={session.answers}
            onQuestionSelect={handleQuestionNumber}
          />
        </div>

        {/* QUESTION AND ANSWER OPTIONS */}

        <div
          ref={questionCardRef}
          className="mb-6 scroll-mt-6 sm:scroll-mt-8"
        >
          <PracticeQuestionCard
            question={currentQuestion}
            questionNumber={questionNumber}
            selectedAnswer={selectedAnswer}
            onSelectAnswer={handleSelectAnswer}
          />
        </div>

        {/* PREVIOUS / NEXT NAVIGATION */}

        <PracticeNavigation
          isFirstQuestion={isFirstQuestion}
          isLastQuestion={isLastQuestion}
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      </div>
    </main>
  );
}

















// "use client";

// import Link from "next/link";
// import { useParams } from "next/navigation";

// import {
//   ArrowLeft,
//   Flag,
//   Loader2,
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

//   const hasHydrated = usePracticeStore(
//     (state) => state.hasHydrated
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
//      SHARED PAGE BACKGROUND
//      ============================================================ */

//   const pageBackground = (
//     <div
//       aria-hidden="true"
//       className="pointer-events-none fixed inset-0 overflow-hidden"
//     >
//       <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

//       <div className="absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

//       <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-blue-500/[0.06] blur-3xl" />
//     </div>
//   );

//   /* ============================================================
//      RESTORING SESSION
//      ============================================================ */

//   if (!hasHydrated) {
//     return (
//       <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
//         {pageBackground}

//         <div className="container relative mx-auto px-4 py-16">
//           <Card className="mx-auto max-w-xl border border-white/10 bg-white/[0.04] p-8 text-center text-white shadow-none">
//             <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10">
//               <Loader2 className="h-7 w-7 animate-spin text-blue-400" />
//             </div>

//             <h1 className="mt-5 text-2xl font-bold text-white">
//               Restoring Practice Session
//             </h1>

//             <p className="mt-3 leading-7 text-slate-400">
//               Please wait while we restore your questions
//               and previous answers.
//             </p>
//           </Card>
//         </div>
//       </main>
//     );
//   }

//   /* ============================================================
//      NO SESSION / QUESTIONS
//      ============================================================ */

//   if (!session || !questions.length) {
//     return (
//       <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
//         {pageBackground}

//         <div className="container relative mx-auto px-4 py-16">
//           <Card className="mx-auto max-w-xl border border-white/10 bg-white/[0.04] p-8 text-center text-white shadow-none">
//             <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10">
//               <Flag className="h-7 w-7 text-blue-400" />
//             </div>

//             <h1 className="mt-5 text-2xl font-bold text-white">
//               No Practice Session Found
//             </h1>

//             <p className="mt-3 leading-7 text-slate-400">
//               We couldn't find a saved practice session.
//               Please return to your selected year to start
//               a new session.
//             </p>

//             <div className="mt-6">
//               <Link href={yearsUrl}>
//                 <Button
//                   fullWidth
//                   leftIcon={<ArrowLeft className="h-4 w-4" />}
//                   className="border border-blue-500/20 bg-blue-600 text-white hover:bg-blue-500"
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
//     | undefined = questions[currentQuestionIndex];

//   if (!currentQuestion) {
//     return (
//       <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
//         {pageBackground}

//         <div className="container relative mx-auto px-4 py-16">
//           <Card className="mx-auto max-w-xl border border-white/10 bg-white/[0.04] p-8 text-center text-white shadow-none">
//             <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
//               <Flag className="h-7 w-7 text-red-400" />
//             </div>

//             <h1 className="mt-5 text-xl font-bold text-white">
//               Question Not Found
//             </h1>

//             <p className="mt-3 text-slate-400">
//               The current question could not be loaded.
//             </p>

//             <div className="mt-6">
//               <Link href={yearsUrl}>
//                 <Button
//                   fullWidth
//                   leftIcon={<ArrowLeft className="h-4 w-4" />}
//                   className="border border-blue-500/20 bg-blue-600 text-white hover:bg-blue-500"
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

//   const questionNumber = currentQuestionIndex + 1;
//   const totalQuestions = questions.length;

//   const isFirstQuestion = currentQuestionIndex === 0;

//   const isLastQuestion =
//     currentQuestionIndex === totalQuestions - 1;

//   /* ============================================================
//      HANDLERS
//      ============================================================ */

//   const handleSelectAnswer = (answer: string) => {
//     selectAnswer(currentQuestion._id, answer);
//   };

//   const handleNext = () => {
//     if (isLastQuestion) return;

//     nextQuestion();

//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   const handlePrevious = () => {
//     if (isFirstQuestion) return;

//     previousQuestion();

//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   const handleQuestionNumber = (index: number) => {
//     setCurrentQuestion(index);

//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   /* ============================================================
//      PRACTICE SESSION UI
//      ============================================================ */

//   return (
//     <main className="relative min-h-screen overflow-x-hidden bg-slate-950 text-white">
//       {pageBackground}

//       <div className="relative z-10">
//         <PracticeSessionHeader
//           examType={examType}
//           subjectSlug={subjectSlug}
//           year={year}
//           subjectName={session.subjectName}
//           questionNumber={questionNumber}
//           totalQuestions={totalQuestions}
//         />
//       </div>

//       <div className="container relative z-10 mx-auto max-w-5xl px-4 py-6 sm:py-10">
//         <div className="mb-6">
//           <QuestionNavigator
//             questions={questions}
//             currentQuestionIndex={currentQuestionIndex}
//             answers={session.answers}
//             onQuestionSelect={handleQuestionNumber}
//           />
//         </div>

//         <div className="mb-6">
//           <PracticeQuestionCard
//             question={currentQuestion}
//             questionNumber={questionNumber}
//             selectedAnswer={selectedAnswer}
//             onSelectAnswer={handleSelectAnswer}
//           />
//         </div>

//         <PracticeNavigation
//           isFirstQuestion={isFirstQuestion}
//           isLastQuestion={isLastQuestion}
//           questionNumber={questionNumber}
//           totalQuestions={totalQuestions}
//           onPrevious={handlePrevious}
//           onNext={handleNext}
//         />
//       </div>
//     </main>
//   );
// }
