

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
    <main className="min-h-screen overflow-x-hidden bg-white text-slate-900">

      {/* =========================================================
          HERO
         ========================================================= */}
      <section className="relative overflow-hidden">
        {/* Ambient background glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-20 h-[28rem] w-[28rem] rounded-full bg-indigo-500/20 blur-3xl"
        />

        <Hero />
      </section>


      {/* =========================================================
          HOW IT WORKS
         ========================================================= */}
      <section className="relative bg-white py-20 lg:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-40 w-[32rem] -translate-x-1/2 rounded-full bg-blue-50 blur-3xl"
        />

        <HowItWorks />
      </section>


      {/* =========================================================
          COMPETITION CATEGORIES
         ========================================================= */}
      <section className="relative overflow-hidden bg-slate-50 py-20 lg:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-indigo-100/60 blur-3xl"
        />

        <CompetitionCategories />
      </section>


      {/* =========================================================
          FEATURED CHAMPIONSHIP
         ========================================================= */}
      <section className="relative overflow-hidden bg-white py-20 lg:py-28">
        {/* Decorative glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/50 blur-3xl"
        />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section heading */}
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-700">
              <span className="h-2 w-2 rounded-full bg-yellow-400" />
              Featured Competition
            </span>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              The JAMB League
              <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
                2027 Championship
              </span>
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-500 sm:text-base">
              Prepare for UTME while competing with students and schools
              across Nigeria for scholarships, recognition and amazing rewards.
            </p>
          </div>

          {/* Competition card */}
          <div className="relative">
            {/* Gold accent glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-yellow-300/20 blur-3xl"
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
              joinHref="/competitions/2027/auth/register"
            />
          </div>
        </div>
      </section>


      {/* =========================================================
          PRIZES
         ========================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-[#101b3d] to-[#16245a] py-20 lg:py-28">
        {/* Background lights */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl"
        />

        {/* Gold glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-20 h-56 w-56 -translate-x-1/2 rounded-full bg-yellow-400/10 blur-3xl"
        />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">

          {/* Heading */}
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-yellow-300">
              🏆 Competition Rewards
            </span>

            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Compete for more than
              <span className="block text-yellow-300">
                ₦1,000,000 in rewards
              </span>
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-300 sm:text-base">
              Your performance can earn your team scholarships, medals,
              certificates and national recognition.
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
      <section className="relative overflow-hidden bg-white py-20 lg:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-72 w-[45rem] -translate-x-1/2 rounded-full bg-blue-50 blur-3xl"
        />

        <div className="relative">
          <LeaderboardPreview />
        </div>
      </section>


      {/* =========================================================
          PRACTICE ENGINE
         ========================================================= */}
      <section className="relative overflow-hidden bg-slate-50 py-20 lg:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full bg-indigo-100/50 blur-3xl"
        />

        <div className="relative">
          <PracticePreview />
        </div>
      </section>


      {/* =========================================================
          TESTIMONIALS
         ========================================================= */}
      <section className="relative overflow-hidden bg-white py-20 lg:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-20 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-yellow-50 blur-3xl"
        />

        <div className="relative">
          <Testimonials />
        </div>
      </section>


      

     {/* =========================================================
    FINAL CALL TO ACTION
   ========================================================= */}
<section className="relative isolate overflow-hidden bg-[#071438] py-20 text-white sm:py-24 lg:py-28">

  {/* =========================================================
      BACKGROUND EFFECTS
     ========================================================= */}

  {/* Main blue gradient */}
  <div
    aria-hidden="true"
    className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_30%,rgba(37,99,235,0.38),transparent_32%),radial-gradient(circle_at_85%_20%,rgba(99,102,241,0.35),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(30,64,175,0.35),transparent_45%)]"
  />

  {/* Left blue glow */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"
  />

  {/* Right indigo glow */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute -right-40 bottom-0 h-[32rem] w-[32rem] rounded-full bg-indigo-500/20 blur-3xl"
  />

  {/* Center gold glow */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400/10 blur-3xl"
  />

  {/* Decorative grid */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 opacity-[0.045]"
    style={{
      backgroundImage:
        "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
      backgroundSize: "48px 48px",
    }}
  />

  {/* Decorative circles */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full border border-white/10"
  />

  <div
    aria-hidden="true"
    className="pointer-events-none absolute -right-28 -bottom-28 h-96 w-96 rounded-full border border-white/10"
  />

  <div
    aria-hidden="true"
    className="pointer-events-none absolute left-1/2 top-10 h-px w-40 -translate-x-1/2 bg-gradient-to-r from-transparent via-yellow-300/50 to-transparent"
  />

  {/* =========================================================
      CONTENT
     ========================================================= */}

  <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">

    <div className="mx-auto max-w-4xl text-center">

      {/* Badge */}
      <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-100 shadow-lg shadow-blue-950/20 backdrop-blur-md sm:text-sm">

        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 text-sm text-slate-950">
          🏆
        </span>

        <span>Your journey starts here</span>

        <span className="h-1.5 w-1.5 rounded-full bg-yellow-300" />
      </div>


      {/* Heading */}
      <h2 className="mx-auto mt-6 max-w-4xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">

        Ready to prepare,

        <span className="block bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-300 bg-clip-text text-transparent">
          compete and become a champion?
        </span>

      </h2>


      {/* Description */}
      <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-blue-100/80 sm:text-base sm:leading-8">
        Join thousands of students preparing for JAMB, compete with students
        across Nigeria, climb the national leaderboard and take your place
        among the best.
      </p>


      {/* =====================================================
          CTA BUTTONS
         ===================================================== */}

      <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">

        {/* Primary CTA */}
        <a
          href="/competitions/2027/auth/register"
          className="group inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-7 text-sm font-bold text-slate-950 shadow-xl shadow-yellow-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-yellow-300 hover:shadow-2xl hover:shadow-yellow-400/20 sm:w-auto"
        >
          Join the Competition

          <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </a>


        {/* Secondary CTA */}
        <a
          href="/practice"
          className="inline-flex min-h-13 w-full items-center justify-center rounded-xl border border-white/15 bg-white/10 px-7 text-sm font-semibold text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/15 sm:w-auto"
        >
          Start Practicing
        </a>

      </div>


      {/* =====================================================
          BENEFITS
         ===================================================== */}

      <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

        {/* Benefit 1 */}
        <div className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-xs text-blue-100/80 backdrop-blur-sm">
          <span className="text-yellow-300">✓</span>
          Free competition entry
        </div>


        {/* Benefit 2 */}
        <div className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-xs text-blue-100/80 backdrop-blur-sm">
          <span className="text-yellow-300">✓</span>
          Team-based challenges
        </div>


        {/* Benefit 3 */}
        <div className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-xs text-blue-100/80 backdrop-blur-sm">
          <span className="text-yellow-300">✓</span>
          National leaderboard
        </div>


        {/* Benefit 4 */}
        <div className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-xs text-blue-100/80 backdrop-blur-sm">
          <span className="text-yellow-300">✓</span>
          Scholarships & recognition
        </div>

      </div>

      {/* =====================================================
          MINI ACHIEVEMENT CARD
         ===================================================== */}

      <div className="mx-auto mt-10 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 shadow-xl shadow-blue-950/20 backdrop-blur-md">

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-400/15 text-lg">
          🥇
        </div>

        <div className="text-left">
          <p className="text-xs font-semibold text-white">
            Your next achievement starts here
          </p>

          <p className="mt-0.5 text-[11px] text-blue-100/50">
            Prepare • Compete • Rise • Champion
          </p>
        </div>

      </div>

    </div>

  </div>

</section>
      
    </main>
  );
}