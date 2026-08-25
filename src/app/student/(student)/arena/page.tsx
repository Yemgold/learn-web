"use client";

import { useMemo, useState } from "react";
import Arena from "@/components/arena/Arena";

import { SUBJECTS } from "@/data/arena/subjects";
import TopicSelector from "@/components/arena/TopicSelector";
import SubjectSelector from "@/components/arena/SubjectSelector";

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export default function ArenaPage() {
  /* ------------------------------------------------------------------------ */
  /* STATE                                                                    */
  /* ------------------------------------------------------------------------ */

  const [selectedSubject, setSelectedSubject] =
    useState<string>("");

  const [selectedTopic, setSelectedTopic] =
    useState<string>("");

  /*
   * Question range.
   *
   * Example:
   *
   * 1 → 10
   * 11 → 20
   * 21 → 30
   */
  const [startQuestion, setStartQuestion] =
    useState<number>(1);

  const [endQuestion, setEndQuestion] =
    useState<number>(10);

  const [started, setStarted] =
    useState(false);

  /* ------------------------------------------------------------------------ */
  /* SELECTED SUBJECT                                                         */
  /* ------------------------------------------------------------------------ */

  const currentSubject = useMemo(() => {
    return SUBJECTS.find(
      (subject) =>
        subject.name === selectedSubject
    );
  }, [selectedSubject]);

  const topics =
    currentSubject?.topics ?? [];

  /* ------------------------------------------------------------------------ */
  /* SELECTED TOPIC                                                           */
  /* ------------------------------------------------------------------------ */

  const currentTopic = useMemo(() => {
    return topics.find(
      (topic) =>
        topic.name === selectedTopic
    );
  }, [topics, selectedTopic]);

  /* ------------------------------------------------------------------------ */
  /* QUESTIONS                                                                */
  /* ------------------------------------------------------------------------ */

  const allQuestions =
    currentTopic?.questions ?? [];

  const totalQuestions =
    allQuestions.length;

  /* ------------------------------------------------------------------------ */
  /* SELECTED QUESTION RANGE                                                  */
  /* ------------------------------------------------------------------------ */

  const selectedQuestionCount =
    startQuestion > 0 &&
    endQuestion >= startQuestion
      ? endQuestion - startQuestion + 1
      : 0;

  const isValidRange =
    totalQuestions > 0 &&
    startQuestion >= 1 &&
    endQuestion >= startQuestion &&
    endQuestion <= totalQuestions;

  /*
   * Only send the selected range to Arena.
   *
   * Example:
   *
   * start = 11
   * end   = 20
   *
   * slice(10, 20)
   *
   * gives questions 11–20.
   */
  const selectedQuestions = useMemo(() => {
    if (!isValidRange) {
      return [];
    }

    return allQuestions.slice(
      startQuestion - 1,
      endQuestion
    );
  }, [
    allQuestions,
    startQuestion,
    endQuestion,
    isValidRange,
  ]);

  /* ------------------------------------------------------------------------ */
  /* SUBJECT CHANGE                                                           */
  /* ------------------------------------------------------------------------ */

  const handleSubjectChange = (
    subject: string
  ) => {
    setSelectedSubject(subject);

    /*
     * Reset topic whenever subject changes.
     */
    setSelectedTopic("");

    /*
     * Reset question range.
     */
    setStartQuestion(1);
    setEndQuestion(10);
  };

  /* ------------------------------------------------------------------------ */
  /* TOPIC CHANGE                                                             */
  /* ------------------------------------------------------------------------ */

  const handleTopicChange = (
    topic: string
  ) => {
    setSelectedTopic(topic);

    /*
     * Every new topic starts from
     * question 1.
     */
    setStartQuestion(1);

    /*
     * If the topic has fewer than 10 questions,
     * automatically use the final question.
     */
    const selectedTopicData =
      topics.find(
        (item) => item.name === topic
      );

    const questionCount =
      selectedTopicData?.questions?.length ?? 0;

    setEndQuestion(
      Math.min(10, questionCount)
    );
  };

  /* ------------------------------------------------------------------------ */
  /* RANGE HANDLERS                                                           */
  /* ------------------------------------------------------------------------ */

  const handleStartQuestionChange = (
    value: string
  ) => {
    const number = Number(value);

    if (Number.isNaN(number)) {
      return;
    }

    const nextStart = Math.max(
      1,
      Math.min(
        number,
        totalQuestions || 1
      )
    );

    setStartQuestion(nextStart);

    /*
     * Don't allow the end question
     * to fall before the start question.
     */
    if (endQuestion < nextStart) {
      setEndQuestion(nextStart);
    }
  };

  const handleEndQuestionChange = (
    value: string
  ) => {
    const number = Number(value);

    if (Number.isNaN(number)) {
      return;
    }

    const nextEnd = Math.max(
      startQuestion,
      Math.min(
        number,
        totalQuestions || startQuestion
      )
    );

    setEndQuestion(nextEnd);
  };

  /* ------------------------------------------------------------------------ */
  /* QUICK RANGE                                                              */
  /* ------------------------------------------------------------------------ */

  const handleQuickRange = (
    start: number,
    end: number
  ) => {
    if (totalQuestions <= 0) {
      return;
    }

    const safeStart = Math.max(
      1,
      Math.min(start, totalQuestions)
    );

    const safeEnd = Math.max(
      safeStart,
      Math.min(end, totalQuestions)
    );

    setStartQuestion(safeStart);
    setEndQuestion(safeEnd);
  };

  /* ------------------------------------------------------------------------ */
  /* QUICK RANGES                                                             */
  /* ------------------------------------------------------------------------ */

  const quickRanges = useMemo(() => {
    if (totalQuestions <= 0) {
      return [];
    }

    const ranges: Array<{
      start: number;
      end: number;
    }> = [];

    /*
     * Create ranges of 10.
     *
     * 1–10
     * 11–20
     * 21–30
     * ...
     */
    for (
      let start = 1;
      start <= totalQuestions;
      start += 10
    ) {
      ranges.push({
        start,
        end: Math.min(
          start + 9,
          totalQuestions
        ),
      });
    }

    return ranges;
  }, [totalQuestions]);

  /* ------------------------------------------------------------------------ */
  /* START LESSON                                                             */
  /* ------------------------------------------------------------------------ */

  const handleStartLesson = () => {
    if (
      !selectedSubject ||
      !selectedTopic ||
      !isValidRange ||
      selectedQuestions.length === 0
    ) {
      return;
    }

    setStarted(true);
  };

  /* ------------------------------------------------------------------------ */
  /* ACTUAL ARENA                                                             */
  /* ------------------------------------------------------------------------ */

  if (
    started &&
    selectedSubject &&
    selectedTopic
  ) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <Arena
          questions={selectedQuestions}
          subject={selectedSubject}
          topic={selectedTopic}
          timePerQuestion={10}
          onComplete={(result) => {
            console.log(
              "Arena completed:",
              result
            );

            /*
             * Automatically prepare the next
             * question range.
             *
             * Example:
             *
             * Current: 1–10
             * Next:    11–20
             */
            const nextStart =
              endQuestion + 1;

            if (
              nextStart <= totalQuestions
            ) {
              const nextEnd =
                Math.min(
                  nextStart + 9,
                  totalQuestions
                );

              setStartQuestion(
                nextStart
              );

              setEndQuestion(
                nextEnd
              );
            }

            /*
             * Return to the setup screen
             * so the student can continue.
             */
            setStarted(false);
          }}
        />
      </main>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* SETUP VALIDATION                                                         */
  /* ------------------------------------------------------------------------ */

  const canStart =
    Boolean(selectedSubject) &&
    Boolean(selectedTopic) &&
    totalQuestions > 0 &&
    isValidRange;

  /* ------------------------------------------------------------------------ */
  /* SETUP SCREEN                                                             */
  /* ------------------------------------------------------------------------ */

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">

        {/* ---------------------------------------------------------------- */}
        {/* PAGE HEADER                                                       */}
        {/* ---------------------------------------------------------------- */}

        <header className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-blue-300">
            🎬 Interactive Learning Arena
          </div>

          <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            What do you want to learn?
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Choose a subject, pick a topic, and
            choose the questions you want to learn.
          </p>
        </header>

        {/* ---------------------------------------------------------------- */}
        {/* SETUP CARD                                                        */}
        {/* ---------------------------------------------------------------- */}

        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-2xl">

          {/* ============================================================ */}
          {/* STEP 1 — SUBJECT                                             */}
          {/* ============================================================ */}

          <SubjectSelector
            subjects={SUBJECTS}
            selectedSubject={selectedSubject}
            onSubjectSelect={
              handleSubjectChange
            }
          />

          {/* ============================================================ */}
          {/* STEP 2 — TOPIC                                               */}
          {/* ============================================================ */}

          <TopicSelector
            selectedSubject={selectedSubject}
            topics={topics}
            selectedTopic={selectedTopic}
            onTopicSelect={
              handleTopicChange
            }
          />

          {/* ============================================================ */}
          {/* STEP 3 — QUESTION RANGE                                      */}
          {/* ============================================================ */}

          <div className="border-t border-white/10 p-6 sm:p-8">

            {/* Step header */}

            <div className="flex items-start gap-4">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-500/10 text-xs font-black text-emerald-300">
                03
              </div>

              <div>
                <h2 className="text-lg font-black text-white">
                  Set Question Range
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Choose the questions you want
                  to learn in this session.
                </p>
              </div>

            </div>

            {/* ---------------------------------------------------------- */}
            {/* TOTAL QUESTIONS                                            */}
            {/* ---------------------------------------------------------- */}

            {selectedTopic && (
              <div className="mt-6 rounded-2xl border border-blue-400/10 bg-blue-500/[0.05] p-4">

                <div className="flex items-center justify-between gap-4">

                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                      Questions Available
                    </p>

                    <p className="mt-1 text-2xl font-black text-white">
                      {totalQuestions}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                      This Session
                    </p>

                    <p className="mt-1 text-2xl font-black text-blue-300">
                      {selectedQuestionCount}
                    </p>
                  </div>

                </div>

              </div>
            )}

            {/* ---------------------------------------------------------- */}
            {/* RANGE INPUTS                                               */}
            {/* ---------------------------------------------------------- */}

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">

              {/* Start */}

              <div>
                <label
                  htmlFor="start-question"
                  className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-500"
                >
                  Start Question
                </label>

                <input
                  id="start-question"
                  type="number"
                  min={1}
                  max={totalQuestions || 1}
                  value={startQuestion}
                  disabled={!selectedTopic}
                  onChange={(event) =>
                    handleStartQuestionChange(
                      event.target.value
                    )
                  }
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-lg font-black text-white outline-none transition focus:border-blue-500/50 focus:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
                />
              </div>

              {/* Arrow */}

              <div className="hidden pb-4 text-center text-xl font-black text-slate-600 sm:block">
                →
              </div>

              {/* End */}

              <div>
                <label
                  htmlFor="end-question"
                  className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-500"
                >
                  End Question
                </label>

                <input
                  id="end-question"
                  type="number"
                  min={startQuestion}
                  max={totalQuestions || 1}
                  value={endQuestion}
                  disabled={!selectedTopic}
                  onChange={(event) =>
                    handleEndQuestionChange(
                      event.target.value
                    )
                  }
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-lg font-black text-white outline-none transition focus:border-blue-500/50 focus:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
                />
              </div>

            </div>

            {/* ---------------------------------------------------------- */}
            {/* RANGE SUMMARY                                              */}
            {/* ---------------------------------------------------------- */}

            {selectedTopic && (
              <div className="mt-4 flex items-center justify-center rounded-2xl border border-emerald-400/10 bg-emerald-500/[0.04] px-4 py-3">

                <span className="text-sm text-slate-400">
                  You will learn questions
                </span>

                <span className="mx-2 font-black text-emerald-300">
                  {startQuestion}–{endQuestion}
                </span>

                <span className="text-sm text-slate-400">
                  ({selectedQuestionCount} questions)
                </span>

              </div>
            )}

            {/* ---------------------------------------------------------- */}
            {/* QUICK RANGES                                               */}
            {/* ---------------------------------------------------------- */}

            {quickRanges.length > 0 && (
              <div className="mt-6">

                <div className="mb-3 flex items-center justify-between">

                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Quick Ranges
                  </p>

                  <p className="text-xs text-slate-600">
                    10 questions at a time
                  </p>

                </div>

                <div className="flex flex-wrap gap-2">

                  {quickRanges.map(
                    (range) => {
                      const selected =
                        startQuestion ===
                          range.start &&
                        endQuestion ===
                          range.end;

                      return (
                        <button
                          key={`${range.start}-${range.end}`}
                          type="button"
                          onClick={() =>
                            handleQuickRange(
                              range.start,
                              range.end
                            )
                          }
                          className={[
                            "rounded-xl border px-4 py-2.5 text-sm font-bold transition-all",
                            selected
                              ? "border-blue-400/40 bg-blue-500/15 text-blue-300 shadow-lg shadow-blue-500/5"
                              : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:bg-white/[0.06] hover:text-white",
                          ].join(" ")}
                        >
                          {range.start}–
                          {range.end}
                        </button>
                      );
                    }
                  )}

                </div>

              </div>
            )}

            {/* ---------------------------------------------------------- */}
            {/* VALIDATION MESSAGE                                         */}
            {/* ---------------------------------------------------------- */}

            {selectedTopic &&
              totalQuestions === 0 && (
                <div className="mt-5 rounded-2xl border border-amber-400/10 bg-amber-500/[0.05] p-4 text-center text-sm text-amber-300">
                  There are no questions available
                  for this topic yet.
                </div>
              )}

            {selectedTopic &&
              totalQuestions > 0 &&
              !isValidRange && (
                <div className="mt-5 rounded-2xl border border-red-400/10 bg-red-500/[0.05] p-4 text-center text-sm text-red-300">
                  Please select a valid question
                  range between 1 and{" "}
                  {totalQuestions}.
                </div>
              )}

          </div>

          {/* ============================================================ */}
          {/* START                                                        */}
          {/* ============================================================ */}

          <div className="border-t border-white/10 p-6 sm:p-8">

            {/* Selection summary */}

            {canStart && (
              <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">

                <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Your Lesson
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-semibold">

                  <span className="rounded-lg bg-blue-500/10 px-3 py-1.5 text-blue-300">
                    {selectedSubject}
                  </span>

                  <span className="text-slate-600">
                    →
                  </span>

                  <span className="rounded-lg bg-purple-500/10 px-3 py-1.5 text-purple-300">
                    {selectedTopic}
                  </span>

                  <span className="text-slate-600">
                    →
                  </span>

                  <span className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-emerald-300">
                    Questions{" "}
                    {startQuestion}–
                    {endQuestion}
                  </span>

                </div>

              </div>
            )}

            {/* Start button */}

            <button
              type="button"
              disabled={!canStart}
              onClick={
                handleStartLesson
              }
              className="group w-full rounded-2xl bg-blue-600 px-6 py-4 text-base font-black text-white shadow-xl shadow-blue-900/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-blue-900/30 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-600 disabled:shadow-none"
            >
              <span className="flex items-center justify-center gap-2">

                Start Interactive Lesson

                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>

              </span>
            </button>

            {!selectedSubject && (
              <p className="mt-3 text-center text-xs text-slate-600">
                Select a subject to continue.
              </p>
            )}

            {selectedSubject &&
              !selectedTopic && (
                <p className="mt-3 text-center text-xs text-slate-600">
                  Select a topic to continue.
                </p>
              )}

          </div>

        </section>

        {/* ---------------------------------------------------------------- */}
        {/* FOOTER                                                          */}
        {/* ---------------------------------------------------------------- */}

        <p className="mt-6 text-center text-xs text-slate-600">
          Learn at your own pace. Listen, think,
          answer, and understand.
        </p>

      </div>
    </main>
  );
}






