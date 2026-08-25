

"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import ArenaHeader from "./ArenaHeader";
import ProgressBar from "./ProgressBar";

import QuestionStage from "./QuestionStage";
import QuestionAudio from "./QuestionAudio";
import ThinkingStage from "./ThinkingStage";
import Countdown from "./Countdown";

import AnswerOptions from "./AnswerOptions";
import AnswerReveal from "./AnswerReveal";

import ExplanationStage from "./ExplanationStage";
import ExplanationSteps from "./ExplanationSteps";

import NextQuestionButton from "./NextQuestionButton";

import QuestionAnimation from "./animations/QuestionAnimation";
import CorrectAnimation from "./animations/CorrectAnimation";
import WrongAnimation from "./animations/WrongAnimation";
import ExplanationAnimation from "./animations/ExplanationAnimation";

import Certificate from "@/components/arena/Certificate";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

export type ArenaPhase =
  | "question"
  | "audio"
  | "thinking"
  | "answering"
  | "reveal"
  | "explanation"
  | "finished";

export interface ArenaOption {
  id: string;
  text: string;
}

export interface ArenaExplanation {
  intro: string;
  steps: string[];
}

export interface ArenaQuestion {
  id: string;
  question: string;
  options: ArenaOption[];
  correctAnswer: string;
  explanation: ArenaExplanation;
  questionAudio?: string;
  explanationAudio?: string;
}

export interface ArenaProps {
  questions?: ArenaQuestion[];
  timePerQuestion?: number;
  subject?: string;
  topic?: string;
  onComplete?: (result: {
    score: number;
    totalQuestions: number;
  }) => void;
}



