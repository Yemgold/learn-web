




"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  GraduationCap,
  KeyRound,
  LockKeyhole,
  LogOut,
  Search,
  ShieldCheck,
  UserRound,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

/* =========================================================
   TYPES
========================================================= */

type StudentPin = {
  pin: string;
  studentId: string;
  studentName: string;
  admissionNumber: string;
  className: string;
  institutionId: string;
  institutionName: string;
  institutionType: "School" | "Study Centre";
  status: "Active" | "Revoked" | "Expired";
  expiryDate: string;
};

type SchoolQuestion = {
  id: string;
  institutionId: string;
  subject: string;
  className: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  duration: number;
};

/* =========================================================
   HARDCODED DEMO STUDENT PINS

   Replace these records with backend verification later.
========================================================= */

const DEMO_PINS: StudentPin[] = [
  {
    pin: "LYF-SCH-2026-001",
    studentId: "STU-001",
    studentName: "Daniel Okafor",
    admissionNumber: "DAN/2026/001",
    className: "SS2",
    institutionId: "SCH-001",
    institutionName: "Bright Future International School",
    institutionType: "School",
    status: "Active",
    expiryDate: "2027-12-31",
  },
  {
    pin: "LYF-SCH-2026-002",
    studentId: "STU-002",
    studentName: "Grace Adeyemi",
    admissionNumber: "GRA/2026/002",
    className: "SS1",
    institutionId: "SCH-001",
    institutionName: "Bright Future International School",
    institutionType: "School",
    status: "Active",
    expiryDate: "2027-12-31",
  },
  {
    pin: "LYF-CEN-2026-001",
    studentId: "STU-003",
    studentName: "Michael Ibrahim",
    admissionNumber: "MIC/2026/001",
    className: "JAMB",
    institutionId: "CEN-001",
    institutionName: "Excellence JAMB Study Centre",
    institutionType: "Study Centre",
    status: "Active",
    expiryDate: "2027-06-30",
  },
  {
    pin: "LYF-SCH-2026-003",
    studentId: "STU-004",
    studentName: "Sarah Williams",
    admissionNumber: "SAR/2026/003",
    className: "SS3",
    institutionId: "SCH-001",
    institutionName: "Bright Future International School",
    institutionType: "School",
    status: "Revoked",
    expiryDate: "2027-12-31",
  },
];

/* =========================================================
   HARDCODED QUESTION BANK

   Questions are separated by institutionId.
========================================================= */

