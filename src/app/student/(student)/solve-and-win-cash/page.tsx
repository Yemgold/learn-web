









// "use client";

// import Link from "next/link";
// import {
//   ArrowRight,
//   BookOpen,
//   Calculator,
//   FlaskConical,
//   GraduationCap,
//   Trophy,
//   Zap,
// } from "lucide-react";

// type Subject = {
//   id: string;
//   name: string;
//   description: string;
//   icon: React.ElementType;
//   iconStyle: string;
//   iconBg: string;
// };

// const SUBJECTS: Subject[] = [
//   {
//     id: "biology",
//     name: "Biology",
//     description: "Test your knowledge of living organisms and life processes.",
//     icon: BookOpen,
//     iconStyle: "text-emerald-400",
//     iconBg: "bg-emerald-400/10 border-emerald-400/20",
//   },
//   {
//     id: "chemistry",
//     name: "Chemistry",
//     description: "Challenge yourself with atoms, reactions, equations and more.",
//     icon: FlaskConical,
//     iconStyle: "text-blue-400",
//     iconBg: "bg-blue-400/10 border-blue-400/20",
//   },
//   {
//     id: "physics",
//     name: "Physics",
//     description: "Solve questions covering motion, energy, forces and more.",
//     icon: Zap,
//     iconStyle: "text-amber-400",
//     iconBg: "bg-amber-400/10 border-amber-400/20",
//   },
//   {
//     id: "mathematics",
//     name: "Mathematics",
//     description: "Put your calculation and problem-solving skills to the test.",
//     icon: Calculator,
//     iconStyle: "text-violet-400",
//     iconBg: "bg-violet-400/10 border-violet-400/20",
//   },
// ];

// export default function SolveAndWinCbtPage() {
//   return (
//     <main className="min-h-screen bg-[#070b14] text-white">
//       <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

//         {/* HEADER */}
//         <header className="mb-10">
//           <div className="flex items-center gap-3">

//             <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 shadow-lg shadow-violet-600/20">
//               <Trophy className="h-6 w-6 text-white" />
//             </div>

//             <div>
//               <h1 className="text-xl font-black sm:text-2xl">
//                 Solve & Win CASH
//               </h1>

//               <p className="text-sm text-slate-400">
//                 Answer questions and win Cash
//               </p>
//             </div>

//           </div>
//         </header>

//         {/* HERO */}
//         <section className="mb-10 overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-[#0d1320] to-[#0d1320] p-6 sm:p-10">

//           <div className="max-w-3xl">

//             <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-semibold text-violet-300">
//               <GraduationCap className="h-4 w-4" />
//               CBT Practice
//             </div>

//             <h2 className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
//               Answer correctly.
//               <br />
//               <span className="text-violet-400">
//                 Win Cash.
//               </span>
//             </h2>

//             <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
//               Choose a subject and start solving. Every correct answer
//               moves you higher on the Cash ladder.
//             </p>

//           </div>

//           {/* QUICK INFO */}
//           <div className="mt-8 grid gap-3 sm:grid-cols-3">

//             <InfoCard
//               value="5000"
//               label="Starting CBT Point"
//             />

//             <InfoCard
//               value="4"
//               label="Subjects"
//             />

//             <InfoCard
//               value="∞"
//               label="Keep Winning"
//             />

//           </div>
//         </section>

//         {/* SUBJECT SECTION */}
//         <section>

//           <div className="mb-5">
//             <h2 className="text-xl font-bold">
//               Choose a Subject
//             </h2>

//             <p className="mt-1 text-sm text-slate-500">
//               Select a subject to start your Solve & Win session.
//             </p>
//           </div>

//           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//             {SUBJECTS.map((subject) => {
//               const Icon = subject.icon;

//               return (
//                 <Link
//                   key={subject.id}
//                   href={`/student/solve-and-win-cash/${subject.id}/play`}
//                   className="group"
//                 >
//                   <article className="relative h-full overflow-hidden rounded-3xl border border-slate-800 bg-[#0d1320] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-violet-500/40 hover:bg-[#101827] hover:shadow-xl hover:shadow-violet-950/20">

//                     {/* TOP */}
//                     <div className="flex items-start justify-between">

//                       <div
//                         className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${subject.iconBg}`}
//                       >
//                         <Icon
//                           className={`h-7 w-7 ${subject.iconStyle}`}
//                         />
//                       </div>

//                       <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800/70 transition group-hover:bg-violet-500">
//                         <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:text-white" />
//                       </div>

//                     </div>

//                     {/* CONTENT */}
//                     <div className="mt-6">

//                       <h3 className="text-xl font-bold">
//                         {subject.name}
//                       </h3>

//                       <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-500">
//                         {subject.description}
//                       </p>

//                     </div>

//                     {/* FOOTER */}
//                     <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">

//                       <span className="text-xs font-medium text-slate-500">
//                         Start Challenge
//                       </span>