/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export default function Arena({
  questions = [],
  timePerQuestion = 10,
  subject = "Physics",
  topic = "Mechanics",
  onComplete,
}: ArenaProps) {
  /* ------------------------------------------------------------------------ */
  /* STATE                                                                    */
  /* ------------------------------------------------------------------------ */

  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(0);

  const [phase, setPhase] =
    useState<ArenaPhase>("question");

  const [selectedAnswer, setSelectedAnswer] =
    useState<string | null>(null);

  const [score, setScore] = useState(0);

  const [timeLeft, setTimeLeft] =
    useState(timePerQuestion);

  const [isQuestionAudioPlaying, setIsQuestionAudioPlaying] =
    useState(false);

  const [isExplanationAudioPlaying, setIsExplanationAudioPlaying] =
    useState(false);

  /* ------------------------------------------------------------------------ */
  /* CURRENT QUESTION                                                         */
  /* ------------------------------------------------------------------------ */

  const currentQuestion = useMemo(() => {
  return questions[currentQuestionIndex] ?? null;
}, [questions, currentQuestionIndex]);

  const totalQuestions = questions.length;

  const questionNumber = currentQuestionIndex + 1;


  if (!currentQuestion) {
  return (
    <section className="relative flex min-h-[700px] items-center justify-center overflow-hidden rounded-3xl bg-slate-950 p-8 text-white">
      <div className="text-center">
        <div className="text-5xl">📚</div>

        <h2 className="mt-5 text-2xl font-black">
          No questions available
        </h2>

        <p className="mt-2 text-slate-400">
          There are currently no questions available
          for this topic.
        </p>
      </div>
    </section>
  );
}

  /* ------------------------------------------------------------------------ */
  /* PROGRESS                                                                 */
  /* ------------------------------------------------------------------------ */

  const progress = useMemo(() => {
    if (totalQuestions === 0) {
      return 0;
    }

    return (questionNumber / totalQuestions) * 100;
  }, [questionNumber, totalQuestions]);

  /* ------------------------------------------------------------------------ */
  /* RESET QUESTION                                                           */
  /* ------------------------------------------------------------------------ */

  const resetQuestion = useCallback(() => {
    setSelectedAnswer(null);
    setTimeLeft(timePerQuestion);

    setIsQuestionAudioPlaying(false);
    setIsExplanationAudioPlaying(false);

    setPhase("question");
  }, [timePerQuestion]);

  /* ------------------------------------------------------------------------ */
  /* BEGIN QUESTION AUDIO                                                     */
  /* ------------------------------------------------------------------------ */

  const startQuestionAudio = useCallback(() => {
    if (phase !== "question") {
      return;
    }

    /*
     * If this question has an audio file, move into
     * the audio stage.
     *
     * If there is no audio file, skip directly to thinking.
     */
    if (currentQuestion.questionAudio) {
      setPhase("audio");
    } else {
      setPhase("thinking");
      setTimeLeft(timePerQuestion);
    }
  }, [
    phase,
    currentQuestion.questionAudio,
    timePerQuestion,
  ]);

  /* ------------------------------------------------------------------------ */
  /* FINISH QUESTION AUDIO                                                    */
  /* ------------------------------------------------------------------------ */

  const finishQuestionAudio = useCallback(() => {
    setIsQuestionAudioPlaying(false);

    setPhase("thinking");
    setTimeLeft(timePerQuestion);
  }, [timePerQuestion]);

  /* ------------------------------------------------------------------------ */
  /* START THINKING                                                           */
  /* ------------------------------------------------------------------------ */

  const startThinking = useCallback(() => {
    if (
      phase !== "question" &&
      phase !== "audio"
    ) {
      return;
    }

    setIsQuestionAudioPlaying(false);
    setIsExplanationAudioPlaying(false);

    setTimeLeft(timePerQuestion);

    setPhase("thinking");
  }, [phase, timePerQuestion]);

  /* ------------------------------------------------------------------------ */
  /* ANSWER SELECTION                                                         */
  /* ------------------------------------------------------------------------ */

  const handleAnswer = useCallback(
    (answerId: string) => {
      if (
        phase !== "thinking" &&
        phase !== "answering"
      ) {
        return;
      }

      setSelectedAnswer(answerId);

      /*
       * Stop the countdown immediately.
       */
      setPhase("reveal");

      /*
       * Update score only when the answer is correct.
       */
      if (
        answerId ===
        currentQuestion.correctAnswer
      ) {
        setScore(
          (previousScore) =>
            previousScore + 1
        );
      }
    },
    [phase, currentQuestion]
  );

  /* ------------------------------------------------------------------------ */
  /* TIMER                                                                    */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (phase !== "thinking") {
      return;
    }

    if (timeLeft <= 0) {
      setPhase("reveal");
      return;
    }

    const timer = window.setTimeout(() => {
      setTimeLeft(
        (previousTime) =>
          previousTime - 1
      );
    }, 1000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [phase, timeLeft]);










  /* ------------------------------------------------------------------------ */
  /* EXPLANATION                                                              */
  /* ------------------------------------------------------------------------ */

  const showExplanation = useCallback(() => {
    setIsExplanationAudioPlaying(false);

    setPhase("explanation");
  }, []);

  /* ------------------------------------------------------------------------ */
  /* NEXT QUESTION                                                            */
  /* ------------------------------------------------------------------------ */

  const handleNextQuestion = useCallback(() => {
    const isLastQuestion =
      currentQuestionIndex >=
      totalQuestions - 1;

    if (isLastQuestion) {
      setPhase("finished");

      onComplete?.({
        score,
        totalQuestions,
      });

      return;
    }

    setCurrentQuestionIndex(
      (previousIndex) =>
        previousIndex + 1
    );

    setSelectedAnswer(null);

    setTimeLeft(timePerQuestion);

    setIsQuestionAudioPlaying(false);
    setIsExplanationAudioPlaying(false);

    setPhase("question");
  }, [
    currentQuestionIndex,
    totalQuestions,
    onComplete,
    score,
    timePerQuestion,
  ]);

  /* ------------------------------------------------------------------------ */
  /* EMPTY QUESTIONS                                                          */
  /* ------------------------------------------------------------------------ */

  if (!questions.length) {
    return (
      <section className="relative flex min-h-[500px] items-center justify-center overflow-hidden rounded-3xl bg-slate-950 p-8 text-white">
        <div className="relative z-10 text-center">
          <div className="text-5xl">
            📚
          </div>

          <h2 className="mt-5 text-2xl font-black">
            No questions available
          </h2>

          <p className="mt-2 text-slate-400">
            There are currently no questions
            in this Arena.
          </p>
        </div>
      </section>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* FINISHED SCREEN                                                          */
  /* ------------------------------------------------------------------------ */

if (phase === "finished") {
  const percentage =
    totalQuestions > 0
      ? Math.round(
          (score / totalQuestions) * 100
        )
      : 0;

  const perfectScore =
    totalQuestions > 0 &&
    score === totalQuestions;

  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-10 text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[140px]" />

        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[130px]" />

        {perfectScore && (
          <div className="absolute right-0 top-1/3 h-[350px] w-[350px] rounded-full bg-amber-500/10 blur-[120px]" />
        )}
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl">

        {/* Certificate */}
        {perfectScore ? (
          <Certificate
            studentName="Student"
            subject={subject}
            topic={topic}
            correctAnswers={score}
            totalQuestions={totalQuestions}
            onRetry={() => {
              setCurrentQuestionIndex(0);
              setScore(0);
              resetQuestion();
            }}
            onContinue={() => {
              // We will connect this to your
              // topic/subject navigation later.
            }}
          />
        ) : (
          /* Normal result */
          <div className="mx-auto max-w-xl text-center">

            <div className="mb-6 text-6xl">
              🏆
            </div>

            <h1 className="text-4xl font-black">
              Topic Complete!
            </h1>

            <p className="mt-3 text-slate-400">
              You have completed this learning session.
            </p>

            {/* Score */}
            <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">

              <div className="text-sm uppercase tracking-widest text-slate-400">
                Your Score
              </div>

              <div className="mt-2 text-6xl font-black">
                {score}

                <span className="text-2xl text-slate-500">
                  /{totalQuestions}
                </span>
              </div>

              <div className="mt-3 text-xl font-semibold">
                {percentage}%
              </div>

            </div>

            {/* Certificate progress */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">

              <div className="text-2xl">
                🏆
              </div>

              <h3 className="mt-3 font-bold">
                Certificate of Excellence
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Get every question correct to earn
                your Certificate of Excellence for
                this topic.
              </p>

              <p className="mt-3 font-bold text-white">
                {score}/{totalQuestions} correct
              </p>

            </div>

            {/* Retry */}
            <button
              type="button"
              onClick={() => {
                setCurrentQuestionIndex(0);
                setScore(0);
                resetQuestion();
              }}
              className="mt-8 rounded-2xl bg-white px-8 py-4 font-bold text-slate-950 transition hover:scale-105"
            >
              Try Again
            </button>

          </div>
        )}

      </div>
    </section>
  );
}

  /* ------------------------------------------------------------------------ */
  /* ARENA                                                                    */
  /* ------------------------------------------------------------------------ */

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* ------------------------------------------------------------------ */}
      {/* Background                                                         */}
      {/* ------------------------------------------------------------------ */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[140px]" />

        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[130px]" />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Main content                                                       */}
      {/* ------------------------------------------------------------------ */}

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}

        <ArenaHeader
          subject={subject}
          topic={topic}
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
          score={score}
        />

        {/* Progress */}

        <div className="mt-5">
          <ProgressBar
            progress={progress}
          />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* QUESTION                                                         */}
        {/* ---------------------------------------------------------------- */}

        {phase === "question" && (
          <section className="mt-8">
            <QuestionAnimation
              questionKey={
                currentQuestion.id
              }
            >
              <QuestionStage
                question={
                  currentQuestion.question
                }
              />
            </QuestionAnimation>

            <div className="mt-8">
             <QuestionAudio
  question={currentQuestion.question}
  audioUrl={currentQuestion.questionAudio}
  isPlaying={isQuestionAudioPlaying}
  onPlayingChange={setIsQuestionAudioPlaying}
/>
            </div>

            <div className="mt-8 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={
                  startQuestionAudio
                }
                className="rounded-2xl bg-white px-8 py-4 font-bold text-slate-950 shadow-xl transition hover:scale-105"
              >
                {currentQuestion.questionAudio
                  ? "🔊 Listen to Question"
                  : "I'm Ready →"}
              </button>

              {currentQuestion.questionAudio && (
                <button
                  type="button"
                  onClick={
                    startThinking
                  }
                  className="text-sm font-medium text-slate-500 transition hover:text-white"
                >
                  Skip Audio →
                </button>
              )}
            </div>
          </section>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* AUDIO                                                            */}
        {/* ---------------------------------------------------------------- */}

        {phase === "audio" && (
          <section className="mt-8">
            <QuestionAnimation
              questionKey={`${currentQuestion.id}-audio`}
            >
              <QuestionStage
                question={
                  currentQuestion.question
                }
              />
            </QuestionAnimation>

            <div className="mt-8 flex flex-col items-center">
             <QuestionAudio
  question={currentQuestion.question}
  audioUrl={currentQuestion.questionAudio}
  isPlaying={isQuestionAudioPlaying}
  onPlayingChange={setIsQuestionAudioPlaying}
/>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={
                    finishQuestionAudio
                  }
                  className="rounded-2xl bg-white px-8 py-4 font-bold text-slate-950 shadow-xl transition hover:scale-105"
                >
                  I'm Ready → Start Thinking
                </button>

                <button
                  type="button"
                  onClick={startThinking}
                  className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  Skip
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* THINKING / ANSWERING                                             */}
        {/* ---------------------------------------------------------------- */}

        {(phase === "thinking" ||
          phase === "answering") && (
          <section className="mt-8">
            <ThinkingStage
              timeLeft={timeLeft}
            />

            <div className="mt-8">
              <Countdown
                timeLeft={timeLeft}
                totalTime={timePerQuestion}
              />
            </div>

            <div className="mt-10">
              <AnswerOptions
                options={
                  currentQuestion.options
                }
                selectedAnswer={
                  selectedAnswer
                }
                onSelect={handleAnswer}
              />
            </div>
          </section>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* REVEAL                                                          */}
        {/* ---------------------------------------------------------------- */}

        {phase === "reveal" && (
          <section className="mt-8">
            {/* Correct feedback */}

            {selectedAnswer ===
              currentQuestion.correctAnswer && (
              <CorrectAnimation
                show
              />
            )}

            {/* Wrong feedback */}

            {selectedAnswer !== null &&
              selectedAnswer !==
                currentQuestion.correctAnswer && (
                <WrongAnimation
                  show
                />
              )}

            {/* Time expired */}

            {selectedAnswer === null && (
              <div className="mb-6 flex justify-center">
                <div className="rounded-full border border-yellow-400/20 bg-yellow-400/5 px-5 py-2 text-sm font-bold text-yellow-300">
                  ⏰ Time's Up
                </div>
              </div>
            )}

            <AnswerReveal
              options={
                currentQuestion.options
              }
              selectedAnswer={
                selectedAnswer
              }
              correctAnswer={
                currentQuestion.correctAnswer
              }
            />

            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={
                  showExplanation
                }
                className="rounded-2xl bg-white px-8 py-4 font-bold text-slate-950 shadow-xl transition hover:scale-105"
              >
                🧠 See Explanation
              </button>
            </div>
          </section>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* EXPLANATION                                                      */}
        {/* ---------------------------------------------------------------- */}

        {phase === "explanation" && (
          <section className="mt-8">
            <ExplanationAnimation
              title="Let's understand it"
              subtitle="Here's how we arrive at the correct answer."
            >
              <ExplanationStage
                intro={
                  currentQuestion
                    .explanation
                    .intro
                }
                audioUrl={
                  currentQuestion
                    .explanationAudio
                }
                isPlaying={
                  isExplanationAudioPlaying
                }
                onPlayingChange={
                  setIsExplanationAudioPlaying
                }
              />

              <div className="mt-8">
                <ExplanationSteps
                  steps={
                    currentQuestion
                      .explanation
                      .steps
                  }
                />
              </div>
            </ExplanationAnimation>

            <NextQuestionButton
              onNext={
                handleNextQuestion
              }
              currentQuestion={
                questionNumber
              }
              totalQuestions={
                totalQuestions
              }
            />
          </section>
        )}
      </div>
    </main>
  );
}