const SCHOOL_QUESTIONS: SchoolQuestion[] = [
  {
    id: "Q001",
    institutionId: "SCH-001",
    subject: "Biology",
    className: "SS2",
    topic: "Nutrition",
    difficulty: "Easy",
    question: "Which of the following is the primary source of energy for most living organisms?",
    options: ["Water", "Sunlight", "Oxygen", "Mineral salts"],
    answer: "Sunlight",
    explanation:
      "Sunlight is the primary energy source for most ecosystems because green plants use it during photosynthesis to manufacture food.",
    duration: 60,
  },
  {
    id: "Q002",
    institutionId: "SCH-001",
    subject: "Biology",
    className: "SS2",
    topic: "Cell Biology",
    difficulty: "Medium",
    question: "Which cell organelle is mainly responsible for the production of ATP?",
    options: ["Ribosome", "Nucleus", "Mitochondrion", "Golgi apparatus"],
    answer: "Mitochondrion",
    explanation:
      "The mitochondrion is the major site of aerobic cellular respiration and ATP production.",
    duration: 60,
  },
  {
    id: "Q003",
    institutionId: "SCH-001",
    subject: "Chemistry",
    className: "SS2",
    topic: "Atomic Structure",
    difficulty: "Easy",
    question: "What is the charge of a proton?",
    options: ["Negative", "Positive", "Neutral", "Variable"],
    answer: "Positive",
    explanation:
      "A proton carries one positive elementary charge and is found in the nucleus of an atom.",
    duration: 60,
  },
  {
    id: "Q004",
    institutionId: "SCH-001",
    subject: "Mathematics",
    className: "SS2",
    topic: "Algebra",
    difficulty: "Hard",
    question: "Solve for x: 3x + 7 = 22.",
    options: ["3", "5", "7", "9"],
    answer: "5",
    explanation:
      "Subtract 7 from both sides: 3x = 15. Divide both sides by 3 to obtain x = 5.",
    duration: 60,
  },
  {
    id: "Q005",
    institutionId: "SCH-001",
    subject: "English Language",
    className: "SS2",
    topic: "Grammar",
    difficulty: "Medium",
    question: "Choose the correctly written sentence.",
    options: [
      "She don't like rice.",
      "She doesn't likes rice.",
      "She doesn't like rice.",
      "She not like rice.",
    ],
    answer: "She doesn't like rice.",
    explanation:
      "The auxiliary verb 'doesn't' is followed by the base form of the main verb, 'like'.",
    duration: 60,
  },
  {
    id: "Q006",
    institutionId: "CEN-001",
    subject: "Biology",
    className: "JAMB",
    topic: "Ecology",
    difficulty: "Medium",
    question: "Which organism occupies the first trophic level in a food chain?",
    options: ["Herbivore", "Carnivore", "Producer", "Decomposer"],
    answer: "Producer",
    explanation:
      "Producers occupy the first trophic level because they manufacture organic food, usually through photosynthesis.",
    duration: 60,
  },
  {
    id: "Q007",
    institutionId: "CEN-001",
    subject: "Chemistry",
    className: "JAMB",
    topic: "Chemical Bonding",
    difficulty: "Hard",
    question: "Which type of bond involves the sharing of electron pairs?",
    options: ["Ionic", "Covalent", "Metallic", "Hydrogen"],
    answer: "Covalent",
    explanation:
      "A covalent bond is formed when two atoms share one or more pairs of electrons.",
    duration: 60,
  },
];

/* =========================================================
   MAIN PAGE
========================================================= */

