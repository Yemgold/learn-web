 //C:\Users\Lara Spellman\Jamb\jamb-league\src\app\page.tsx


// // C:\Users\Lara Spellman\Jamb\jamb-league\src\app\page.tsx

// import Hero from "@/components/hero/Hero";
// import HowItWorks from "@/components/sections/HowItWorks";
// import CompetitionCategories from "@/components/sections/CompetitionCategories";
// import LeaderboardPreview from "@/components/sections/LeaderboardPreview";
// import PracticePreview from "@/components/sections/PracticePreview";
// import Testimonials from "@/components/sections/Testimonials";

// import CompetitionOverview from "@/components/competition/CompetitionOverview";
// import CompetitionPrize from "@/components/competition/CompetitionPrize";

// export default function HomePage() {
//   return (
//     <main className="min-h-screen overflow-x-hidden bg-white text-slate-900">

//       {/* =========================================================
//           HERO
//           PRIMARY PLATFORM POSITIONING
//          ========================================================= */}
//       <section className="relative overflow-hidden">
//         <div
//           aria-hidden="true"
//           className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"
//         />

//         <div
//           aria-hidden="true"
//           className="pointer-events-none absolute -right-40 top-20 h-[28rem] w-[28rem] rounded-full bg-indigo-500/20 blur-3xl"
//         />

//         <Hero />
//       </section>


//       {/* =========================================================
//           LEARNING PLATFORM
//           IMPORTANT SEO CONTENT
//          ========================================================= */}
//       <section className="relative overflow-hidden bg-white py-20 lg:py-28">
//         <div
//           aria-hidden="true"
//           className="pointer-events-none absolute left-1/2 top-0 h-72 w-[45rem] -translate-x-1/2 rounded-full bg-blue-50 blur-3xl"
//         />

//         <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">

//           {/* Heading */}
//           <div className="mx-auto max-w-3xl text-center">
//             <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-700">
//               Learning Platform
//             </span>

//             <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
//               Learn, practice, prepare and
//               <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
//                 grow your skills
//               </span>
//             </h2>

//             <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
//               JAMB League brings learning, practice, exam preparation,
//               interactive quizzes and competitions together in one learning
//               platform for students and learners.
//             </p>
//           </div>


//           {/* Learning Areas */}
//           <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

//             {/* Exam Preparation */}
//             <article className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
//               <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
//                 📚
//               </div>

//               <h3 className="mt-5 text-lg font-bold text-slate-950">
//                 Exam Preparation
//               </h3>

//               <p className="mt-3 text-sm leading-6 text-slate-500">
//                 Prepare for JAMB, WAEC and other examinations with structured
//                 study materials, practice questions, quizzes and revision.
//               </p>
//             </article>


//             {/* Courses & Skills */}
//             <article className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
//               <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
//                 💡
//               </div>

//               <h3 className="mt-5 text-lg font-bold text-slate-950">
//                 Courses & Skills
//               </h3>

//               <p className="mt-3 text-sm leading-6 text-slate-500">
//                 Learn practical and academic skills through structured online
//                 courses, lessons and guided learning experiences.
//               </p>
//             </article>


//             {/* Practice & Quizzes */}
//             <article className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
//               <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
//                 📝
//               </div>

//               <h3 className="mt-5 text-lg font-bold text-slate-950">
//                 Practice & Quizzes
//               </h3>

//               <p className="mt-3 text-sm leading-6 text-slate-500">
//                 Test your knowledge with practice questions, online quizzes,
//                 CBT-style tests and interactive learning activities.
//               </p>
//             </article>


//             {/* Competitions */}
//             <article className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
//               <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-50 text-2xl">
//                 🏆
//               </div>

//               <h3 className="mt-5 text-lg font-bold text-slate-950">
//                 Competitions
//               </h3>

//               <p className="mt-3 text-sm leading-6 text-slate-500">
//                 Challenge yourself, compete with other learners, improve your
//                 ranking and take part in educational competitions.
//               </p>
//             </article>

//           </div>
//         </div>
//       </section>


