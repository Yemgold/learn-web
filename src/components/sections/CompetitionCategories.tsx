"use client";

import Link from "next/link";

import {
  BookOpen,
  Target,
  School,
  Swords,
  ArrowRight,
  Users,
  Zap,
  Trophy,
  Sparkles,
} from "lucide-react";

import Container from "@/components/layout/Container";

const competitions = [
  {
    number: "01",
    title: "UTME Challenge",
    description:
      "Test your JAMB readiness with carefully selected UTME-style questions and compete against students across Nigeria.",
    icon: Target,
    badge: "Most Popular",
    badgeStyle: "bg-yellow-400/15 text-yellow-700 border-yellow-400/20",
    iconStyle: "bg-blue-600 text-white",
    subjects: ["English", "Mathematics", "Physics", "Chemistry"],
    participants: "10K+ students",
    href: "/competitions/utme-challenge",
  },

  {
    number: "02",
    title: "Subject Battles",
    description:
      "Face off against other teams in individual subjects and prove who has the strongest academic knowledge.",
    icon: Swords,
    badge: "Team Mode",
    badgeStyle: "bg-indigo-50 text-indigo-700 border-indigo-100",
    iconStyle: "bg-indigo-600 text-white",
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology"],
    participants: "Team competition",
    href: "/competitions/subject-battles",
  },

  {
    number: "03",
    title: "Mock Exam League",
    description:
      "Experience realistic JAMB-style examinations, track your score and see how you rank against other students.",
    icon: BookOpen,
    badge: "Practice",
    badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-100",
    iconStyle: "bg-emerald-600 text-white",
    subjects: ["Full UTME", "Timed Tests", "Past Questions", "Analytics"],
    participants: "Daily practice",
    href: "/competitions/mock-exam",
  },

  {
    number: "04",
    title: "School Championship",
    description:
      "Represent your school, compete against institutions across Nigeria and help your school reach the national top.",
    icon: School,
    badge: "Schools",
    badgeStyle: "bg-orange-50 text-orange-700 border-orange-100",
    iconStyle: "bg-orange-500 text-white",
    subjects: ["School Ranking", "Team Scores", "National Rank", "Awards"],
    participants: "500+ schools",
    href: "/competitions/school-championship",
  },
];

