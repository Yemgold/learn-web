
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

import {
  ArrowLeft,
  FileQuestion,
  Loader2,
  RefreshCw,
  ShieldAlert,
  Clock,
} from "lucide-react";

import { useAuthStore } from "@/stores/auth.store";
import { getAssessmentById } from "@/lib/schools/portal/services/assessment.service";

/* =========================================================
   TYPES
========================================================= */

interface AssessmentOption {
  key: string;
  text?: string;
  imageUrl?: string;
}

interface AssessmentQuestion {
  _id?: string;
  order?: number;
  questionType?: string;
  questionText?: string;
  questionImages?: string[];
  options?: AssessmentOption[];
  marks?: number;
}

interface AssessmentRecord {
  _id: string;
  title?: string;
  assessmentName?: string;
  description?: string;
  assessmentType?: string;
  status?: string;
  durationMinutes?: number;
  totalMarks?: number;
  passMark?: number;
  questions?: AssessmentQuestion[];
}

/* =========================================================
   HELPERS
========================================================= */

function getRouteValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return value || "";
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object") {
    const record = error as Record<string, unknown>;

    const response = record.response as
      | {
          data?: {
            message?: unknown;
            error?: unknown;
          };
          status?: number;
        }
      | undefined;

    const responseData = response?.data;

    if (responseData && typeof responseData === "object") {
      const data = responseData as Record<string, unknown>;

      if (typeof data.message === "string" && data.message.trim()) {
        return data.message;
      }

      if (typeof data.error === "string" && data.error.trim()) {
        return data.error;
      }
    }

    if (response?.status === 403) {
      return "You do not have permission to view this assessment.";
    }

    if (response?.status === 404) {
      return "The requested assessment could not be found.";
    }

    if (typeof record.message === "string" && record.message.trim()) {
      return record.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to load assessment questions.";
}

function unwrapResponse(response: unknown): unknown {
  let current = response;

  // Axios response -> API response -> API data
  for (let i = 0; i < 6; i++) {
    if (!current || typeof current !== "object") {
      break;
    }

    const record = current as Record<string, unknown>;

    if (record.data !== undefined) {
      current = record.data;
      continue;
    }

    break;
  }

  return current;
}

function extractAssessment(data: unknown): AssessmentRecord | null {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return null;
  }

  const record = data as Record<string, unknown>;

  // Support different backend response structures.
  const possibleAssessment =
    record.assessment ||
    record.assessmentObj ||
    record.assessmentDetails;

  let assessmentData: unknown = possibleAssessment || record;

  // Some endpoints return assessmentObj as an array.
  if (Array.isArray(assessmentData)) {
    assessmentData = assessmentData[0];
  }

  if (
    !assessmentData ||
    typeof assessmentData !== "object" ||
    Array.isArray(assessmentData)
  ) {
    return null;
  }

  const assessment = assessmentData as Record<string, unknown>;

  if (typeof assessment._id !== "string") {
    return null;
  }

  return assessment as unknown as AssessmentRecord;
}

/* =========================================================
   PAGE
========================================================= */