//       {/* =========================================================
//           EXAM PREPARATION
//           STRONG JAMB / WAEC SEO SECTION
//          ========================================================= */}
//       <section className="relative overflow-hidden bg-slate-50 py-20 lg:py-28">

//         <div
//           aria-hidden="true"
//           className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-blue-100/70 blur-3xl"
//         />

//         <div
//           aria-hidden="true"
//           className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-indigo-100/60 blur-3xl"
//         />

//         <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">

//           <div className="grid items-center gap-12 lg:grid-cols-2">

//             {/* Text */}
//             <div>
//               <span className="inline-flex items-center rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-700 shadow-sm">
//                 Exam Preparation
//               </span>

//               <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
//                 Prepare for JAMB, WAEC and
//                 <span className="block text-blue-600">
//                   your next examination
//                 </span>
//               </h2>

//               <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
//                 Study important subjects, practise exam questions, take
//                 computer-based tests and identify areas where you need more
//                 practice. JAMB League gives students a structured way to
//                 prepare, practise and measure their progress.
//               </p>

//               <div className="mt-7 flex flex-wrap gap-3">
//                 <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700">
//                   JAMB Preparation
//                 </span>

//                 <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700">
//                   WAEC Preparation
//                 </span>

//                 <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700">
//                   CBT Practice
//                 </span>

//                 <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700">
//                   Practice Questions
//                 </span>

//                 <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700">
//                   Online Quizzes
//                 </span>
//               </div>
//             </div>


//             {/* Subjects */}
//             <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">

//               <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//                 <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
//                   Science
//                 </p>
//                 <h3 className="mt-2 font-bold text-slate-950">
//                   Biology
//                 </h3>
//                 <p className="mt-2 text-xs leading-5 text-slate-500">
//                   Study biology concepts and practise exam questions.
//                 </p>
//               </div>

//               <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//                 <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
//                   Science
//                 </p>
//                 <h3 className="mt-2 font-bold text-slate-950">
//                   Chemistry
//                 </h3>
//                 <p className="mt-2 text-xs leading-5 text-slate-500">
//                   Build understanding through questions and revision.
//                 </p>
//               </div>

//               <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//                 <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
//                   Science
//                 </p>
//                 <h3 className="mt-2 font-bold text-slate-950">
//                   Physics
//                 </h3>
//                 <p className="mt-2 text-xs leading-5 text-slate-500">
//                   Practise calculations, concepts and exam questions.
//                 </p>
//               </div>

//               <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//                 <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
//                   Mathematics
//                 </p>
//                 <h3 className="mt-2 font-bold text-slate-950">
//                   Mathematics
//                 </h3>
//                 <p className="mt-2 text-xs leading-5 text-slate-500">
//                   Improve problem-solving through regular practice.
//                 </p>
//               </div>

//               <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//                 <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
//                   Languages
//                 </p>
//                 <h3 className="mt-2 font-bold text-slate-950">
//                   English
//                 </h3>
//                 <p className="mt-2 text-xs leading-5 text-slate-500">
//                   Practise comprehension, grammar and examination skills.
//                 </p>
//               </div>

//               <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//                 <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
//                   More
//                 </p>
//                 <h3 className="mt-2 font-bold text-slate-950">
//                   More Subjects
//                 </h3>
//                 <p className="mt-2 text-xs leading-5 text-slate-500">
//                   Explore additional subjects and learning opportunities.
//                 </p>
//               </div>

//             </div>
//           </div>
//         </div>
//       </section>


//       {/* =========================================================
//           PRACTICE ENGINE
//          ========================================================= */}
//       <section className="relative overflow-hidden bg-white py-20 lg:py-28">

//         <div
//           aria-hidden="true"
//           className="pointer-events-none absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl"
//         />

//         <div
//           aria-hidden="true"
//           className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full bg-indigo-100/50 blur-3xl"
//         />

//         <div className="relative">
//           <PracticePreview />
//         </div>
//       </section>


//       {/* =========================================================
//           HOW IT WORKS
//          ========================================================= */}
//       <section className="relative overflow-hidden bg-slate-50 py-20 lg:py-24">