//                       <span className="text-xs font-bold text-violet-400">
//                         Play →
//                       </span>

//                     </div>

//                   </article>
//                 </Link>
//               );
//             })}
//           </div>
//         </section>

//         {/* HOW IT WORKS */}
//         <section className="mt-12">

//           <div className="mb-5">
//             <h2 className="text-xl font-bold">
//               How It Works
//             </h2>

//             <p className="mt-1 text-sm text-slate-500">
//               Simple. Answer, win and decide whether to continue.
//             </p>
//           </div>

//           <div className="grid gap-4 md:grid-cols-3">

//             <StepCard
//               number="01"
//               title="Choose a Subject"
//               description="Pick the subject you want to challenge yourself with."
//             />

//             <StepCard
//               number="02"
//               title="Answer Questions"
//               description="Select the correct option from the available CBT answers."
//             />

//             <StepCard
//               number="03"
//               title="Cash Out or Win More"
//               description="After a correct answer, secure your winnings or continue to the next question."
//             />

//           </div>
//         </section>

//         {/* FOOTER NOTE */}
//         <div className="mt-10 flex items-center justify-center text-center text-xs text-slate-600">
//           <p>
//             Solve & Win CBT • Learn more • Win more
//           </p>
//         </div>

//       </div>
//     </main>
//   );
// }

// /* =========================================================
//    INFO CARD
// ========================================================= */

// function InfoCard({
//   value,
//   label,
// }: {
//   value: string;
//   label: string;
// }) {
//   return (
//     <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">

//       <p className="text-xl font-black text-white">
//         {value}
//       </p>

//       <p className="mt-1 text-xs text-slate-500">
//         {label}
//       </p>

//     </div>
//   );
// }

// /* =========================================================
//    STEP CARD
// ========================================================= */

// function StepCard({
//   number,
//   title,
//   description,
// }: {
//   number: string;
//   title: string;
//   description: string;
// }) {
//   return (
//     <div className="rounded-2xl border border-slate-800 bg-[#0d1320] p-5">

//       <div className="flex items-start gap-4">

//         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-xs font-black text-violet-400">
//           {number}
//         </div>

//         <div>
//           <h3 className="font-bold">
//             {title}
//           </h3>

//           <p className="mt-2 text-sm leading-6 text-slate-500">
//             {description}
//           </p>
//         </div>

//       </div>

//     </div>
//   );
// }







"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  FlaskConical,
  GraduationCap,
  Trophy,
  Zap,
  Landmark,
  Languages,
  ShoppingBag,
  ChartNoAxesCombined,
  type LucideIcon,
} from "lucide-react";

type Difficulty = {
  label: string;
  bankDifficulty: "easy" | "medium" | "hard";
  count: number;
  description: string;
  style: string;
};

type Subject = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  iconStyle: string;
  iconBg: string;
};

const DIFFICULTIES: Difficulty[] = [
  {
    label: "Simple",
    bankDifficulty: "easy",
    count: 10,
    description: "10 questions",
    style:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20",
  },
  {
    label: "Medium",
    bankDifficulty: "medium",
    count: 20,
    description: "20 questions",
    style:
      "border-amber-500/20 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20",
  },
  {
    label: "Hard",
    bankDifficulty: "hard",
    count: 30,
    description: "30 questions",
    style:
      "border-rose-500/20 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20",
  },
];

const SUBJECTS: Subject[] = [
  {
    id: "biology",
    name: "Biology",
    description: "Living organisms, ecology, genetics and life processes.",
    icon: BookOpen,
    iconStyle: "text-emerald-400",
    iconBg: "bg-emerald-400/10 border-emerald-400/20",
  },
  {
    id: "chemistry",
    name: "Chemistry",
    description: "Atoms, chemical reactions, equations and compounds.",
    icon: FlaskConical,
    iconStyle: "text-blue-400",
    iconBg: "bg-blue-400/10 border-blue-400/20",
  },
  {
    id: "physics",
    name: "Physics",
    description: "Motion, energy, electricity, forces and waves.",
    icon: Zap,
    iconStyle: "text-amber-400",
    iconBg: "bg-amber-400/10 border-amber-400/20",
  },
  {
    id: "mathematics",
    name: "Mathematics",
    description: "Calculations, algebra, geometry and problem-solving.",
    icon: Calculator,
    iconStyle: "text-violet-400",
    iconBg: "bg-violet-400/10 border-violet-400/20",
  },
  {
    id: "english",
    name: "English Language",
    description: "Grammar, comprehension, vocabulary and oral English.",
    icon: Languages,
    iconStyle: "text-cyan-400",
    iconBg: "bg-cyan-400/10 border-cyan-400/20",
  },
  {
    id: "economics",
    name: "Economics",
    description: "Markets, demand, supply and economic principles.",
    icon: ChartNoAxesCombined,
    iconStyle: "text-orange-400",
    iconBg: "bg-orange-400/10 border-orange-400/20",
  },
  {
    id: "accounting",
    name: "Accounting",
    description: "Bookkeeping, financial statements and calculations.",
    icon: Calculator,
    iconStyle: "text-pink-400",
    iconBg: "bg-pink-400/10 border-pink-400/20",
  },
  {
    id: "commerce",
    name: "Commerce",
    description: "Trade, business, banking, insurance and distribution.",
    icon: ShoppingBag,
    iconStyle: "text-indigo-400",
    iconBg: "bg-indigo-400/10 border-indigo-400/20",
  },
];

