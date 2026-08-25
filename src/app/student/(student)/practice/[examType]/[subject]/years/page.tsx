"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Loader2,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  getSubjectById,
  type Subject,
} from "@/lib/api/subjects";

import { axiosInstance } from "@/lib/api/axios";

import {
  usePracticeStore,
} from "@/stores/practiceStore";

/* ============================================================
   EXAM TYPE
   ============================================================ */

type ExamType = "jamb" | "waec" | "neco";

/* ============================================================
   EXAM CONFIG
   ============================================================ */

const examConfig: Record<
  ExamType,
  {
    label: string;
    title: string;
    description: string;
  }
> = {
  jamb: {
    label: "JAMB Practice",
    title: "Select a JAMB Examination Year",
    description:
      "Select a JAMB examination year to practice past questions.",
  },

  waec: {
    label: "WAEC Practice",
    title: "Select a WAEC Examination Year",
    description:
      "Select a WAEC examination year to practice past questions.",
  },

  neco: {
    label: "NECO Practice",
    title: "Select a NECO Examination Year",
    description:
      "Select a NECO examination year to practice past questions.",
  },
};

/* ============================================================
   SUBJECT STYLES
   ============================================================ */

const subjectStyles: Record<
  string,
  {
    color: string;
    bg: string;
  }
> = {
  english: {
    color: "text-blue-600",
    bg: "bg-blue-100",
  },

  mathematics: {
    color: "text-green-600",
    bg: "bg-green-100",
  },

  physics: {
    color: "text-purple-600",
    bg: "bg-purple-100",
  },

  chemistry: {
    color: "text-orange-600",
    bg: "bg-orange-100",
  },

  biology: {
    color: "text-pink-600",
    bg: "bg-pink-100",
  },

  government: {
    color: "text-red-600",
    bg: "bg-red-100",
  },

  geography: {
    color: "text-cyan-600",
    bg: "bg-cyan-100",
  },

  englishlit: {
    color: "text-indigo-600",
    bg: "bg-indigo-100",
  },

  literature: {
    color: "text-indigo-600",
    bg: "bg-indigo-100",
  },

  economics: {
    color: "text-emerald-600",
    bg: "bg-emerald-100",
  },

  crk: {
    color: "text-rose-600",
    bg: "bg-rose-100",
  },

  irk: {
    color: "text-amber-600",
    bg: "bg-amber-100",
  },

  history: {
    color: "text-violet-600",
    bg: "bg-violet-100",
  },

  currentaffairs: {
    color: "text-sky-600",
    bg: "bg-sky-100",
  },

  insurance: {
    color: "text-teal-600",
    bg: "bg-teal-100",
  },

  civicledu: {
    color: "text-lime-600",
    bg: "bg-lime-100",
  },
};

/* ============================================================
   HELPERS
   ============================================================ */

function getSubjectKey(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z]/g, "");
}

function getSubjectStyle(name: string) {
  const key = getSubjectKey(name);

  return (
    subjectStyles[key] ?? {
      color: "text-slate-600",
      bg: "bg-slate-100",
    }
  );
}

function getSubjectDisplayName(name: string) {
  const names: Record<string, string> = {
    english: "Use of English",
    mathematics: "Mathematics",
    physics: "Physics",
    chemistry: "Chemistry",
    biology: "Biology",
    government: "Government",
    geography: "Geography",
    literature: "Literature",
    englishlit: "Literature",
    crk: "Christian Religious Knowledge",
    irk: "Islamic Religious Knowledge",
    economics: "Economics",
    currentaffairs: "Current Affairs",
    insurance: "Insurance",
    civiledu: "Civic Education",
    history: "History",
  };

  return (
    names[name.toLowerCase()] ??
    name
      .replace(
        /([a-z])([A-Z])/g,
        "$1 $2",
      )
      .replace(
        /\b\w/g,
        (char) => char.toUpperCase(),
      )
  );
}

/* ============================================================
   YEARS
   ============================================================ */

const years = Array.from(
  {
    length: 2026 - 2000 + 1,
  },
  (_, index) => 2000 + index,
);

const YEARS_PER_PAGE = 6;

/* ============================================================
   QUESTIONS RESPONSE
   ============================================================ */

interface QuestionsResponse {
  success: boolean;
  message?: string;

  data?: ReturnType<
    typeof usePracticeStore.getState
  >["questions"];
}

/* ============================================================
   PAGE
   ============================================================ */