//         <div
//           aria-hidden="true"
//           className="pointer-events-none absolute left-1/2 top-0 h-40 w-[32rem] -translate-x-1/2 rounded-full bg-blue-50 blur-3xl"
//         />

//         <HowItWorks />
//       </section>


//       {/* =========================================================
//           LEARNING + PROGRAMMING
//           BROADENS PLATFORM BEYOND EXAM PREPARATION
//          ========================================================= */}
//       <section className="relative overflow-hidden bg-white py-20 lg:py-28">

//         <div
//           aria-hidden="true"
//           className="pointer-events-none absolute left-1/2 top-10 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-indigo-50 blur-3xl"
//         />

//         <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">

//           <div className="mx-auto max-w-3xl text-center">

//             <span className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-indigo-700">
//               Learn New Skills
//             </span>

//             <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
//               Go beyond exam preparation
//             </h2>

//             <p className="mt-5 text-sm leading-7 text-slate-500 sm:text-base">
//               Learning is not only about preparing for examinations. Build
//               practical knowledge and useful skills through structured
//               courses and lessons.
//             </p>

//           </div>


//           <div className="mx-auto mt-12 max-w-5xl rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-8">

//             <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">

//               <div>

//                 <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
//                   Programming
//                 </span>

//                 <h3 className="mt-3 text-2xl font-extrabold text-slate-950 sm:text-3xl">
//                   Learn Go Programming
//                 </h3>

//                 <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
//                   Start learning programming through structured lessons covering
//                   Go fundamentals, project setup, authentication, REST API
//                   development and practical programming concepts.
//                 </p>

//                 <div className="mt-5 flex flex-wrap gap-2">

//                   <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm">
//                     Go Fundamentals
//                   </span>

//                   <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm">
//                     Authentication
//                   </span>

//                   <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm">
//                     REST APIs
//                   </span>

//                   <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm">
//                     Programming Skills
//                   </span>

//                 </div>

//               </div>


//               <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-white text-5xl shadow-sm">
//                 💻
//               </div>

//             </div>

//           </div>
//         </div>
//       </section>


//       {/* =========================================================
//           COMPETITION CATEGORIES
//           NOW AFTER LEARNING / PRACTICE
//          ========================================================= */}
//       <section className="relative overflow-hidden bg-slate-50 py-20 lg:py-24">

//         <div
//           aria-hidden="true"
//           className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl"
//         />

//         <div
//           aria-hidden="true"
//           className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-indigo-100/60 blur-3xl"
//         />

//         <CompetitionCategories />
//       </section>


//       {/* =========================================================
//           FEATURED CHAMPIONSHIP
//          ========================================================= */}
//       <section className="relative overflow-hidden bg-white py-20 lg:py-28">

//         <div
//           aria-hidden="true"
//           className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/50 blur-3xl"
//         />

//         <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">

//           <div className="mx-auto mb-10 max-w-2xl text-center">

//             <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-700">
//               <span className="h-2 w-2 rounded-full bg-yellow-400" />
//               Featured Competition
//             </span>

//             <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
//               Learn, practise and
//               <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
//                 compete with others
//               </span>
//             </h2>

//             <p className="mt-4 text-sm leading-6 text-slate-500 sm:text-base">
//               Put your knowledge to the test through educational competitions,
//               team challenges and leaderboard-based learning experiences.
//             </p>

//           </div>


//           <div className="relative">

//             <div
//               aria-hidden="true"
//               className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-yellow-300/20 blur-3xl"
//             />

//             <CompetitionOverview
//               title="JAMB League 2027 Championship"
//               subject="All UTME Subjects"
//               description="Form a team of three students, compete with schools and teams across Nigeria, improve your UTME preparation, climb the leaderboard, and win amazing prizes."
//               startDate="January 2027"
//               teamsJoined={250}
//               maxTeams={1000}
//               prize="₦1,000,000 Prize Pool"
//               entryFee="Free"
//               joinHref="/auth/register"
//             />

//           </div>
//         </div>
//       </section>