// "use client";

// import { useMemo, useState } from "react";
// import Arena from "@/components/arena/Arena";

// import { SUBJECTS } from "@/data/arena/subjects";
// import TopicSelector from "@/components/arena/TopicSelector";
// import SubjectSelector from "@/components/arena/SubjectSelector";
// import LearningModeSelector from "@/components/arena/LearningModeSelector";

// /* -------------------------------------------------------------------------- */
// /* TYPES                                                                      */
// /* -------------------------------------------------------------------------- */

// type LearningMode = "interactive" | "practice";



// /* -------------------------------------------------------------------------- */
// /* SUBJECTS                                                                   */
// /* -------------------------------------------------------------------------- */



// /* -------------------------------------------------------------------------- */
// /* COMPONENT                                                                  */
// /* -------------------------------------------------------------------------- */

// export default function ArenaPage() {
//   /* ------------------------------------------------------------------------ */
//   /* STATE                                                                    */
//   /* ------------------------------------------------------------------------ */

//   const [selectedSubject, setSelectedSubject] =
//     useState<string>("");



//   const [selectedTopic, setSelectedTopic] =
//     useState<string>("");

//   const [learningMode, setLearningMode] =
//     useState<LearningMode>("interactive");

//   const [started, setStarted] =
//     useState(false);