export default function PracticeYearsPage() {
  const params = useParams();
  const router = useRouter();

  /* ==========================================================
     EXAM TYPE
     ========================================================== */

  const rawExamType =
    typeof params.examType === "string"
      ? params.examType.toLowerCase()
      : "";

  /*
   * IMPORTANT:
   *
   * The exam type MUST come from the URL.
   *
   * /student/practice/jamb/...
   * /student/practice/waec/...
   * /student/practice/neco/...
   */

  const isValidExam =
    rawExamType === "jamb" ||
    rawExamType === "waec" ||
    rawExamType === "neco";

  const examType: ExamType =
    isValidExam
      ? rawExamType
      : "jamb";

  const config =
    examConfig[examType];

  /* ==========================================================
     SUBJECT ID
     ========================================================== */

  const subjectId =
    typeof params.subject === "string"
      ? params.subject
      : "";

  /* ==========================================================
     SUBJECT STATE
     ========================================================== */

  const [subject, setSubject] =
    useState<Subject | null>(null);

  const [
    loadingSubject,
    setLoadingSubject,
  ] = useState(true);

  const [
    subjectError,
    setSubjectError,
  ] = useState<string | null>(null);

  /* ==========================================================
     PRACTICE STORE
     ========================================================== */

  const setQuestions =
    usePracticeStore(
      (state) => state.setQuestions,
    );

  const startSession =
    usePracticeStore(
      (state) => state.startSession,
    );

  /* ==========================================================
     LOCAL STATE
     ========================================================== */

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [
    startingYear,
    setStartingYear,
  ] = useState<number | null>(null);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  /* ==========================================================
     LOAD SUBJECT
     ========================================================== */

  useEffect(() => {
    let cancelled = false;

    async function loadSubject() {
      try {
        setLoadingSubject(true);
        setSubjectError(null);

        if (!subjectId) {
          throw new Error(
            "No subject ID was provided.",
          );
        }

        console.log(
          "========================================",
        );

        console.log(
          "LOAD SUBJECT",
        );

        console.log(
          "Exam Type:",
          examType,
        );

        console.log(
          "Subject ID:",
          subjectId,
        );

        console.log(
          "========================================",
        );

        const result =
          await getSubjectById(
            subjectId,
            "SECONDARY",
          );

        if (cancelled) {
          return;
        }

        console.log(
          "Subject loaded:",
          result,
        );

        setSubject(result);
      } catch (error: any) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to load subject:",
          error,
        );

        setSubjectError(
          error?.response?.data?.message ??
            error?.message ??
            "Subject not found.",
        );
      } finally {
        if (!cancelled) {
          setLoadingSubject(false);
        }
      }
    }

    loadSubject();

    return () => {
      cancelled = true;
    };
  }, [subjectId, examType]);

  /* ==========================================================
     YEAR PAGINATION
     ========================================================== */

  const totalPages = Math.ceil(
    years.length /
      YEARS_PER_PAGE,
  );

  const currentYears =
    useMemo(() => {
      const startIndex =
        (currentPage - 1) *
        YEARS_PER_PAGE;

      const endIndex =
        startIndex +
        YEARS_PER_PAGE;

      return years.slice(
        startIndex,
        endIndex,
      );
    }, [currentPage]);

  /* ==========================================================
     START PRACTICE
     ========================================================== */

  const handleStartPractice =
    async (year: number) => {
      if (!subject) {
        return;
      }

      /*
       * IMPORTANT:
       *
       * DO NOT WRITE:
       *
       * const EXAM_TYPE = "jamb";
       *
       * The exam type must come from the URL.
       */

      const PLAN = "SECONDARY";

      const EXAM_TYPE =
        examType;

      try {
        setStartingYear(year);
        setError(null);

        console.log(
          "========================================",
        );

        console.log(
          "START PRACTICE",
        );

        console.log(
          "Exam Type:",
          EXAM_TYPE,
        );

        console.log(
          "Subject ID:",
          subject._id,
        );

        console.log(
          "Subject:",
          subject.name,
        );

        console.log(
          "Year:",
          year,
        );

        console.log(
          "Plan:",
          PLAN,
        );

        console.log(
          "========================================",
        );

        /* ====================================================
           CACHE CHECK
           ==================================================== */

        const cachedQuestions =
          usePracticeStore
            .getState()
            .getCachedQuestions(
              subject._id,
              year,
              PLAN,
              EXAM_TYPE,
            );

        let questions;

        /* ====================================================
           USE CACHE
           ==================================================== */

        if (
          cachedQuestions?.length
        ) {
          console.log(
            "USING CACHED QUESTIONS",
          );

          console.log(
            "Exam Type:",
            EXAM_TYPE,
          );

          console.log(
            "Questions:",
            cachedQuestions.length,
          );

          questions =
            cachedQuestions;
        }

        /* ====================================================
           FETCH QUESTIONS
           ==================================================== */

        else {
          console.log(
            "FETCHING QUESTIONS FROM BACKEND",
          );

          console.log(
            "Endpoint:",
            "/questions/paid-questions-per-plan",
          );

          console.log(
            "Request examType:",
            EXAM_TYPE,
          );

          const response =
            await axiosInstance.get<QuestionsResponse>(
              "/questions/paid-questions-per-plan",
              {
                params: {
                  plan: PLAN,

                  subjectId:
                    subject._id,

                  year,

                  /*
                   * THIS IS NOW DYNAMIC.
                   *
                   * JAMB URL -> jamb
                   * WAEC URL -> waec
                   * NECO URL -> neco
                   */
                  examType:
                    EXAM_TYPE,
                },
              },
            );

          console.log(
            "Backend response:",
            response.data,
          );

          /* ==================================================
             VALIDATE RESPONSE
             ================================================== */

          if (
            !response.data?.success
          ) {
            throw new Error(
              response.data?.message ??
                `Failed to fetch ${EXAM_TYPE.toUpperCase()} questions.`,
            );
          }

          questions =
            response.data?.data ??
            [];

          /* ==================================================
             NO QUESTIONS
             ================================================== */

          if (!questions.length) {
            setError(
              `No ${subject.name} ${EXAM_TYPE.toUpperCase()} questions were found for ${year}.`,
            );

            return;
          }

          /* ==================================================
             CACHE QUESTIONS
             ================================================== */

          usePracticeStore
            .getState()
            .cacheQuestions(
              subject._id,
              year,
              PLAN,
              EXAM_TYPE,
              questions,
            );

          console.log(
            "Questions saved to cache:",
            questions.length,
          );
        }

        /* ====================================================
           SAFETY CHECK
           ==================================================== */

        if (!questions.length) {
          setError(
            `No ${subject.name} ${EXAM_TYPE.toUpperCase()} questions were found for ${year}.`,
          );

          return;
        }

        /* ====================================================
           LOAD QUESTIONS
           ==================================================== */

        setQuestions(
          questions,
        );

        /* ====================================================
           CREATE SESSION
           ==================================================== */

        startSession({
          subjectSlug:
            subject._id,

          subjectId:
            subject._id,

          subjectName:
            getSubjectDisplayName(
              subject.name,
            ),

          year,

          plan: PLAN,

          /*
           * IMPORTANT:
           *
           * This is also dynamic.
           */
          examType:
            EXAM_TYPE,

          startedAt:
            new Date().toISOString(),

          currentQuestionIndex: 0,

          answers: {},

          completed: false,
        });

        /* ====================================================
           NAVIGATE
           ==================================================== */

        const sessionRoute =
          `/student/practice/${EXAM_TYPE}/${subject._id}/years/${year}/session`;

        console.log(
          "Navigating to:",
          sessionRoute,
        );

        router.push(
          sessionRoute,
        );
      } catch (error: any) {
        console.error(
          "Failed to start practice:",
          error,
        );

        const backendMessage =
          error?.response?.data
            ?.message;

        let message =
          `Unable to load ${EXAM_TYPE.toUpperCase()} questions. Please try again.`;

        if (
          Array.isArray(
            backendMessage,
          )
        ) {
          message =
            backendMessage.join(
              ", ",
            );
        } else if (
          typeof backendMessage ===
          "string"
        ) {
          message =
            backendMessage;
        } else if (
          error?.message
        ) {
          message =
            error.message;
        }

        setError(message);
      } finally {
        setStartingYear(null);
      }
    };

  /* ==========================================================
     LOADING SUBJECT
     ========================================================== */

  if (loadingSubject) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-16">
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex items-center gap-3 text-slate-600">
              <Loader2 className="h-6 w-6 animate-spin" />

              <span>
                Loading{" "}
                {config.label.replace(
                  " Practice",
                  "",
                )}{" "}
                subject...
              </span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ==========================================================
     SUBJECT ERROR
     ========================================================== */

  if (
    subjectError ||
    !subject
  ) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-16">
          <Card className="mx-auto max-w-xl p-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900">
              Subject Not Found
            </h1>

            <p className="mt-3 text-slate-600">
              {subjectError ??
                "The subject you are looking for does not exist."}
            </p>

            <div className="mt-6">
              <Link
                href={`/student/practice/${examType}/combination`}
              >
                <Button
                  fullWidth
                  leftIcon={
                    <ArrowLeft className="h-4 w-4" />
                  }
                >
                  Back to Combination
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  /* ==========================================================
     STYLE
     ========================================================== */

  const style =
    getSubjectStyle(
      subject.name,
    );

  const displayName =
    getSubjectDisplayName(
      subject.name,
    );

  /* ==========================================================
     PAGINATION
     ========================================================== */

  const handlePrevious =
    () => {
      setCurrentPage(
        (page) =>
          Math.max(
            1,
            page - 1,
          ),
      );
    };

  const handleNext =
    () => {
      setCurrentPage(
        (page) =>
          Math.min(
            totalPages,
            page + 1,
          ),
      );
    };

  /* ==========================================================
     UI
     ========================================================== */

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-6 sm:py-10">

        {/* ====================================================
            BACK
            ==================================================== */}

        <Link
          href={`/student/practice/${examType}/combination`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900 sm:mb-8"
        >
          <ArrowLeft className="h-4 w-4" />

          Back to Combination
        </Link>

        {/* ====================================================
            HEADER
            ==================================================== */}

        <div className="mb-8 sm:mb-10">
          <span
            className={`inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm font-semibold ${style.bg} ${style.color}`}
          >
            <CalendarDays className="h-4 w-4" />

            {config.label}
          </span>

          <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            {displayName}
          </h1>

          <p className="mt-3 max-w-3xl text-base text-slate-600 sm:text-lg">
            {config.description}
          </p>

          <p className="mt-2 text-sm font-medium text-slate-500">
            Available years: 2000 – 2026
          </p>
        </div>

        {/* ====================================================
            ERROR
            ==================================================== */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* ====================================================
            PAGE INFORMATION
            ==================================================== */}

        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
            Select a Year
          </h2>

          <span className="text-sm font-medium text-slate-500">
            Page{" "}
            {currentPage}{" "}
            of{" "}
            {totalPages}
          </span>
        </div>

        {/* ====================================================
            YEARS
            ==================================================== */}

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {currentYears.map(
            (year) => {
              const isLoading =
                startingYear ===
                year;

              return (
                <Card
                  key={year}
                  hoverable
                  className="flex flex-col p-4 sm:p-6"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl sm:h-14 sm:w-14 ${style.bg}`}
                  >
                    <CalendarDays
                      className={`h-6 w-6 sm:h-7 sm:w-7 ${style.color}`}
                    />
                  </div>

                  <h2 className="mt-4 text-xl font-bold text-slate-900 sm:mt-5 sm:text-2xl">
                    {year}
                  </h2>

                  <p className="mt-1 text-xs text-slate-500 sm:mt-2 sm:text-sm">
                    {displayName} ·{" "}
                    {examType.toUpperCase()}
                  </p>

                  <div className="mt-4 flex-1 sm:mt-6" />

                  <Button
                    fullWidth
                    disabled={
                      startingYear !==
                      null
                    }
                    onClick={() =>
                      handleStartPractice(
                        year,
                      )
                    }
                    rightIcon={
                      isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ArrowRight className="h-4 w-4" />
                      )
                    }
                  >
                    {isLoading
                      ? `Loading ${examType.toUpperCase()}...`
                      : "Practice"}
                  </Button>
                </Card>
              );
            },
          )}
        </div>

        {/* ====================================================
            PAGINATION
            ==================================================== */}

        <div className="mt-8 flex items-center justify-between gap-3 sm:mt-10">

          <Button
            variant="outline"
            disabled={
              currentPage === 1 ||
              startingYear !== null
            }
            onClick={
              handlePrevious
            }
            leftIcon={
              <ArrowLeft className="h-4 w-4" />
            }
          >
            <span className="hidden sm:inline">
              Previous
            </span>

            <span className="sm:hidden">
              Prev
            </span>
          </Button>

          <div className="hidden items-center gap-2 sm:flex">
            {Array.from(
              {
                length:
                  totalPages,
              },
              (_, index) =>
                index + 1,
            ).map(
              (page) => (
                <button
                  key={page}
                  type="button"
                  disabled={
                    startingYear !==
                    null
                  }
                  onClick={() =>
                    setCurrentPage(
                      page,
                    )
                  }
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition ${
                    currentPage ===
                    page
                      ? `${style.bg} ${style.color}`
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {page}
                </button>
              ),
            )}
          </div>

          <span className="text-sm font-semibold text-slate-600 sm:hidden">
            {currentPage} /{" "}
            {totalPages}
          </span>

          <Button
            variant="outline"
            disabled={
              currentPage ===
                totalPages ||
              startingYear !==
                null
            }
            onClick={
              handleNext
            }
            rightIcon={
              <ArrowRight className="h-4 w-4" />
            }
          >
            Next
          </Button>
        </div>
      </div>
    </main>
  );
}












// "use client";

// import Link from "next/link";
// import { useParams, useRouter } from "next/navigation";

// import {
//   ArrowLeft,
//   ArrowRight,
//   CalendarDays,
//   Loader2,
// } from "lucide-react";

// import {
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// import {
//   getSubjectById,
//   type Subject,
// } from "@/lib/api/subjects";

// import { axiosInstance } from "@/lib/api/axios";

// import {
//   usePracticeStore,
// } from "@/stores/practiceStore";

// /* ============================================================
//    SUBJECT STYLES
//    ============================================================ */

// const subjectStyles: Record<
//   string,
//   {
//     color: string;
//     bg: string;
//   }
// > = {
//   english: {
//     color: "text-blue-600",
//     bg: "bg-blue-100",
//   },

//   mathematics: {
//     color: "text-green-600",
//     bg: "bg-green-100",
//   },

//   physics: {
//     color: "text-purple-600",
//     bg: "bg-purple-100",
//   },

//   chemistry: {
//     color: "text-orange-600",
//     bg: "bg-orange-100",
//   },

//   biology: {
//     color: "text-pink-600",
//     bg: "bg-pink-100",
//   },

//   government: {
//     color: "text-red-600",
//     bg: "bg-red-100",
//   },

//   geography: {
//     color: "text-cyan-600",
//     bg: "bg-cyan-100",
//   },

//   englishlit: {
//     color: "text-indigo-600",
//     bg: "bg-indigo-100",
//   },

//   literature: {
//     color: "text-indigo-600",
//     bg: "bg-indigo-100",
//   },

//   economics: {
//     color: "text-emerald-600",
//     bg: "bg-emerald-100",
//   },

//   crk: {
//     color: "text-rose-600",
//     bg: "bg-rose-100",
//   },

//   irk: {
//     color: "text-amber-600",
//     bg: "bg-amber-100",
//   },

//   history: {
//     color: "text-violet-600",
//     bg: "bg-violet-100",
//   },

//   currentaffairs: {
//     color: "text-sky-600",
//     bg: "bg-sky-100",
//   },

//   insurance: {
//     color: "text-teal-600",
//     bg: "bg-teal-100",
//   },

//   civicledu: {
//     color: "text-lime-600",
//     bg: "bg-lime-100",
//   },
// };

// /* ============================================================
//    HELPERS
//    ============================================================ */

// function getSubjectKey(name: string) {
//   return name
//     .toLowerCase()
//     .replace(/\s+/g, "")
//     .replace(/[^a-z]/g, "");
// }

// function getSubjectStyle(name: string) {
//   const key = getSubjectKey(name);

//   return (
//     subjectStyles[key] ?? {
//       color: "text-slate-600",
//       bg: "bg-slate-100",
//     }
//   );
// }

// function getSubjectDisplayName(name: string) {
//   const names: Record<string, string> = {
//     english: "Use of English",
//     mathematics: "Mathematics",
//     physics: "Physics",
//     chemistry: "Chemistry",
//     biology: "Biology",
//     government: "Government",
//     geography: "Geography",
//     literature: "Literature",
//     englishlit: "Literature",
//     crk: "Christian Religious Knowledge",
//     irk: "Islamic Religious Knowledge",
//     economics: "Economics",
//     currentaffairs: "Current Affairs",
//     insurance: "Insurance",
//     civiledu: "Civic Education",
//     history: "History",
//   };

//   return (
//     names[name.toLowerCase()] ??
//     name
//       .replace(
//         /([a-z])([A-Z])/g,
//         "$1 $2",
//       )
//       .replace(
//         /\b\w/g,
//         (char) => char.toUpperCase(),
//       )
//   );
// }

// /* ============================================================
//    YEARS
//    ============================================================ */

// const years = Array.from(
//   {
//     length: 2026 - 2000 + 1,
//   },
//   (_, index) => 2000 + index,
// );

// const YEARS_PER_PAGE = 6;

// /* ============================================================
//    QUESTIONS RESPONSE
//    ============================================================ */

// interface QuestionsResponse {
//   success: boolean;
//   message?: string;

//   data?: ReturnType<
//     typeof usePracticeStore.getState
//   >["questions"];
// }

// /* ============================================================
//    PAGE
//    ============================================================ */

// export default function PracticeYearsPage() {
//   const params = useParams();
//   const router = useRouter();

//   /*
//    * The URL contains the real MongoDB subject ID.
//    *
//    * Example:
//    *
//    * /student/practice/
//    * 69bd417a74676c09ac65bc56/
//    * years
//    */

//   const examType =
//   typeof params.examType === "string"
//     ? params.examType.toLowerCase()
//     : "";

//   const subjectId =
//     typeof params.subject === "string"
//       ? params.subject
//       : "";

//   /* ==========================================================
//      SUBJECT
//      ========================================================== */

//   const [subject, setSubject] =
//     useState<Subject | null>(null);

//   const [
//     loadingSubject,
//     setLoadingSubject,
//   ] = useState(true);

//   const [
//     subjectError,
//     setSubjectError,
//   ] = useState<string | null>(null);

//   /* ==========================================================
//      ZUSTAND
//      ========================================================== */

//   const setQuestions =
//     usePracticeStore(
//       (state) => state.setQuestions,
//     );

//   const startSession =
//     usePracticeStore(
//       (state) => state.startSession,
//     );

//   const resetPractice =
//     usePracticeStore(
//       (state) => state.resetPractice,
//     );

//   /* ==========================================================
//      LOCAL STATE
//      ========================================================== */

//   const [
//     currentPage,
//     setCurrentPage,
//   ] = useState(1);

//   const [
//     startingYear,
//     setStartingYear,
//   ] = useState<number | null>(null);

//   const [
//     error,
//     setError,
//   ] = useState<string | null>(null);

//   /* ==========================================================
//      LOAD SUBJECT
//      ========================================================== */

//   useEffect(() => {
//     let cancelled = false;

//     async function loadSubject() {
//       try {
//         setLoadingSubject(true);
//         setSubjectError(null);

//         if (!subjectId) {
//           throw new Error(
//             "No subject ID was provided.",
//           );
//         }

//         console.log(
//           "========== LOAD SUBJECT ==========",
//         );

//         console.log(
//           "Subject ID:",
//           subjectId,
//         );

//         const result =
//           await getSubjectById(
//             subjectId,
//             "SECONDARY",
//           );

//         if (cancelled) {
//           return;
//         }

//         console.log(
//           "Subject loaded:",
//           result,
//         );

//         setSubject(result);
//       } catch (error: any) {
//         if (cancelled) {
//           return;
//         }

//         console.error(
//           "Failed to load subject:",
//           error,
//         );

//         setSubjectError(
//           error?.response?.data?.message ??
//             error?.message ??
//             "Subject not found.",
//         );
//       } finally {
//         if (!cancelled) {
//           setLoadingSubject(false);
//         }
//       }
//     }

//     loadSubject();

//     return () => {
//       cancelled = true;
//     };
//   }, [subjectId]);

//   /* ==========================================================
//      YEAR PAGINATION
//      ========================================================== */

//   const totalPages = Math.ceil(
//     years.length /
//       YEARS_PER_PAGE,
//   );

//   const currentYears =
//     useMemo(() => {
//       const startIndex =
//         (currentPage - 1) *
//         YEARS_PER_PAGE;

//       const endIndex =
//         startIndex +
//         YEARS_PER_PAGE;

//       return years.slice(
//         startIndex,
//         endIndex,
//       );
//     }, [currentPage]);

//   /* ==========================================================
//      START PRACTICE
//      ========================================================== */

//      const handleStartPractice = async (year: number) => {
//   if (!subject) {
//     return;
//   }

//   const PLAN = "SECONDARY";
//   const EXAM_TYPE = "jamb";

//   try {
//     setStartingYear(year);
//     setError(null);

//     /* ========================================================
//        CACHE CHECK
//        ======================================================== */

//     const cachedQuestions =
//       usePracticeStore
//         .getState()
//         .getCachedQuestions(
//           subject._id,
//           year,
//           PLAN,
//           EXAM_TYPE,
//         );

//     let questions;

//     /* ========================================================
//        USE CACHE
//        ======================================================== */

//     if (cachedQuestions?.length) {
//       console.log(
//         "========================================",
//       );

//       console.log(
//         "USING CACHED QUESTIONS",
//       );

//       console.log(
//         "Subject ID:",
//         subject._id,
//       );

//       console.log(
//         "Subject:",
//         subject.name,
//       );

//       console.log(
//         "Year:",
//         year,
//       );

//       console.log(
//         "Questions:",
//         cachedQuestions.length,
//       );

//       console.log(
//         "========================================",
//       );

//       questions = cachedQuestions;
//     }

//     /* ========================================================
//        FETCH FROM BACKEND
//        ======================================================== */

//     else {
//       console.log(
//         "========================================",
//       );

//       console.log(
//         "FETCHING QUESTIONS FROM BACKEND",
//       );

//       console.log(
//         "Subject ID:",
//         subject._id,
//       );

//       console.log(
//         "Subject:",
//         subject.name,
//       );

//       console.log(
//         "Year:",
//         year,
//       );

//       console.log(
//         "========================================",
//       );

//       const response =
//         await axiosInstance.get<QuestionsResponse>(
//           "/questions/paid-questions-per-plan",
//           {
//             params: {
//               plan: PLAN,

//               subjectId: subject._id,

//               year,

//               examType: EXAM_TYPE,
//             },
//           },
//         );

//       console.log(
//         "Backend response:",
//         response.data,
//       );

//       /* ======================================================
//          VALIDATE RESPONSE
//          ====================================================== */

//       if (!response.data?.success) {
//         throw new Error(
//           response.data?.message ??
//             "Failed to fetch questions.",
//         );
//       }

//       questions =
//         response.data?.data ?? [];

//       /* ======================================================
//          NO QUESTIONS
//          ====================================================== */

//       if (!questions.length) {
//         setError(
//           `No ${subject.name} questions were found for ${year}.`,
//         );

//         return;
//       }

//       /* ======================================================
//          SAVE TO CACHE
//          ====================================================== */

//       usePracticeStore
//         .getState()
//         .cacheQuestions(
//           subject._id,
//           year,
//           PLAN,
//           EXAM_TYPE,
//           questions,
//         );

//       console.log(
//         "Questions saved to Zustand cache:",
//         questions.length,
//       );
//     }

//     /* ========================================================
//        SAFETY CHECK
//        ======================================================== */

//     if (!questions.length) {
//       setError(
//         `No ${subject.name} questions were found for ${year}.`,
//       );

//       return;
//     }

//     /* ========================================================
//        LOAD QUESTIONS INTO CURRENT SESSION
//        ======================================================== */

//     setQuestions(questions);

//     /* ========================================================
//        CREATE SESSION
//        ======================================================== */

//     startSession({
//       subjectSlug: subject._id,

//       subjectId: subject._id,

//       subjectName:
//         getSubjectDisplayName(
//           subject.name,
//         ),

//       year,

//       plan: PLAN,

//       examType: EXAM_TYPE,

//       startedAt:
//         new Date().toISOString(),

//       currentQuestionIndex: 0,

//       answers: {},

//       completed: false,
//     });

//     /* ========================================================
//        NAVIGATE
//        ======================================================== */

//     router.push(
//   `/student/practice/${examType}/${subject._id}/years/${year}/session`,
// );

//   } catch (error: any) {
//     console.error(
//       "Failed to start practice:",
//       error,
//     );

//     const backendMessage =
//       error?.response?.data?.message;

//     let message =
//       "Unable to load questions. Please try again.";

//     if (Array.isArray(backendMessage)) {
//       message =
//         backendMessage.join(", ");
//     } else if (
//       typeof backendMessage === "string"
//     ) {
//       message = backendMessage;
//     } else if (error?.message) {
//       message = error.message;
//     }

//     setError(message);
//   } finally {
//     setStartingYear(null);
//   }
// };

//   /* ==========================================================
//      LOADING SUBJECT
//      ========================================================== */

//   if (loadingSubject) {
//     return (
//       <main className="min-h-screen bg-slate-50">
//         <div className="container mx-auto px-4 py-16">
//           <div className="flex min-h-[300px] items-center justify-center">
//             <div className="flex items-center gap-3 text-slate-600">
//               <Loader2 className="h-6 w-6 animate-spin" />

//               <span>
//                 Loading subject...
//               </span>
//             </div>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   /* ==========================================================
//      SUBJECT ERROR
//      ========================================================== */

//   if (
//     subjectError ||
//     !subject
//   ) {
//     return (
//       <main className="min-h-screen bg-slate-50">
//         <div className="container mx-auto px-4 py-16">
//           <Card className="mx-auto max-w-xl p-8 text-center">
//             <h1 className="text-3xl font-bold text-slate-900">
//               Subject Not Found
//             </h1>

//             <p className="mt-3 text-slate-600">
//               {subjectError ??
//                 "The subject you are looking for does not exist."}
//             </p>

//             <div className="mt-6">
//               <Link href="/student/practice/subjects">
//                 <Button
//                   fullWidth
//                   leftIcon={
//                     <ArrowLeft className="h-4 w-4" />
//                   }
//                 >
//                   Back to Subjects
//                 </Button>
//               </Link>
//             </div>
//           </Card>
//         </div>
//       </main>
//     );
//   }

//   /* ==========================================================
//      STYLE
//      ========================================================== */

//   const style =
//     getSubjectStyle(
//       subject.name,
//     );

//   const displayName =
//     getSubjectDisplayName(
//       subject.name,
//     );

//   /* ==========================================================
//      PAGINATION
//      ========================================================== */

//   const handlePrevious =
//     () => {
//       setCurrentPage(
//         (page) =>
//           Math.max(
//             1,
//             page - 1,
//           ),
//       );
//     };

//   const handleNext =
//     () => {
//       setCurrentPage(
//         (page) =>
//           Math.min(
//             totalPages,
//             page + 1,
//           ),
//       );
//     };

//   /* ==========================================================
//      UI
//      ========================================================== */

//   return (
//     <main className="min-h-screen bg-slate-50">
//       <div className="container mx-auto px-4 py-6 sm:py-10">

//         {/* ====================================================
//             BACK
//             ==================================================== */}

//         <Link
//           href="/student/practice/subjects"
//           className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900 sm:mb-8"
//         >
//           <ArrowLeft className="h-4 w-4" />

//           Back to Subjects
//         </Link>

//         {/* ====================================================
//             HEADER
//             ==================================================== */}

//         <div className="mb-8 sm:mb-10">
//           <span
//             className={`inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm font-semibold ${style.bg} ${style.color}`}
//           >
//             <CalendarDays className="h-4 w-4" />

//             Past Questions
//           </span>

//           <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
//             {displayName}
//           </h1>

//           <p className="mt-3 max-w-3xl text-base text-slate-600 sm:text-lg">
//             Select a JAMB examination year
//             to practice{" "}
//             {displayName} questions.
//           </p>

//           <p className="mt-2 text-sm font-medium text-slate-500">
//             Available years: 2000 – 2026
//           </p>
//         </div>

//         {/* ====================================================
//             ERROR
//             ==================================================== */}

//         {error && (
//           <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
//             {error}
//           </div>
//         )}

//         {/* ====================================================
//             PAGE INFORMATION
//             ==================================================== */}

//         <div className="mb-5 flex items-center justify-between">
//           <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
//             Select a Year
//           </h2>

//           <span className="text-sm font-medium text-slate-500">
//             Page{" "}
//             {currentPage}{" "}
//             of{" "}
//             {totalPages}
//           </span>
//         </div>

//         {/* ====================================================
//             YEARS
//             ==================================================== */}

//         <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
//           {currentYears.map(
//             (year) => {
//               const isLoading =
//                 startingYear ===
//                 year;

//               return (
//                 <Card
//                   key={year}
//                   hoverable
//                   className="flex flex-col p-4 sm:p-6"
//                 >
//                   <div
//                     className={`flex h-12 w-12 items-center justify-center rounded-xl sm:h-14 sm:w-14 ${style.bg}`}
//                   >
//                     <CalendarDays
//                       className={`h-6 w-6 sm:h-7 sm:w-7 ${style.color}`}
//                     />
//                   </div>

//                   <h2 className="mt-4 text-xl font-bold text-slate-900 sm:mt-5 sm:text-2xl">
//                     {year}
//                   </h2>

//                   <p className="mt-1 text-xs text-slate-500 sm:mt-2 sm:text-sm">
//                     {displayName}
//                   </p>

//                   <div className="mt-4 flex-1 sm:mt-6" />

//                   <Button
//                     fullWidth
//                     disabled={
//                       startingYear !==
//                       null
//                     }
//                     onClick={() =>
//                       handleStartPractice(
//                         year,
//                       )
//                     }
//                     rightIcon={
//                       isLoading ? (
//                         <Loader2 className="h-4 w-4 animate-spin" />
//                       ) : (
//                         <ArrowRight className="h-4 w-4" />
//                       )
//                     }
//                   >
//                     {isLoading
//                       ? "Loading..."
//                       : "Practice"}
//                   </Button>
//                 </Card>
//               );
//             },
//           )}
//         </div>

//         {/* ====================================================
//             PAGINATION
//             ==================================================== */}

//         <div className="mt-8 flex items-center justify-between gap-3 sm:mt-10">

//           <Button
//             variant="outline"
//             disabled={
//               currentPage ===
//                 1 ||
//               startingYear !==
//                 null
//             }
//             onClick={
//               handlePrevious
//             }
//             leftIcon={
//               <ArrowLeft className="h-4 w-4" />
//             }
//           >
//             <span className="hidden sm:inline">
//               Previous
//             </span>

//             <span className="sm:hidden">
//               Prev
//             </span>
//           </Button>

//           <div className="hidden items-center gap-2 sm:flex">
//             {Array.from(
//               {
//                 length:
//                   totalPages,
//               },
//               (_, index) =>
//                 index + 1,
//             ).map(
//               (page) => (
//                 <button
//                   key={page}
//                   type="button"
//                   disabled={
//                     startingYear !==
//                     null
//                   }
//                   onClick={() =>
//                     setCurrentPage(
//                       page,
//                     )
//                   }
//                   className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition ${
//                     currentPage ===
//                     page
//                       ? `${style.bg} ${style.color}`
//                       : "text-slate-500 hover:bg-slate-100"
//                   }`}
//                 >
//                   {page}
//                 </button>
//               ),
//             )}
//           </div>

//           <span className="text-sm font-semibold text-slate-600 sm:hidden">
//             {currentPage}{" "}
//             /{" "}
//             {totalPages}
//           </span>

//           <Button
//             variant="outline"
//             disabled={
//               currentPage ===
//                 totalPages ||
//               startingYear !==
//                 null
//             }
//             onClick={
//               handleNext
//             }
//             rightIcon={
//               <ArrowRight className="h-4 w-4" />
//             }
//           >
//             Next
//           </Button>
//         </div>
//       </div>
//     </main>
//   );
// }


