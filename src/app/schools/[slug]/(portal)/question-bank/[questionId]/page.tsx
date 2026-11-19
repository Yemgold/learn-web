


"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { useQuestionBank } from "@/hooks/schools/useQuestionBank";

/* =========================================================
   TYPES AND HELPERS
========================================================= */

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function getText(
  value: unknown,
  fallback = "Not provided"
): string {
  if (typeof value === "string" && value.trim()) {
    return value;
  }

  if (
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  return fallback;
}

function getArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function formatLabel(value: unknown): string {
  return getText(value, "Unknown")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: unknown;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-gray-900">
        {getText(value)}
      </p>
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function QuestionDetailsPage() {
  const params = useParams<{
    slug: string;
    questionId: string;
  }>();

  const searchParams = useSearchParams();

  const slug = params.slug;
  const questionId = params.questionId;

  const academicSessionId =
    searchParams.get("academicSessionId") || "";

  const classId = searchParams.get("classId") || "";
  const subjectId = searchParams.get("subjectId") || "";

  const user = useAuthStore((state) => state.user);

  const schoolSubdomain =
    user?.schoolContext?.subDomain || slug;

  const {
    selectedQuestion,
    fetchQuestionById,
  } = useQuestionBank(slug);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD QUESTION
  ========================================================= */

  useEffect(() => {
    let cancelled = false;

    async function loadQuestion() {
      if (
        !questionId ||
        !academicSessionId ||
        !classId ||
        !subjectId
      ) {
        setError(
          "Question details cannot be loaded because one or more required IDs are missing from the URL."
        );

        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        await fetchQuestionById(
          questionId,
          academicSessionId,
          classId,
          subjectId
        );
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load this question."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadQuestion();

    return () => {
      cancelled = true;
    };
  }, [
    questionId,
    academicSessionId,
    classId,
    subjectId,
    fetchQuestionById,
  ]);

  /* =========================================================
     NORMALIZE QUESTION DATA
  ========================================================= */

  const question = useMemo(
    () =>
      isRecord(selectedQuestion)
        ? selectedQuestion
        : null,
    [selectedQuestion]
  );

  const answerKey: UnknownRecord = isRecord(
    question?.answerKey
  )
    ? question.answerKey
    : {};

  const options = getArray(question?.options);

  const questionImages = getArray(
    question?.questionImages
  );

  const correctOptionKeys = getArray(
    answerKey.correctOptionKeys
  )
    .map((item) => getText(item, ""))
    .filter(Boolean);

  const correctOptionKey = getText(
    answerKey.correctOptionKey,
    ""
  );

  const acceptedAnswers = getArray(
    answerKey.acceptedAnswers
  )
    .map((item) => getText(item, ""))
    .filter(Boolean);

  // Convert unknown answer-key values into strings
  // before rendering them in React.
  const modelAnswer = getText(
    answerKey.modelAnswer,
    ""
  );

  const markingGuide = getText(
    answerKey.markingGuide,
    ""
  );

  const explanation = getText(
    question?.explanation,
    ""
  );

  const topic = getText(
    question?.topic,
    "Not provided"
  );

  const questionStatus = formatLabel(
    question?.status
  );

  const questionType = formatLabel(
    question?.questionType
  );

  const difficulty = formatLabel(
    question?.difficulty
  );

  const questionRecordId = getText(
    question?._id || question?.id,
    questionId
  );

  const backUrl =
    `/schools/${slug}/question-bank?academicSessionId=${encodeURIComponent(
      academicSessionId
    )}`;

  /* =========================================================
     LOADING STATE
  ========================================================= */

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

          <p className="mt-3 text-sm text-gray-500">
            Loading question details...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR STATE
  ========================================================= */

  if (error || !question) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <Link
          href={backUrl}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to Question Bank
        </Link>

        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-800">
            Unable to load question
          </h2>

          <p className="mt-2 text-sm text-red-700">
            {error ||
              "The requested question could not be found."}
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     MAIN PAGE
  ========================================================= */

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6">
      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Link
            href={backUrl}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            ← Back to Question Bank
          </Link>

          <h1 className="mt-3 text-2xl font-bold text-gray-900">
            Question Details
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View the complete details of this question.
          </p>
        </div>

        <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
          {questionStatus}
        </span>
      </div>

      {/* QUESTION INFORMATION */}

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
            {questionType}
          </span>

          <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
            {difficulty}
          </span>
        </div>

        <h2 className="text-lg font-semibold text-gray-900">
          Question
        </h2>

        <div className="mt-3 whitespace-pre-wrap text-base leading-7 text-gray-800">
          {getText(question.questionText)}
        </div>

        {questionImages.length > 0 && (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {questionImages.map((image, index) => {
              const imageUrl = getText(image, "");

              if (!imageUrl) return null;

              return (
                <div key={`${imageUrl}-${index}`}>
                  <img
                    src={imageUrl}
                    alt={`Question image ${index + 1}`}
                    className="max-h-80 w-full rounded-lg border border-gray-200 object-contain"
                  />
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ANSWER OPTIONS */}

      {options.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Answer Options
          </h2>

          <div className="mt-4 space-y-3">
            {options.map((option, index) => {
              const item: UnknownRecord = isRecord(
                option
              )
                ? option
                : {};

              const optionKey = getText(
                item.key,
                ""
              );

              const isCorrect =
                optionKey === correctOptionKey ||
                correctOptionKeys.includes(optionKey);

              const optionText = getText(
                item.text
              );

              const optionImageUrl =
                getText(item.imageUrl, "");

              return (
                <div
                  key={`${optionKey}-${index}`}
                  className={`rounded-lg border p-4 ${
                    isCorrect
                      ? "border-green-300 bg-green-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-gray-700">
                      {optionKey || index + 1}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-800">
                        {optionText}
                      </p>

                      {optionImageUrl && (
                        <img
                          src={optionImageUrl}
                          alt={`Option ${optionKey} image`}
                          className="mt-3 max-h-48 rounded-lg object-contain"
                        />
                      )}
                    </div>

                    {isCorrect && (
                      <span className="shrink-0 text-xs font-semibold text-green-700">
                        Correct answer
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ANSWER KEY */}

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Answer Key
        </h2>

        <div className="mt-4 space-y-4">
          {correctOptionKey && (
            <DetailItem
              label="Correct Option"
              value={correctOptionKey}
            />
          )}

          {correctOptionKeys.length > 0 && (
            <DetailItem
              label="Correct Options"
              value={correctOptionKeys.join(", ")}
            />
          )}

          {typeof answerKey.correctBoolean ===
            "boolean" && (
            <DetailItem
              label="Correct Answer"
              value={
                answerKey.correctBoolean
                  ? "True"
                  : "False"
              }
            />
          )}

          {acceptedAnswers.length > 0 && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Accepted Answers
              </p>

              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-800">
                {acceptedAnswers.map(
                  (answer, index) => (
                    <li key={`${answer}-${index}`}>
                      {answer}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

          {modelAnswer && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Model Answer
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-800">
                {modelAnswer}
              </p>
            </div>
          )}

          {markingGuide && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Marking Guide
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-800">
                {markingGuide}
              </p>
            </div>
          )}

          {!correctOptionKey &&
            correctOptionKeys.length === 0 &&
            typeof answerKey.correctBoolean !==
              "boolean" &&
            acceptedAnswers.length === 0 &&
            !modelAnswer &&
            !markingGuide && (
              <p className="text-sm text-gray-500">
                No answer key information is available.
              </p>
            )}
        </div>
      </section>

      {/* ADDITIONAL INFORMATION */}

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Additional Information
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DetailItem
            label="Question Type"
            value={questionType}
          />

          <DetailItem
            label="Difficulty"
            value={difficulty}
          />

          <DetailItem
            label="Topic"
            value={topic}
          />

          <DetailItem
            label="Status"
            value={questionStatus}
          />

          <DetailItem
            label="Question ID"
            value={questionRecordId}
          />

          <DetailItem
            label="School"
            value={schoolSubdomain}
          />
        </div>

        {explanation && (
          <div className="mt-5 border-t border-gray-100 pt-5">
            <h3 className="text-sm font-semibold text-gray-900">
              Explanation
            </h3>

            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">
              {explanation}
            </p>
          </div>
        )}
      </section>

      {/* FOOTER */}

      <div className="flex justify-end">
        <Link
          href={backUrl}
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Back to Question Bank
        </Link>
      </div>
    </div>
  );
}