//   /* ------------------------------------------------------------------------ */
//   /* SELECTED SUBJECT                                                         */
//   /* ------------------------------------------------------------------------ */

//   const currentSubject = useMemo(() => {
//     return SUBJECTS.find(
//       (subject) =>
//         subject.name === selectedSubject
//     );
//   }, [selectedSubject]);

//   const topics = currentSubject?.topics ?? [];

//   const currentTopic = useMemo(() => {
//   return topics.find(
//     (topic) => topic.name === selectedTopic
//   );
// }, [topics, selectedTopic]);

//   const selectedTopicConfig = useMemo(() => {
//   return topics.find(
//     (topic) => topic.name === selectedTopic
//   );
// }, [topics, selectedTopic]);

//   /* ------------------------------------------------------------------------ */
//   /* SUBJECT CHANGE                                                           */
//   /* ------------------------------------------------------------------------ */

//   const handleSubjectChange = (
//     subject: string
//   ) => {
//     setSelectedSubject(subject);

//     /*
//      * Reset topic whenever the subject changes.
//      */
//     setSelectedTopic("");
//   };

//   /* ------------------------------------------------------------------------ */
//   /* START LESSON                                                             */
//   /* ------------------------------------------------------------------------ */

//   const handleStartLesson = () => {
//     if (
//       !selectedSubject ||
//       !selectedTopic
//     ) {
//       return;
//     }