export default function AssessmentDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const slug = getRouteValue(params.slug as string | string[] | undefined);

  const assessmentId = getRouteValue(
    params.assessmentsld as string | string[] | undefined,
  ) || getRouteValue(
    params.assessmentId as string | string[] | undefined,
  );

  const academicSessionId =
    searchParams.get("academicSessionId")?.trim() || "";

  const classId =
    searchParams.get("classId")?.trim() || "";

  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  const schoolSubdomain = String(
    user?.schoolContext?.subDomain || slug,
  )
    .trim()
    .toLowerCase();

  const schoolUrl = `/schools/${slug}`;

  const [assessment, setAssessment] =
    useState<AssessmentRecord | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  /* =====================================================
     LOAD ASSESSMENT
  ===================================================== */

  const loadAssessment = useCallback(async () => {
    if (!assessmentId) {
      setAssessment(null);
      setError("Assessment ID is missing from the page URL.");
      setLoading(false);
      setRefreshing(false);
      return;
    }

    if (!academicSessionId || !classId) {
      setAssessment(null);
      setError(
        "Academic session ID or class ID is missing. Open this assessment from the assessment list so the correct IDs can be passed.",
      );
      setLoading(false);
      setRefreshing(false);
      return;
    }

    if (!schoolSubdomain) {
      setAssessment(null);
      setError("School subdomain could not be identified.");
      setLoading(false);
      setRefreshing(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await getAssessmentById(
        academicSessionId,
        classId,
        assessmentId,
        schoolSubdomain,
      );

      const data = unwrapResponse(response);
      const assessmentData = extractAssessment(data);

      if (!assessmentData) {
        throw new Error(
          "The assessment endpoint returned an invalid or empty assessment record.",
        );
      }

      setAssessment(assessmentData);
    } catch (requestError) {
      setAssessment(null);
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [
    assessmentId,
    academicSessionId,
    classId,
    schoolSubdomain,
  ]);

  useEffect(() => {
    if (!isHydrated) return;

    void loadAssessment();
  }, [isHydrated, loadAssessment]);

  /* =====================================================
     REFRESH
  ===================================================== */

  const handleRefresh = () => {
    setRefreshing(true);
    void loadAssessment();
  };

  /* =====================================================
     DERIVED VALUES
  ===================================================== */

  const questions = Array.isArray(assessment?.questions)
    ? assessment.questions
    : [];

  const assessmentName =
    assessment?.title ||
    assessment?.assessmentName ||
    "Assessment questions";

  /* =====================================================
     HYDRATION
  ===================================================== */

  if (!isHydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-3 text-slate-500">
        <Loader2 className="animate-spin" size={22} />
        Preparing assessment...
      </div>
    );
  }

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading && !assessment) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <Loader2
          size={36}
          className="animate-spin text-indigo-600"
        />

        <h2 className="mt-4 font-semibold text-slate-900">
          Loading assessment questions
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Please wait while the questions are retrieved.
        </p>
      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error && !assessment) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link
          href={`${schoolUrl}/assessments`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600"
        >
          <ArrowLeft size={17} />
          Back to assessments
        </Link>

        <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <ShieldAlert size={25} />
          </div>

          <h1 className="text-xl font-bold text-slate-900">
            Unable to load assessment
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {error}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {refreshing ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <RefreshCw size={16} />
              )}
              Try again
            </button>

            <Link
              href={`${schoolUrl}/assessments`}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back to assessments
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* =====================================================
     QUESTIONS
  ===================================================== */

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href={`${schoolUrl}/assessments`}
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600"
          >
            <ArrowLeft size={17} />
            Back to assessments
          </Link>

          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Assessment questions
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {assessmentName}
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          {refreshing ? (
            <Loader2 size={17} className="animate-spin" />
          ) : (
            <RefreshCw size={17} />
          )}
          Refresh
        </button>
      </div>

      {/* ASSESSMENT SUMMARY */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">
          {assessmentName}
        </h2>

        {assessment?.description && (
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
            {assessment.description}
          </p>
        )}

        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Questions</p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {questions.length}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Total marks</p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {assessment?.totalMarks ?? 0}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Pass mark</p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {assessment?.passMark ?? 0}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Duration</p>
            <p className="mt-1 flex items-center gap-1 text-xl font-bold text-slate-900">
              <Clock size={17} />
              {assessment?.durationMinutes ?? 0} min
            </p>
          </div>
        </div>
      </div>

      {/* ASSESSMENT QUESTIONS */}

      <section className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Assessment questions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Questions attached to this assessment.
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-bold text-indigo-700">
            {questions.length} question(s)
          </span>
        </div>

        {questions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
            <FileQuestion
              size={34}
              className="mx-auto text-slate-400"
            />

            <h3 className="mt-3 font-semibold text-slate-800">
              No questions available
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              No questions were returned for this assessment.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question, index) => (
              <article
                key={question._id || index}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
              >
                {/* QUESTION HEADER */}

                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <span className="font-bold text-slate-900">
                    Question {question.order || index + 1}
                  </span>

                  <div className="flex flex-wrap items-center gap-2">
                    {question.questionType && (
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                        {question.questionType.replaceAll("_", " ")}
                      </span>
                    )}

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {question.marks ?? 0} mark(s)
                    </span>
                  </div>
                </div>

                {/* QUESTION TEXT */}

                <p className="whitespace-pre-wrap text-base font-medium leading-7 text-slate-800">
                  {question.questionText || "No question text provided."}
                </p>

                {/* QUESTION IMAGES */}

                {Array.isArray(question.questionImages) &&
                  question.questionImages.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {question.questionImages.map((image, imageIndex) => (
                        <img
                          key={`${question._id || index}-image-${imageIndex}`}
                          src={image}
                          alt={`Question ${index + 1} image ${imageIndex + 1}`}
                          className="max-h-72 max-w-full rounded-lg border border-slate-200 object-contain"
                        />
                      ))}
                    </div>
                  )}

                {/* OPTIONS */}

                {Array.isArray(question.options) &&
                  question.options.length > 0 && (
                    <div className="mt-5 space-y-3">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={`${option.key}-${optionIndex}`}
                          className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-sm font-bold text-indigo-700 ring-1 ring-slate-200">
                            {option.key}
                          </span>

                          <div className="min-w-0 flex-1">
                            {option.text && (
                              <p className="whitespace-pre-wrap pt-1 text-sm leading-6 text-slate-700">
                                {option.text}
                              </p>
                            )}

                            {option.imageUrl && (
                              <img
                                src={option.imageUrl}
                                alt={`Option ${option.key}`}
                                className="mt-2 max-h-48 max-w-full rounded-lg object-contain"
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </article>
            ))}
          </div>
        )}
      </section>

      {/* FOOTER */}

      <div className="border-t border-slate-200 pt-5">
        <p className="text-xs text-slate-400">
          Learnyfi School Assessment Management
        </p>
      </div>
    </div>
  );
}