//       {/* =========================================================
//           COMPETITION REWARDS
//          ========================================================= */}
//       <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-[#101b3d] to-[#16245a] py-20 lg:py-28">

//         <div
//           aria-hidden="true"
//           className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl"
//         />

//         <div
//           aria-hidden="true"
//           className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl"
//         />

//         <div
//           aria-hidden="true"
//           className="pointer-events-none absolute left-1/2 top-20 h-56 w-56 -translate-x-1/2 rounded-full bg-yellow-400/10 blur-3xl"
//         />

//         <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">

//           <div className="mx-auto mb-12 max-w-2xl text-center">

//             <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-yellow-300">
//               🏆 Competition Rewards
//             </span>

//             <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
//               Put your knowledge to the test
//               <span className="block text-yellow-300">
//                 and earn recognition
//               </span>
//             </h2>

//             <p className="mt-4 text-sm leading-6 text-slate-300 sm:text-base">
//               Educational competitions give learners an opportunity to test
//               their knowledge, improve their performance and compete with
//               other learners.
//             </p>

//           </div>


//           <CompetitionPrize
//             totalPrize="₦1,000,000"
//             prizes={[
//               {
//                 position: "🥇 First Place",
//                 reward: "₦500,000 Scholarship",
//                 description:
//                   "Scholarship support, medals, certificates and national recognition.",
//               },
//               {
//                 position: "🥈 Second Place",
//                 reward: "₦300,000 Scholarship",
//                 description:
//                   "Scholarship support, medals and certificates.",
//               },
//               {
//                 position: "🥉 Third Place",
//                 reward: "₦200,000 Scholarship",
//                 description:
//                   "Scholarship support and certificates.",
//               },
//             ]}
//           />

//         </div>
//       </section>


//       {/* =========================================================
//           NATIONAL LEADERBOARD
//          ========================================================= */}
//       <section className="relative overflow-hidden bg-white py-20 lg:py-28">

//         <div
//           aria-hidden="true"
//           className="pointer-events-none absolute left-1/2 top-0 h-72 w-[45rem] -translate-x-1/2 rounded-full bg-blue-50 blur-3xl"
//         />

//         <div className="relative">
//           <LeaderboardPreview />
//         </div>

//       </section>


//       {/* =========================================================
//           TESTIMONIALS
//          ========================================================= */}
//       <section className="relative overflow-hidden bg-slate-50 py-20 lg:py-28">

//         <div
//           aria-hidden="true"
//           className="pointer-events-none absolute left-1/2 top-20 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-yellow-50 blur-3xl"
//         />

//         <div className="relative">
//           <Testimonials />
//         </div>

//       </section>


//       {/* =========================================================
//           FINAL CTA
//           GENERAL LEARNING PLATFORM CTA
//          ========================================================= */}
//       <section className="relative isolate overflow-hidden bg-[#071438] py-20 text-white sm:py-24 lg:py-28">

//         {/* Background */}
//         <div
//           aria-hidden="true"
//           className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_30%,rgba(37,99,235,0.38),transparent_32%),radial-gradient(circle_at_85%_20%,rgba(99,102,241,0.35),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(30,64,175,0.35),transparent_45%)]"
//         />

//         <div
//           aria-hidden="true"
//           className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"
//         />

//         <div
//           aria-hidden="true"
//           className="pointer-events-none absolute -right-40 bottom-0 h-[32rem] w-[32rem] rounded-full bg-indigo-500/20 blur-3xl"
//         />

//         <div
//           aria-hidden="true"
//           className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400/10 blur-3xl"
//         />

//         <div
//           aria-hidden="true"
//           className="pointer-events-none absolute inset-0 opacity-[0.045]"
//           style={{
//             backgroundImage:
//               "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
//             backgroundSize: "48px 48px",
//           }}
//         />

//         <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">

//           <div className="mx-auto max-w-4xl text-center">

//             {/* Badge */}
//             <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-100 shadow-lg shadow-blue-950/20 backdrop-blur-md sm:text-sm">

//               <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 text-sm text-slate-950">
//                 ✨
//               </span>