//     setStarted(true);
//   };

//   /* ------------------------------------------------------------------------ */
//   /* ACTUAL ARENA                                                             */
//   /* ------------------------------------------------------------------------ */

//   if (
//     started &&
//     selectedSubject &&
//     selectedTopic
//   ) {
//     /*
//      * Interactive Lesson
//      *
//      * This connects the setup screen to
//      * our actual Arena component.
//      */

//     if (learningMode === "interactive") {
//   return (
//     <main className="min-h-screen bg-slate-950 text-white">
//       <Arena
//       questions={currentTopic?.questions ?? []}
//       subject={selectedSubject}
//       topic={selectedTopic}
//       timePerQuestion={10}
//       onComplete={(result) => {
//         console.log("Arena completed:", result);
//       }}
//     />
//     </main>
//   );
// }

//     /*
//      * Practice mode will eventually have
//      * its own Practice CBT experience.
//      */
//     return (
//       <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
//         <section className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl">
//           <div className="text-5xl">
//             📝
//           </div>

//           <h1 className="mt-5 text-3xl font-black">
//             Practice Questions
//           </h1>

//           <p className="mt-3 text-slate-400">
//             {selectedSubject} • {selectedTopic}
//           </p>

//           <p className="mt-4 text-sm text-slate-500">
//             The Practice Question mode will be
//             connected to the CBT question engine next.
//           </p>