export default function CompetitionCategories() {
  return (
    <section className="relative overflow-hidden bg-[#f5f8ff] py-20 sm:py-24 lg:py-28">

      {/* =========================================================
          BACKGROUND
         ========================================================= */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-[45rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/5 blur-3xl"
      />

      <Container>

        {/* =======================================================
            HEADER
           ======================================================= */}

        <div className="relative mx-auto mb-14 max-w-3xl text-center">

          {/* Badge */}

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-700 shadow-sm">

            <Sparkles
              size={14}
              className="text-yellow-500"
            />

            Competition Arena

          </div>


          {/* Heading */}

          <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">

            Choose your

            <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
              challenge.
            </span>

          </h2>


          {/* Description */}

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base sm:leading-8">
            Whether you want to test your JAMB readiness, battle other teams,
            practise under exam conditions or represent your school, there is
            a challenge waiting for you.
          </p>

        </div>


        {/* =======================================================
            COMPETITION CARDS
           ======================================================= */}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {competitions.map((competition) => {
            const Icon = competition.icon;

            return (
              <Link
                key={competition.number}
                href={competition.href}
                className="group relative block h-full"
              >

                {/* Card glow */}

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-1 rounded-[1.6rem] bg-gradient-to-br from-blue-500/10 via-transparent to-indigo-500/10 opacity-0 blur-xl transition duration-500 group-hover:opacity-100"
                />


                {/* Card */}

                <div className="relative flex h-full min-h-[430px] flex-col overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:border-blue-200 group-hover:shadow-2xl group-hover:shadow-blue-900/10 sm:p-7">

                  {/* =================================================
                      TOP
                     ================================================= */}

                  <div className="flex items-start justify-between">

                    {/* Icon */}

                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-2 ${competition.iconStyle}`}
                    >
                      <Icon
                        size={26}
                        strokeWidth={2}
                      />
                    </div>


                    {/* Number */}

                    <span className="text-5xl font-black leading-none text-slate-100 transition-colors duration-300 group-hover:text-blue-50">
                      {competition.number}
                    </span>

                  </div>


                  {/* =================================================
                      BADGE
                     ================================================= */}

                  <div className="mt-6">

                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${competition.badgeStyle}`}
                    >
                      {competition.badge}
                    </span>

                  </div>


                  {/* =================================================
                      TITLE
                     ================================================= */}

                  <h3 className="mt-4 text-xl font-black tracking-tight text-slate-950 transition-colors group-hover:text-blue-700">
                    {competition.title}
                  </h3>


                  {/* =================================================
                      DESCRIPTION
                     ================================================= */}

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {competition.description}
                  </p>


                  {/* =================================================
                      SUBJECT / FEATURES
                     ================================================= */}

                  <div className="mt-6 flex flex-wrap gap-2">

                    {competition.subjects.map((subject) => (
                      <span
                        key={subject}
                        className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-[10px] font-semibold text-slate-500 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600"
                      >
                        {subject}
                      </span>
                    ))}

                  </div>


                  {/* =================================================
                      PARTICIPANTS
                     ================================================= */}

                  <div className="mt-auto pt-7">

                    <div className="mb-5 flex items-center gap-2 border-t border-slate-100 pt-5">

                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <Users size={15} />
                      </div>

                      <span className="text-xs font-semibold text-slate-500">
                        {competition.participants}
                      </span>

                    </div>


                    {/* CTA */}

                    <div className="flex items-center justify-between">

                      <span className="text-sm font-bold text-blue-600">
                        Explore challenge
                      </span>

                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
                        <ArrowRight
                          size={16}
                          className="transition-transform duration-300 group-hover:translate-x-0.5"
                        />
                      </div>

                    </div>

                  </div>

                </div>

              </Link>
            );
          })}

        </div>


        {/* =======================================================
            BOTTOM COMPETITION STRIP
           ======================================================= */}

        <div className="relative mt-10 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-[#071438] via-[#0b2057] to-[#172d70] px-6 py-7 shadow-xl shadow-blue-900/10 sm:px-8">

          {/* Glow */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-400/20 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 bottom-0 h-40 w-40 rounded-full bg-yellow-400/10 blur-3xl"
          />


          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            {/* Left */}

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-500/20">
                <Trophy
                  size={23}
                  strokeWidth={2.2}
                />
              </div>


              <div>

                <div className="flex flex-wrap items-center gap-2">

                  <h3 className="font-extrabold text-white">
                    Ready for the JAMB League?
                  </h3>

                  <span className="rounded-full bg-emerald-400/15 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                    Free Entry
                  </span>

                </div>

                <p className="mt-1 max-w-xl text-xs leading-5 text-blue-100/70 sm:text-sm">
                  Form your team, choose your challenge and start your journey
                  toward the national championship.
                </p>

              </div>

            </div>


            {/* Right */}

            <Link
              href="/competitions"
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3.5 text-xs font-black text-slate-950 shadow-lg shadow-yellow-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-yellow-300"
            >

              View All Competitions

              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />

            </Link>

          </div>

        </div>


        {/* =======================================================
            MINI STATS
           ======================================================= */}

        <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">

          <div className="rounded-xl border border-slate-200/80 bg-white px-4 py-4 text-center shadow-sm">

            <Zap
              size={17}
              className="mx-auto text-blue-600"
            />

            <p className="mt-2 text-sm font-black text-slate-950">
              Live
            </p>

            <p className="text-[10px] text-slate-500">
              Competition events
            </p>

          </div>


          <div className="rounded-xl border border-slate-200/80 bg-white px-4 py-4 text-center shadow-sm">

            <Users
              size={17}
              className="mx-auto text-indigo-600"
            />

            <p className="mt-2 text-sm font-black text-slate-950">
              10K+
            </p>

            <p className="text-[10px] text-slate-500">
              Students
            </p>

          </div>


          <div className="rounded-xl border border-slate-200/80 bg-white px-4 py-4 text-center shadow-sm">

            <School
              size={17}
              className="mx-auto text-orange-500"
            />

            <p className="mt-2 text-sm font-black text-slate-950">
              500+
            </p>

            <p className="text-[10px] text-slate-500">
              Schools
            </p>

          </div>


          <div className="rounded-xl border border-slate-200/80 bg-white px-4 py-4 text-center shadow-sm">

            <Trophy
              size={17}
              className="mx-auto text-yellow-500"
            />

            <p className="mt-2 text-sm font-black text-slate-950">
              ₦1M+
            </p>

            <p className="text-[10px] text-slate-500">
              Rewards
            </p>

          </div>

        </div>

      </Container>

    </section>
  );
}


// "use client";

// import {
//   BookOpen,
//   Target,
//   School,
//   Swords,
//   ArrowRight,
//   Trophy,
//   Sparkles,
// } from "lucide-react";

// import { cn } from "@/lib/utils";

// import Container from "@/components/layout/Container";

// const competitions = [
//   {
//     number: "01",
//     title: "UTME Challenge",
//     description:
//       "Compete with students nationwide using JAMB-style questions designed to test your readiness and improve your exam performance.",
//     icon: Target,
//     badge: "Popular",
//     label: "National Competition",
//     gradient: "from-blue-500 to-cyan-500",
//     iconBg: "bg-blue-50",
//     iconColor: "text-blue-600",
//     badgeBg: "bg-blue-50",
//     badgeColor: "text-blue-700",
//   },

//   {
//     number: "02",
//     title: "Subject Battles",
//     description:
//       "Challenge other teams in Mathematics, English, Physics, Chemistry, Biology and other UTME subjects.",
//     icon: Swords,
//     badge: "Team Mode",
//     label: "Head-to-Head",
//     gradient: "from-indigo-500 to-violet-500",
//     iconBg: "bg-indigo-50",
//     iconColor: "text-indigo-600",
//     badgeBg: "bg-indigo-50",
//     badgeColor: "text-indigo-700",
//   },

//   {
//     number: "03",
//     title: "Mock Exam League",
//     description:
//       "Take realistic JAMB mock examinations, track your progress and see how your performance compares nationally.",
//     icon: BookOpen,
//     badge: "Practice",
//     label: "Exam Simulation",
//     gradient: "from-violet-500 to-fuchsia-500",
//     iconBg: "bg-violet-50",
//     iconColor: "text-violet-600",
//     badgeBg: "bg-violet-50",
//     badgeColor: "text-violet-700",
//   },

//   {
//     number: "04",
//     title: "School Championship",
//     description:
//       "Represent your school, compete against other institutions and fight for the title of top academic school.",
//     icon: School,
//     badge: "Schools",
//     label: "Institution Battle",
//     gradient: "from-yellow-400 to-amber-500",
//     iconBg: "bg-yellow-50",
//     iconColor: "text-yellow-600",
//     badgeBg: "bg-yellow-50",
//     badgeColor: "text-yellow-700",
//   },
// ];

// export default function CompetitionCategories() {
//   return (
//     <section className="relative overflow-hidden bg-[#f5f8ff] py-20 sm:py-24 lg:py-28">

//       {/* =========================================================
//           BACKGROUND
//          ========================================================= */}

//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl"
//       />

//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute -right-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-indigo-500/10 blur-3xl"
//       />

//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[45rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/5 blur-3xl"
//       />

//       <Container>

//         {/* =========================================================
//             HEADER
//            ========================================================= */}

//         <div className="relative mx-auto mb-14 max-w-3xl text-center">

//           {/* Badge */}

//           <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-700 shadow-sm">

//             <Sparkles
//               size={14}
//               className="text-yellow-500"
//             />

//             Competition Arena

//           </div>


//           {/* Heading */}

//           <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">

//             Choose your

//             <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
//               challenge
//             </span>

//           </h2>


//           {/* Description */}

//           <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base sm:leading-8">
//             From individual preparation to team battles and national
//             championships, choose the competition that matches your ambition.
//           </p>

//         </div>


//         {/* =========================================================
//             COMPETITION CARDS
//            ========================================================= */}

//         <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

//           {competitions.map((competition) => {
//             const Icon = competition.icon;

//             return (
//               <div
//                 key={competition.title}
//                 className="group relative"
//               >

//                 {/* =================================================
//                     CARD
//                    ================================================= */}

//                 <div
//                   className={cn(
//                     "relative h-full overflow-hidden rounded-3xl",
//                     "border border-slate-200/80",
//                     "bg-white",
//                     "p-6 sm:p-7",
//                     "shadow-sm",
//                     "transition-all duration-500",
//                     "hover:-translate-y-2",
//                     "hover:border-blue-200",
//                     "hover:shadow-xl hover:shadow-blue-100/40"
//                   )}
//                 >

//                   {/* Top accent */}

//                   <div
//                     className={cn(
//                       "absolute inset-x-0 top-0 h-1",
//                       "bg-gradient-to-r",
//                       competition.gradient
//                     )}
//                   />


//                   {/* Background number */}

//                   <span
//                     aria-hidden="true"
//                     className="absolute -right-2 -top-6 select-none text-[6rem] font-black leading-none text-slate-50 transition-colors duration-500 group-hover:text-blue-50"
//                   >
//                     {competition.number}
//                   </span>


//                   {/* =================================================
//                       ICON + BADGE
//                      ================================================= */}

//                   <div className="relative mb-7 flex items-start justify-between">

//                     <div
//                       className={cn(
//                         "flex h-14 w-14 items-center justify-center",
//                         "rounded-2xl",
//                         competition.iconBg,
//                         competition.iconColor,
//                         "transition-all duration-500",
//                         "group-hover:scale-110 group-hover:rotate-2"
//                       )}
//                     >
//                       <Icon
//                         size={26}
//                         strokeWidth={2.2}
//                       />
//                     </div>


//                     <span
//                       className={cn(
//                         "rounded-full px-3 py-1.5",
//                         "text-[10px] font-bold uppercase tracking-wide",
//                         competition.badgeBg,
//                         competition.badgeColor
//                       )}
//                     >
//                       {competition.badge}
//                     </span>

//                   </div>


//                   {/* =================================================
//                       LABEL
//                      ================================================= */}

//                   <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
//                     {competition.label}
//                   </p>


//                   {/* =================================================
//                       TITLE
//                      ================================================= */}

//                   <h3 className="text-xl font-extrabold tracking-tight text-slate-950">
//                     {competition.title}
//                   </h3>


//                   {/* =================================================
//                       DESCRIPTION
//                      ================================================= */}

//                   <p className="mt-3 text-sm leading-6 text-slate-500">
//                     {competition.description}
//                   </p>


//                   {/* =================================================
//                       ACTION
//                      ================================================= */}

//                   <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5">

//                     <span className="text-xs font-semibold text-slate-400 transition-colors group-hover:text-blue-600">
//                       Explore challenge
//                     </span>

//                     <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
//                       <ArrowRight
//                         size={15}
//                         className="transition-transform duration-300 group-hover:translate-x-0.5"
//                       />
//                     </div>

//                   </div>

//                 </div>

//               </div>
//             );
//           })}

//         </div>


//         {/* =========================================================
//             BOTTOM FEATURE
//            ========================================================= */}

//         <div className="relative mx-auto mt-12 max-w-4xl">

//           <div className="overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-r from-[#071438] via-[#0b1f55] to-[#172d70] shadow-xl shadow-blue-900/10">

//             {/* Background glow */}

//             <div
//               aria-hidden="true"
//               className="pointer-events-none absolute h-48 w-48 rounded-full bg-blue-500/20 blur-3xl"
//             />

//             <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">

//               {/* Left */}

//               <div className="flex items-start gap-4">

//                 <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-500/20">

//                   <Trophy size={23} />

//                 </div>


//                 <div>

//                   <p className="text-sm font-bold text-white sm:text-base">
//                     Ready for the ultimate challenge?
//                   </p>

//                   <p className="mt-1 max-w-xl text-xs leading-5 text-blue-100/70 sm:text-sm">
//                     Build your team, choose your arena and start your journey
//                     toward the JAMB League championship.
//                   </p>

//                 </div>

//               </div>


//               {/* CTA */}

//               <a
//                 href="/competitions"
//                 className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-yellow-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-yellow-300 sm:px-6 sm:py-3.5"
//               >
//                 View All Competitions

//                 <ArrowRight size={15} />

//               </a>

//             </div>

//           </div>

//         </div>

//       </Container>

//     </section>
//   );
// }