//               <span>Start your learning journey</span>

//               <span className="h-1.5 w-1.5 rounded-full bg-yellow-300" />

//             </div>


//             {/* Heading */}
//             <h2 className="mx-auto mt-6 max-w-4xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">

//               Learn more.

//               <span className="block bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-300 bg-clip-text text-transparent">
//                 Practise more. Achieve more.
//               </span>

//             </h2>


//             {/* Description */}
//             <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-blue-100/80 sm:text-base sm:leading-8">
//               Take courses, build skills, practise questions, prepare for
//               examinations, test your knowledge and compete with other
//               learners on JAMB League.
//             </p>


//             {/* CTA */}
//             <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">

//               <a
//                 href="/auth/register"
//                 className="group inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-7 text-sm font-bold text-slate-950 shadow-xl shadow-yellow-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-yellow-300 hover:shadow-2xl hover:shadow-yellow-400/20 sm:w-auto"
//               >
//                 Start Learning

//                 <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
//                   →
//                 </span>
//               </a>


//               <a
//                 href="/auth/login"
//                 className="inline-flex min-h-13 w-full items-center justify-center rounded-xl border border-white/15 bg-white/10 px-7 text-sm font-semibold text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/15 sm:w-auto"
//               >
//                 Sign In
//               </a>

//             </div>


//             {/* Benefits */}
//             <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

//               <div className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-xs text-blue-100/80 backdrop-blur-sm">
//                 <span className="text-yellow-300">✓</span>
//                 Online learning
//               </div>

//               <div className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-xs text-blue-100/80 backdrop-blur-sm">
//                 <span className="text-yellow-300">✓</span>
//                 Practice questions
//               </div>

//               <div className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-xs text-blue-100/80 backdrop-blur-sm">
//                 <span className="text-yellow-300">✓</span>
//                 Exam preparation
//               </div>

//               <div className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-xs text-blue-100/80 backdrop-blur-sm">
//                 <span className="text-yellow-300">✓</span>
//                 Educational competitions
//               </div>

//             </div>


//             {/* Mini Card */}
//             <div className="mx-auto mt-10 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 shadow-xl shadow-blue-950/20 backdrop-blur-md">

//               <div className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-400/15 text-lg">
//                 🚀
//               </div>

//               <div className="text-left">
//                 <p className="text-xs font-semibold text-white">
//                   Your learning journey starts here
//                 </p>

//                 <p className="mt-0.5 text-[11px] text-blue-100/50">
//                   Learn • Practise • Test • Compete • Grow
//                 </p>
//               </div>

//             </div>

//           </div>

//         </div>
//       </section>

//     </main>
//   );
// }

























// C:\Users\Lara Spellman\Jamb\jamb-league\src\app\page.tsx

import Hero from "@/components/hero/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import CompetitionCategories from "@/components/sections/CompetitionCategories";
import LeaderboardPreview from "@/components/sections/LeaderboardPreview";
import PracticePreview from "@/components/sections/PracticePreview";
import Testimonials from "@/components/sections/Testimonials";