//           <button
//             type="button"
//             onClick={() => {
//               setStarted(false);
//             }}
//             className="mt-8 rounded-2xl bg-white px-7 py-3 font-bold text-slate-950 transition hover:scale-105"
//           >
//             Back to Lesson Setup
//           </button>
//         </section>
//       </main>
//     );
//   }

//   /* ------------------------------------------------------------------------ */
//   /* SETUP SCREEN                                                             */
//   /* ------------------------------------------------------------------------ */

//   const canStart =
//     Boolean(selectedSubject) &&
//     Boolean(selectedTopic) &&
//     Boolean(learningMode);

//   return (
//     <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
//       <div className="mx-auto w-full max-w-5xl">

//         {/* ---------------------------------------------------------------- */}
//         {/* PAGE HEADER                                                       */}
//         {/* ---------------------------------------------------------------- */}

//         <header className="mb-8 text-center">
//           <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-blue-300">
//             🎬 Interactive Learning Arena
//           </div>

//           <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
//             What do you want to learn?
//           </h1>

//           <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
//             Choose a subject, pick a topic, and select
//             how you want to learn.
//           </p>
//         </header>

//         {/* ---------------------------------------------------------------- */}
//         {/* SETUP CARD                                                        */}
//         {/* ---------------------------------------------------------------- */}

//         <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-2xl">

//           {/* ============================================================ */}
//           {/* STEP 1 — SUBJECT                                             */}
//           {/* ============================================================ */}
// <SubjectSelector
//   subjects={SUBJECTS}
//   selectedSubject={selectedSubject}
//   onSubjectSelect={handleSubjectChange}
// />
//           {/* ============================================================ */}
//           {/* STEP 2 — TOPIC                                               */}
//           {/* ============================================================ */}

      
//            <TopicSelector
//   selectedSubject={selectedSubject}
//   topics={topics}
//   selectedTopic={selectedTopic}
//   onTopicSelect={setSelectedTopic}
// />