function getPlayUrl(subjectId: string, difficulty: Difficulty) {
  const params = new URLSearchParams({
    difficulty: difficulty.bankDifficulty,
    count: String(difficulty.count),
  });

  return `/student/solve-and-win-cash/${subjectId}/play?${params.toString()}`;
}

export default function SolveAndWinCbtPage() {
  return (
    <main className="min-h-screen bg-[#070b14] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 shadow-lg shadow-violet-600/20">
              <Trophy className="h-6 w-6 text-white" />
            </div>

            <div>
              <h1 className="text-xl font-black sm:text-2xl">
                Solve & Win CASH
              </h1>
              <p className="text-sm text-slate-400">
                Practise, improve and climb the reward ladder.
              </p>
            </div>
          </div>
        </header>

        <section className="mb-10 overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-[#0d1320] to-[#0d1320] p-6 sm:p-10">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-semibold text-violet-300">
              <GraduationCap className="h-4 w-4" />
              CBT Practice
            </div>

            <h2 className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              Answer correctly.
              <br />
              <span className="text-violet-400">Win Cash.</span>
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Choose a subject and difficulty. Start with 10 simple questions,
              practise with 20 medium questions, or challenge yourself with
              30 hard questions.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <InfoCard value="8" label="Subjects available" />
            <InfoCard value="10 / 20 / 30" label="Questions per challenge" />
            <InfoCard value="3" label="Difficulty levels" />
          </div>
        </section>

        <section>
          <div className="mb-5">
            <h2 className="text-xl font-bold">Choose a Subject</h2>
            <p className="mt-1 text-sm text-slate-500">
              Select a difficulty under your preferred subject to begin.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {SUBJECTS.map((subject) => {
              const Icon = subject.icon;

              return (
                <article
                  key={subject.id}
                  className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-800 bg-[#0d1320] p-5 transition-colors hover:border-violet-500/40 hover:bg-[#101827]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${subject.iconBg}`}
                    >
                      <Icon className={`h-6 w-6 ${subject.iconStyle}`} />
                    </div>

                    <span className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      CBT
                    </span>
                  </div>

                  <div className="mt-5">
                    <h3 className="text-lg font-bold">{subject.name}</h3>
                    <p className="mt-2 min-h-[60px] text-sm leading-5 text-slate-400">
                      {subject.description}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-slate-800 pt-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Choose difficulty
                    </p>

                    <div className="grid grid-cols-3 gap-2">
                      {DIFFICULTIES.map((difficulty) => (
                        <Link
                          key={difficulty.bankDifficulty}
                          href={getPlayUrl(subject.id, difficulty)}
                          aria-label={`Start ${subject.name}, ${difficulty.label}, ${difficulty.count} questions`}
                          className={`flex min-w-0 flex-col items-center justify-center rounded-xl border px-1.5 py-3 text-center transition ${difficulty.style}`}
                        >
                          <span className="text-xs font-bold">
                            {difficulty.label}
                          </span>
                          <span className="mt-1 text-[10px] opacity-80">
                            {difficulty.count} Qs
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                    <ArrowRight className="h-3.5 w-3.5 text-violet-400" />
                    Choose a level to start
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-5">
            <h2 className="text-xl font-bold">How It Works</h2>
            <p className="mt-1 text-sm text-slate-500">
              Choose your challenge and start answering.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <StepCard
              number="01"
              title="Choose a Subject"
              description="Select Biology, Chemistry, Physics, Mathematics, English Language, Economics, Accounting or Commerce."
            />

            <StepCard
              number="02"
              title="Select Difficulty"
              description="Simple gives you 10 questions, Medium gives you 20, and Hard gives you 30."
            />

            <StepCard
              number="03"
              title="Play Your Challenge"
              description="Answer the questions and follow the reward and cash-out rules displayed in the game."
            />
          </div>
        </section>

        <footer className="mt-10 flex items-center justify-center gap-2 text-center text-xs text-slate-600">
          <Trophy className="h-4 w-4" />
          <p>Solve & Win CBT · Practise smarter</p>
        </footer>
      </div>
    </main>
  );
}

function InfoCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
      <p className="text-xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{label}</p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0d1320] p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-xs font-black text-violet-400">
          {number}
        </div>

        <div>
          <h3 className="font-bold">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