import CompetitionOverview from "@/components/competition/CompetitionOverview";
import CompetitionPrize from "@/components/competition/CompetitionPrize";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-slate-950 text-white">

      {/* =========================================================
          GLOBAL BACKGROUND GLOW
         ========================================================= */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-blue-500/[0.06] blur-3xl" />
      </div>


      {/* =========================================================
          HERO
          PRIMARY PLATFORM POSITIONING
         ========================================================= */}
      <section className="relative overflow-hidden bg-slate-950">

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-20 h-[28rem] w-[28rem] rounded-full bg-indigo-600/10 blur-3xl"
        />

        <Hero />
      </section>


      {/* =========================================================
          LEARNING PLATFORM
          IMPORTANT SEO CONTENT
         ========================================================= */}
      <section className="relative overflow-hidden bg-slate-950 py-20 lg:py-28">

        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-72 w-[45rem] -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl"
        />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">

          {/* Heading */}
          <div className="mx-auto max-w-3xl text-center">

            <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-300">
              Learning Platform
            </span>

            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Learn, practice, prepare and
              <span className="block bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-300 bg-clip-text text-transparent">
                grow your skills
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              JAMB League brings learning, practice, exam preparation,
              interactive quizzes and competitions together in one learning
              platform for students and learners.
            </p>
          </div>


          {/* Learning Areas */}
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

            {/* Exam Preparation */}
            <article className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:bg-white/[0.06]">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-2xl">
                📚
              </div>

              <h3 className="mt-5 text-lg font-bold text-white">
                Exam Preparation
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Prepare for JAMB, WAEC and other examinations with structured
                study materials, practice questions, quizzes and revision.
              </p>
            </article>


            {/* Courses & Skills */}
            <article className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/30 hover:bg-white/[0.06]">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 text-2xl">
                💡
              </div>

              <h3 className="mt-5 text-lg font-bold text-white">
                Courses & Skills
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Learn practical and academic skills through structured online
                courses, lessons and guided learning experiences.
              </p>
            </article>


            {/* Practice & Quizzes */}
            <article className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:bg-white/[0.06]">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-2xl">
                📝
              </div>

              <h3 className="mt-5 text-lg font-bold text-white">
                Practice & Quizzes
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Test your knowledge with practice questions, online quizzes,
                CBT-style tests and interactive learning activities.
              </p>
            </article>


            {/* Competitions */}
            <article className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-yellow-500/30 hover:bg-white/[0.06]">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-yellow-500/20 bg-yellow-500/10 text-2xl">
                🏆
              </div>

              <h3 className="mt-5 text-lg font-bold text-white">
                Competitions
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Challenge yourself, compete with other learners, improve your
                ranking and take part in educational competitions.
              </p>
            </article>

          </div>
        </div>
      </section>


      {/* =========================================================
          EXAM PREPARATION
          STRONG JAMB / WAEC SEO SECTION
         ========================================================= */}
      <section className="relative overflow-hidden bg-slate-950 py-20 lg:py-28">

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl"
        />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid items-center gap-12 lg:grid-cols-2">

            {/* Text */}
            <div>

              <span className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-300">
                Exam Preparation
              </span>

              <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Prepare for JAMB, WAEC and
                <span className="block text-blue-400">
                  your next examination
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                Study important subjects, practise exam questions, take
                computer-based tests and identify areas where you need more
                practice. JAMB League gives students a structured way to
                prepare, practise and measure their progress.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">

                <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-slate-300">
                  JAMB Preparation
                </span>

                <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-slate-300">
                  WAEC Preparation
                </span>

                <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-slate-300">
                  CBT Practice
                </span>

                <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-slate-300">
                  Practice Questions
                </span>

                <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-slate-300">
                  Online Quizzes
                </span>

              </div>
            </div>


            {/* Subjects */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-none">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-400">
                  Science
                </p>

                <h3 className="mt-2 font-bold text-white">
                  Biology
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Study biology concepts and practise exam questions.
                </p>
              </div>


              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-none">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-400">
                  Science
                </p>

                <h3 className="mt-2 font-bold text-white">
                  Chemistry
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Build understanding through questions and revision.
                </p>
              </div>


              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-none">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-400">
                  Science
                </p>

                <h3 className="mt-2 font-bold text-white">
                  Physics
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Practise calculations, concepts and exam questions.
                </p>
              </div>


              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-none">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-400">
                  Mathematics
                </p>

                <h3 className="mt-2 font-bold text-white">
                  Mathematics
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Improve problem-solving through regular practice.
                </p>
              </div>


              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-none">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-400">
                  Languages
                </p>

                <h3 className="mt-2 font-bold text-white">
                  English
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Practise comprehension, grammar and examination skills.
                </p>
              </div>


              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-none">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-400">
                  More
                </p>

                <h3 className="mt-2 font-bold text-white">
                  More Subjects
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Explore additional subjects and learning opportunities.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>


      {/* =========================================================
          PRACTICE ENGINE
         ========================================================= */}
      <section className="relative overflow-hidden bg-slate-950 py-20 lg:py-28">

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl"
        />

        <div className="relative">
          <PracticePreview />
        </div>

      </section>


      {/* =========================================================
          HOW IT WORKS
         ========================================================= */}
      <section className="relative overflow-hidden bg-slate-950 py-20 lg:py-24">

        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-40 w-[32rem] -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl"
        />

        <div className="relative">
          <HowItWorks />
        </div>

      </section>


      {/* =========================================================
          LEARNING + PROGRAMMING
          BROADENS PLATFORM BEYOND EXAM PREPARATION
         ========================================================= */}
      <section className="relative overflow-hidden bg-slate-950 py-20 lg:py-28">

        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-10 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-3xl"
        />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-3xl text-center">

            <span className="inline-flex items-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-indigo-300">
              Learn New Skills
            </span>

            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Go beyond exam preparation
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base">
              Learning is not only about preparing for examinations. Build
              practical knowledge and useful skills through structured
              courses and lessons.
            </p>

          </div>


          <div className="mx-auto mt-12 max-w-5xl rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-none sm:p-8">

            <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">

              <div>

                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Programming
                </span>

                <h3 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
                  Learn Go Programming
                </h3>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
                  Start learning programming through structured lessons
                  covering Go fundamentals, project setup, authentication,
                  REST API development and practical programming concepts.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">

                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-300">
                    Go Fundamentals
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-300">
                    Authentication
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-300">
                    REST APIs
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-300">
                    Programming Skills
                  </span>

                </div>

              </div>


              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border border-white/10 bg-blue-500/10 text-5xl">
                💻
              </div>

            </div>

          </div>
        </div>
      </section>


      {/* =========================================================
          COMPETITION CATEGORIES
          NOW AFTER LEARNING / PRACTICE
         ========================================================= */}
      <section className="relative overflow-hidden bg-slate-950 py-20 lg:py-24">

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-indigo-600/10 blur-3xl"
        />

        <div className="relative">
          <CompetitionCategories />
        </div>

      </section>


      {/* =========================================================
          FEATURED CHAMPIONSHIP
         ========================================================= */}
      <section className="relative overflow-hidden bg-slate-950 py-20 lg:py-28">

        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-3xl"
        />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mx-auto mb-10 max-w-2xl text-center">

            <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-300">

              <span className="h-2 w-2 rounded-full bg-yellow-400" />

              Featured Competition

            </span>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">

              Learn, practise and

              <span className="block bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-300 bg-clip-text text-transparent">
                compete with others
              </span>

            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-400 sm:text-base">
              Put your knowledge to the test through educational competitions,
              team challenges and leaderboard-based learning experiences.
            </p>

          </div>


          <div className="relative">

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-yellow-400/10 blur-3xl"
            />

            <CompetitionOverview
              title="JAMB League 2027 Championship"
              subject="All UTME Subjects"
              description="Form a team of three students, compete with schools and teams across Nigeria, improve your UTME preparation, climb the leaderboard, and win amazing prizes."
              startDate="January 2027"
              teamsJoined={250}
              maxTeams={1000}
              prize="₦1,000,000 Prize Pool"
              entryFee="Free"
              joinHref="/auth/register"
            />

          </div>
        </div>
      </section>


      {/* =========================================================
          COMPETITION REWARDS
         ========================================================= */}
      <section className="relative overflow-hidden bg-slate-950 py-20 lg:py-28">

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-20 h-56 w-56 -translate-x-1/2 rounded-full bg-yellow-400/10 blur-3xl"
        />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mx-auto mb-12 max-w-2xl text-center">

            <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-yellow-300">
              🏆 Competition Rewards
            </span>

            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Put your knowledge to the test

              <span className="block text-yellow-300">
                and earn recognition
              </span>
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-300 sm:text-base">
              Educational competitions give learners an opportunity to test
              their knowledge, improve their performance and compete with
              other learners.
            </p>

          </div>


          <CompetitionPrize
            totalPrize="₦1,000,000"
            prizes={[
              {
                position: "🥇 First Place",
                reward: "₦500,000 Scholarship",
                description:
                  "Scholarship support, medals, certificates and national recognition.",
              },
              {
                position: "🥈 Second Place",
                reward: "₦300,000 Scholarship",
                description:
                  "Scholarship support, medals and certificates.",
              },
              {
                position: "🥉 Third Place",
                reward: "₦200,000 Scholarship",
                description:
                  "Scholarship support and certificates.",
              },
            ]}
          />

        </div>
      </section>


      {/* =========================================================
          NATIONAL LEADERBOARD
         ========================================================= */}
      <section className="relative overflow-hidden bg-slate-950 py-20 lg:py-28">

        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-72 w-[45rem] -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl"
        />

        <div className="relative">
          <LeaderboardPreview />
        </div>

      </section>


      {/* =========================================================
          TESTIMONIALS
         ========================================================= */}
      <section className="relative overflow-hidden bg-slate-950 py-20 lg:py-28">

        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-20 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-yellow-400/[0.06] blur-3xl"
        />

        <div className="relative">
          <Testimonials />
        </div>

      </section>


      {/* =========================================================
          FINAL CTA
          GENERAL LEARNING PLATFORM CTA
         ========================================================= */}
      <section className="relative isolate overflow-hidden bg-slate-950 py-20 text-white sm:py-24 lg:py-28">

        {/* Background */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_30%,rgba(37,99,235,0.20),transparent_32%),radial-gradient(circle_at_85%_20%,rgba(99,102,241,0.18),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(30,64,175,0.20),transparent_45%)]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 bottom-0 h-[32rem] w-[32rem] rounded-full bg-indigo-500/10 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400/[0.06] blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-4xl text-center">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-200 backdrop-blur-md sm:text-sm">

              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 text-sm text-slate-950">
                ✨
              </span>

              <span>Start your learning journey</span>

              <span className="h-1.5 w-1.5 rounded-full bg-yellow-300" />

            </div>


            {/* Heading */}
            <h2 className="mx-auto mt-6 max-w-4xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">

              Learn more.

              <span className="block bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-300 bg-clip-text text-transparent">
                Practise more. Achieve more.
              </span>

            </h2>


            {/* Description */}
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-blue-100/70 sm:text-base sm:leading-8">
              Take courses, build skills, practise questions, prepare for
              examinations, test your knowledge and compete with other
              learners on JAMB League.
            </p>


            {/* CTA */}
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">

              <a
                href="/auth/register"
                className="group inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-7 text-sm font-bold text-slate-950 shadow-xl shadow-yellow-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-yellow-300 hover:shadow-2xl hover:shadow-yellow-400/20 sm:w-auto"
              >
                Start Learning

                <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>


              <a
                href="/auth/login"
                className="inline-flex min-h-13 w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-7 text-sm font-semibold text-white shadow-none backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.08] sm:w-auto"
              >
                Sign In
              </a>

            </div>


            {/* Benefits */}
            <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

              <div className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-xs text-blue-100/70 backdrop-blur-sm">
                <span className="text-yellow-300">✓</span>
                Online learning
              </div>

              <div className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-xs text-blue-100/70 backdrop-blur-sm">
                <span className="text-yellow-300">✓</span>
                Practice questions
              </div>

              <div className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-xs text-blue-100/70 backdrop-blur-sm">
                <span className="text-yellow-300">✓</span>
                Exam preparation
              </div>

              <div className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-xs text-blue-100/70 backdrop-blur-sm">
                <span className="text-yellow-300">✓</span>
                Educational competitions
              </div>

            </div>


            {/* Mini Card */}
            <div className="mx-auto mt-10 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 shadow-none backdrop-blur-md">

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-400/15 text-lg">
                🚀
              </div>

              <div className="text-left">

                <p className="text-xs font-semibold text-white">
                  Your learning journey starts here
                </p>

                <p className="mt-0.5 text-[11px] text-blue-100/50">
                  Learn • Practise • Test • Compete • Grow
                </p>

              </div>

            </div>

          </div>

        </div>
      </section>

    </main>
  );
}