//           {/* ============================================================ */}
//           {/* STEP 3 — LEARNING MODE                                      */}
//           {/* ============================================================ */}

//  <LearningModeSelector
//   learningMode={learningMode}
//   onModeSelect={setLearningMode}
// />
//           {/* ============================================================ */}
//           {/* START                                                         */}
//           {/* ============================================================ */}

//           <div className="p-6 sm:p-8">

//             {/* Selection summary */}

//             {canStart && (
//               <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
//                 <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
//                   Your Lesson
//                 </div>

//                 <div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-semibold">
//                   <span className="rounded-lg bg-blue-500/10 px-3 py-1.5 text-blue-300">
//                     {selectedSubject}
//                   </span>

//                   <span className="text-slate-600">
//                     →
//                   </span>

//                   <span className="rounded-lg bg-purple-500/10 px-3 py-1.5 text-purple-300">
//                     {selectedTopic}
//                   </span>

//                   <span className="text-slate-600">
//                     →
//                   </span>

//                   <span className="rounded-lg bg-white/5 px-3 py-1.5 text-slate-300">
//                     {learningMode ===
//                     "interactive"
//                       ? "Interactive Lesson"
//                       : "Practice Questions"}
//                   </span>
//                 </div>
//               </div>
//             )}

//             <button
//               type="button"
//               disabled={!canStart}
//               onClick={
//                 handleStartLesson
//               }
//               className="group w-full rounded-2xl bg-blue-600 px-6 py-4 text-base font-black text-white shadow-xl shadow-blue-900/20 transition-all duration-200 hover:bg-blue-500 hover:shadow-blue-900/30 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-600 disabled:shadow-none"
//             >
//               <span className="flex items-center justify-center gap-2">
//                 {learningMode ===
//                 "interactive"
//                   ? "Start Interactive Lesson"
//                   : "Start Practice"}

//                 <span className="transition-transform group-hover:translate-x-1">
//                   →
//                 </span>
//               </span>
//             </button>

//             {!canStart && (
//               <p className="mt-3 text-center text-xs text-slate-600">
//                 Select a subject and topic to continue.
//               </p>
//             )}
//           </div>
//         </section>

//         {/* ---------------------------------------------------------------- */}
//         {/* FOOTER                                                          */}
//         {/* ---------------------------------------------------------------- */}

//         <p className="mt-6 text-center text-xs text-slate-600">
//           Learn at your own pace. Listen, think, answer,
//           and understand.
//         </p>
//       </div>
//     </main>
//   );
// }

// /* -------------------------------------------------------------------------- */
// /* STEP NUMBER                                                                */
// /* -------------------------------------------------------------------------- */

// function StepNumber({
//   number,
// }: {
//   number: string;
// }) {
//   return (
//     <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xs font-black text-slate-400">
//       {number}
//     </div>
//   );
// }

// /* -------------------------------------------------------------------------- */
// /* LEARNING MODE CARD                                                         */
// /* -------------------------------------------------------------------------- */

// interface LearningModeCardProps {
//   selected: boolean;
//   onClick: () => void;
//   icon: string;
//   title: string;
//   description: string;
// }

// function LearningModeCard({
//   selected,
//   onClick,
//   icon,
//   title,
//   description,
// }: LearningModeCardProps) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       className={[
//         "relative rounded-2xl border p-5 text-left transition-all duration-200",
//         selected
//           ? "border-emerald-400/40 bg-emerald-500/10 shadow-lg shadow-emerald-500/5"
//           : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]",
//       ].join(" ")}
//     >
//       {/* Selected indicator */}

//       {selected && (
//         <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs font-black text-white">
//           ✓
//         </div>
//       )}

//       <div className="text-3xl">
//         {icon}
//       </div>

//       <h3
//         className={[
//           "mt-4 text-base font-black",
//           selected
//             ? "text-emerald-300"
//             : "text-white",
//         ].join(" ")}
//       >
//         {title}
//       </h3>

//       <p className="mt-2 pr-6 text-sm leading-relaxed text-slate-500">
//         {description}
//       </p>
//     </button>
//   );
// }