export default function SchoolCentreAccessPage() {
  const router = useRouter();

  const [pin, setPin] = useState("");
  const [student, setStudent] = useState<StudentPin | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [classFilter, setClassFilter] = useState("All");

  const [selectedQuestion, setSelectedQuestion] =
    useState<SchoolQuestion | null>(null);

  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);

  const [answers, setAnswers] = useState<Record<string, string>>({});

  /* =======================================================
     PIN VERIFICATION

     Replace this function with the backend verification
     endpoint when it becomes available.
  ======================================================= */

  const verifyPin = async () => {
    setError("");

    const normalizedPin = pin.trim().toUpperCase();

    if (!normalizedPin) {
      setError("Please enter your school or study centre PIN.");
      return;
    }

    setLoading(true);

    // Simulated verification delay for the demo.
    await new Promise((resolve) => setTimeout(resolve, 600));

    const matchedPin = DEMO_PINS.find(
      (item) => item.pin.toUpperCase() === normalizedPin
    );

    if (!matchedPin) {
      setError("Invalid PIN. Please check the PIN provided by your institution.");
      setLoading(false);
      return;
    }

    if (matchedPin.status !== "Active") {
      setError(
        matchedPin.status === "Revoked"
          ? "This PIN has been deactivated by your institution."
          : "This PIN has expired. Please contact your institution."
      );
      setLoading(false);
      return;
    }

    if (new Date(matchedPin.expiryDate).getTime() < new Date().setHours(0, 0, 0, 0)) {
      setError("This PIN has expired. Please contact your institution.");
      setLoading(false);
      return;
    }

    setStudent(matchedPin);
    setPin("");
    setLoading(false);
  };

  /* =======================================================
     INSTITUTION QUESTION FILTERING
  ======================================================= */

  const institutionQuestions = useMemo(() => {
    if (!student) return [];

    return SCHOOL_QUESTIONS.filter(
      (question) => question.institutionId === student.institutionId
    );
  }, [student]);

  const subjects = useMemo(
    () => [...new Set(institutionQuestions.map((q) => q.subject))],
    [institutionQuestions]
  );

  const classes = useMemo(
    () => [...new Set(institutionQuestions.map((q) => q.className))],
    [institutionQuestions]
  );

  const filteredQuestions = useMemo(() => {
    return institutionQuestions.filter((question) => {
      const matchesSearch =
        question.question.toLowerCase().includes(search.toLowerCase()) ||
        question.topic.toLowerCase().includes(search.toLowerCase());

      const matchesSubject =
        subjectFilter === "All" || question.subject === subjectFilter;

      const matchesDifficulty =
        difficultyFilter === "All" ||
        question.difficulty === difficultyFilter;

      const matchesClass =
        classFilter === "All" || question.className === classFilter;

      return (
        matchesSearch &&
        matchesSubject &&
        matchesDifficulty &&
        matchesClass
      );
    });
  }, [
    institutionQuestions,
    search,
    subjectFilter,
    difficultyFilter,
    classFilter,
  ]);

  const answeredCount = Object.keys(answers).filter((id) =>
    institutionQuestions.some((q) => q.id === id)
  ).length;

  const correctCount = institutionQuestions.filter(
    (q) => answers[q.id] === q.answer
  ).length;

  /* =======================================================
     QUESTION ANSWERING
  ======================================================= */

  const openQuestion = (question: SchoolQuestion) => {
    setSelectedQuestion(question);
    setSelectedAnswer(answers[question.id] || "");
    setShowExplanation(Boolean(answers[question.id]));
  };

  const submitAnswer = () => {
    if (!selectedQuestion || !selectedAnswer) return;

    setAnswers((previous) => ({
      ...previous,
      [selectedQuestion.id]: selectedAnswer,
    }));

    setShowExplanation(true);
  };

  const closeQuestion = () => {
    setSelectedQuestion(null);
    setSelectedAnswer("");
    setShowExplanation(false);
  };

  const logout = () => {
    setStudent(null);
    setSearch("");
    setSubjectFilter("All");
    setDifficultyFilter("All");
    setClassFilter("All");
    setAnswers({});
    closeQuestion();
  };

  /* =======================================================
     PIN ENTRY SCREEN
  ======================================================= */

  if (!student) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
          <button
            onClick={() => router.push("/student/dashboard")}
            className="mb-10 flex w-fit items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </button>

          <div className="flex flex-1 items-center justify-center py-8">
            <div className="w-full max-w-md">
              <div className="mb-8 text-center">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-cyan-400/20 bg-cyan-400/10">
                  <GraduationCap
                    size={38}
                    className="text-cyan-400"
                  />
                </div>

                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                  <ShieldCheck size={14} />
                  INSTITUTION ACCESS
                </div>

                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                  School & Study Centre
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Enter your individual access PIN to unlock questions
                  provided by your school or study centre.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                    <KeyRound size={21} />
                  </div>
                  <div>
                    <h2 className="font-bold">Enter your access PIN</h2>
                    <p className="text-xs text-slate-400">
                      Your institution provides this PIN.
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    void verifyPin();
                  }}
                  className="space-y-5"
                >
                  <div>
                    <label
                      htmlFor="school-pin"
                      className="mb-2 block text-sm font-semibold text-slate-300"
                    >
                      Student PIN
                    </label>

                    <div className="relative">
                      <LockKeyhole
                        size={19}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                      />

                      <input
                        id="school-pin"
                        type="text"
                        value={pin}
                        onChange={(event) => {
                          setPin(event.target.value.toUpperCase());
                          setError("");
                        }}
                        placeholder="e.g. LYF-SCH-2026-001"
                        autoComplete="off"
                        className="h-14 w-full rounded-xl border border-white/10 bg-slate-950 pl-12 pr-4 text-sm font-bold tracking-wider text-white outline-none transition placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-600 focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                      <XCircle
                        size={18}
                        className="mt-0.5 shrink-0"
                      />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !pin.trim()}
                    className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                        Verifying PIN...
                      </>
                    ) : (
                      <>
                        Verify PIN
                        <ChevronRight size={19} />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 border-t border-white/10 pt-5">
                  <div className="flex items-start gap-3 text-sm text-slate-400">
                    <CircleHelp
                      size={19}
                      className="mt-0.5 shrink-0 text-cyan-400"
                    />
                    <p className="leading-6">
                      Having trouble accessing your questions? Contact
                      your school administrator or study centre for
                      assistance.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Frontend demo PINs
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  School: LYF-SCH-2026-001
                  <br />
                  Study Centre: LYF-CEN-2026-001
                  <br />
                  Revoked test: LYF-SCH-2026-003
                </p>
              </div>

              <p className="mt-8 text-center text-xs text-slate-600">
                Powered by Learnyfi · School & Study Centre Portal
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     STUDENT QUESTION BANK DASHBOARD
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* HEADER */}

        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400">
              <GraduationCap size={26} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Learnyfi Institution Portal
              </p>
              <h1 className="text-lg font-black sm:text-xl">
                School Question Bank
              </h1>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-400/10"
          >
            <LogOut size={17} />
            Exit Access
          </button>
        </header>

        {/* STUDENT PROFILE */}

        <section className="mb-7 overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/15 via-slate-900 to-slate-900 p-5 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                <CheckCircle2 size={14} />
                PIN VERIFIED
              </div>

              <h2 className="text-2xl font-black sm:text-3xl">
                Welcome, {student.studentName.split(" ")[0]}!
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                Your institution's question bank is ready. Keep
                practising and improving your performance.
              </p>

              <div className="mt-5 space-y-2 text-sm">
                <p className="flex items-center gap-2 text-slate-300">
                  <Building2 size={16} className="text-cyan-400" />
                  {student.institutionName}
                </p>

                <p className="flex items-center gap-2 text-slate-400">
                  <UserRound size={16} />
                  {student.studentName} · {student.admissionNumber}
                </p>

                <p className="flex items-center gap-2 text-slate-400">
                  <GraduationCap size={16} />
                  {student.className} · {student.institutionType}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
              <p className="text-xs text-slate-400">PIN expiry</p>
              <p className="mt-1 font-bold text-white">
                {new Date(student.expiryDate).toLocaleDateString()}
              </p>
              <p className="mt-2 text-xs text-emerald-300">
                Active access
              </p>
            </div>
          </div>
        </section>

        {/* STATISTICS */}

        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">Available Questions</p>
              <BookOpen className="text-cyan-400" size={21} />
            </div>
            <p className="mt-3 text-3xl font-black">
              {institutionQuestions.length}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Institution question bank
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">Answered</p>
              <CheckCircle2 className="text-emerald-400" size={21} />
            </div>
            <p className="mt-3 text-3xl font-black">
              {answeredCount}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Questions attempted
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">Correct Answers</p>
              <ShieldCheck className="text-amber-400" size={21} />
            </div>
            <p className="mt-3 text-3xl font-black">
              {correctCount}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Correct responses
            </p>
          </div>
        </section>

        {/* SUBJECTS */}

        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-black">Your Subjects</h2>
            <p className="mt-1 text-sm text-slate-400">
              Choose a subject to explore its available questions.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {subjects.map((subject) => {
              const count = institutionQuestions.filter(
                (q) => q.subject === subject
              ).length;

              return (
                <button
                  key={subject}
                  onClick={() => setSubjectFilter(subject)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    subjectFilter === subject
                      ? "border-cyan-400 bg-cyan-400/10"
                      : "border-white/10 bg-slate-900 hover:border-cyan-400/40"
                  }`}
                >
                  <BookOpen
                    size={22}
                    className="mb-4 text-cyan-400"
                  />
                  <p className="font-bold">{subject}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {count} questions
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* FILTERS */}

        <section className="mb-5">
          <div className="mb-4">
            <h2 className="text-xl font-black">Question Bank</h2>
            <p className="mt-1 text-sm text-slate-400">
              Practise questions uploaded by your institution.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search questions..."
                className="h-12 w-full rounded-xl border border-white/10 bg-slate-900 pl-10 pr-3 text-sm outline-none focus:border-cyan-400"
              />
            </div>

            <select
              value={subjectFilter}
              onChange={(event) => setSubjectFilter(event.target.value)}
              className="h-12 rounded-xl border border-white/10 bg-slate-900 px-3 text-sm outline-none focus:border-cyan-400"
            >
              <option value="All">All Subjects</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>

            <select
              value={classFilter}
              onChange={(event) => setClassFilter(event.target.value)}
              className="h-12 rounded-xl border border-white/10 bg-slate-900 px-3 text-sm outline-none focus:border-cyan-400"
            >
              <option value="All">All Classes</option>
              {classes.map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>

            <select
              value={difficultyFilter}
              onChange={(event) => setDifficultyFilter(event.target.value)}
              className="h-12 rounded-xl border border-white/10 bg-slate-900 px-3 text-sm outline-none focus:border-cyan-400"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {(subjectFilter !== "All" ||
            classFilter !== "All" ||
            difficultyFilter !== "All" ||
            search) && (
            <button
              onClick={() => {
                setSubjectFilter("All");
                setClassFilter("All");
                setDifficultyFilter("All");
                setSearch("");
              }}
              className="mt-3 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
            >
              Clear all filters
            </button>
          )}
        </section>

        {/* QUESTION LIST */}

        <section className="space-y-3">
          {filteredQuestions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/50 p-10 text-center">
              <BookOpen
                size={34}
                className="mx-auto mb-3 text-slate-600"
              />
              <h3 className="font-bold">No questions found</h3>
              <p className="mt-2 text-sm text-slate-500">
                Try changing your filters or search terms.
              </p>
            </div>
          ) : (
            filteredQuestions.map((question, index) => (
              <button
                key={question.id}
                onClick={() => openQuestion(question)}
                className="group flex w-full flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900 p-5 text-left transition hover:border-cyan-400/40 hover:bg-slate-900/80"
              >
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 font-bold text-cyan-400">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-cyan-400/10 px-2 py-1 text-xs font-semibold text-cyan-300">
                        {question.subject}
                      </span>

                      <span className="rounded-md bg-white/5 px-2 py-1 text-xs text-slate-400">
                        {question.className}
                      </span>

                      <span
                        className={`rounded-md px-2 py-1 text-xs font-semibold ${
                          question.difficulty === "Easy"
                            ? "bg-emerald-400/10 text-emerald-300"
                            : question.difficulty === "Medium"
                            ? "bg-amber-400/10 text-amber-300"
                            : "bg-red-400/10 text-red-300"
                        }`}
                      >
                        {question.difficulty}
                      </span>
                    </div>

                    <h3 className="line-clamp-2 font-semibold leading-6 text-slate-100">
                      {question.question}
                    </h3>

                    <p className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                      <BookOpen size={13} />
                      {question.topic}
                      <span>·</span>
                      <Clock3 size={13} />
                      {question.duration}s
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {answers[question.id] ? (
                    <span className="rounded-lg bg-emerald-400/10 px-3 py-2 text-xs font-bold text-emerald-300">
                      Attempted
                    </span>
                  ) : (
                    <span className="rounded-lg bg-cyan-400/10 px-3 py-2 text-xs font-bold text-cyan-300">
                      Practise
                    </span>
                  )}
                  <ChevronRight
                    size={19}
                    className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-cyan-400"
                  />
                </div>
              </button>
            ))
          )}
        </section>

        <footer className="mt-10 border-t border-white/10 py-6 text-center text-xs text-slate-600">
          {student.institutionName} · Powered by Learnyfi
        </footer>
      </div>

      {/* QUESTION MODAL */}

      {selectedQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-3 backdrop-blur-sm sm:p-6">
          <div className="my-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  {selectedQuestion.subject} · {selectedQuestion.topic}
                </p>
                <h3 className="mt-1 font-black">Practice Question</h3>
              </div>

              <button
                onClick={closeQuestion}
                className="rounded-xl bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <XCircle size={22} />
              </button>
            </div>

            <div className="max-h-[75vh] space-y-6 overflow-y-auto p-5 sm:p-7">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-md bg-white/5 px-3 py-1.5 text-slate-300">
                  {selectedQuestion.className}
                </span>
                <span className="rounded-md bg-white/5 px-3 py-1.5 text-slate-300">
                  {selectedQuestion.difficulty}
                </span>
                <span className="flex items-center gap-1 rounded-md bg-white/5 px-3 py-1.5 text-slate-300">
                  <Clock3 size={13} />
                  {selectedQuestion.duration} seconds
                </span>
              </div>

              <h2 className="text-lg font-bold leading-8 sm:text-xl">
                {selectedQuestion.question}
              </h2>

              <div className="space-y-3">
                {selectedQuestion.options.map((option, index) => {
                  const letter = String.fromCharCode(65 + index);
                  const isCorrect = option === selectedQuestion.answer;
                  const isSelected = selectedAnswer === option;

                  let optionStyle =
                    "border-white/10 bg-slate-950 hover:border-cyan-400/50";

                  if (showExplanation && isCorrect) {
                    optionStyle =
                      "border-emerald-400 bg-emerald-400/10 text-emerald-200";
                  } else if (
                    showExplanation &&
                    isSelected &&
                    !isCorrect
                  ) {
                    optionStyle =
                      "border-red-400 bg-red-400/10 text-red-200";
                  } else if (isSelected) {
                    optionStyle =
                      "border-cyan-400 bg-cyan-400/10 text-cyan-200";
                  }

                  return (
                    <button
                      key={option}
                      disabled={showExplanation}
                      onClick={() => setSelectedAnswer(option)}
                      className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left text-sm transition ${optionStyle}`}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-xs font-black">
                        {letter}
                      </span>
                      <span className="flex-1 font-medium">
                        {option}
                      </span>
                      {showExplanation && isCorrect && (
                        <CheckCircle2
                          size={19}
                          className="shrink-0 text-emerald-400"
                        />
                      )}
                      {showExplanation &&
                        isSelected &&
                        !isCorrect && (
                          <XCircle
                            size={19}
                            className="shrink-0 text-red-400"
                          />
                        )}
                    </button>
                  );
                })}
              </div>

              {!showExplanation ? (
                <button
                  disabled={!selectedAnswer}
                  onClick={submitAnswer}
                  className="h-13 w-full rounded-xl bg-cyan-500 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Submit Answer
                </button>
              ) : (
                <div className="space-y-4">
                  <div
                    className={`rounded-xl border p-4 ${
                      selectedAnswer === selectedQuestion.answer
                        ? "border-emerald-400/20 bg-emerald-400/10"
                        : "border-red-400/20 bg-red-400/10"
                    }`}
                  >
                    <p
                      className={`font-bold ${
                        selectedAnswer === selectedQuestion.answer
                          ? "text-emerald-300"
                          : "text-red-300"
                      }`}
                    >
                      {selectedAnswer === selectedQuestion.answer
                        ? "Correct answer!"
                        : "Not quite. Keep learning!"}
                    </p>

                    <p className="mt-2 text-sm text-slate-300">
                      Correct answer:{" "}
                      <strong>{selectedQuestion.answer}</strong>
                    </p>
                  </div>

                  <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4">
                    <p className="mb-2 flex items-center gap-2 font-bold text-cyan-300">
                      <CircleHelp size={17} />
                      Explanation
                    </p>
                    <p className="text-sm leading-7 text-slate-300">
                      {selectedQuestion.explanation}
                    </p>
                  </div>

                  <button
                    onClick={closeQuestion}
                    className="w-full rounded-xl bg-cyan-500 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-400"
                  >
                    Back to Question Bank
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
