

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  GraduationCap,
  Menu,
  Smartphone,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";

import HowItWorks from "@/components/sections/HowItWorks";
import CompetitionCategories from "@/components/sections/CompetitionCategories";
import LeaderboardPreview from "@/components/sections/LeaderboardPreview";
import PracticePreview from "@/components/sections/PracticePreview";
import Testimonials from "@/components/sections/Testimonials";
import CompetitionOverview from "@/components/competition/CompetitionOverview";
import CompetitionPrize from "@/components/competition/CompetitionPrize";

const brandLetters = "LEARNYFI".split("");

const learningFeatures = [
  {
    icon: BookOpen,
    title: "Exam preparation",
    description:
      "Prepare for JAMB, WAEC and other examinations with focused revision and practice.",
    tone: "blue",
  },
  {
    icon: Brain,
    title: "Practice and quizzes",
    description:
      "Build confidence with interactive questions, CBT-style practice and feedback.",
    tone: "violet",
  },
  {
    icon: Trophy,
    title: "Competitions",
    description:
      "Challenge yourself, improve your performance and follow your leaderboard progress.",
    tone: "amber",
  },
  {
    icon: GraduationCap,
    title: "Courses and skills",
    description:
      "Explore structured lessons and learn useful academic and practical skills.",
    tone: "emerald",
  },
];

export default function HomePage() {
  const [introVisible, setIntroVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const introKey = "learnyfi-brand-intro-seen";

    try {
      if (window.sessionStorage.getItem(introKey) === "1") {
        setIntroVisible(false);
        return;
      }
    } catch {
      // The intro can still run when browser storage is unavailable.
    }

    const timer = window.setTimeout(() => {
      setIntroVisible(false);

      try {
        window.sessionStorage.setItem(introKey, "1");
      } catch {
        // Ignore storage restrictions; the page remains usable.
      }
    }, 2600);

    return () => window.clearTimeout(timer);
  }, []);

  const skipIntro = () => {
    setIntroVisible(false);

    try {
      window.sessionStorage.setItem("learnyfi-brand-intro-seen", "1");
    } catch {
      // Skipping the animation does not depend on storage.
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050816] text-white selection:bg-cyan-300 selection:text-slate-950">
      {/* Cinematic brand intro */}
      {introVisible && (
        <div
          className="brand-intro fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-[#030611]"
          role="status"
          aria-label="Learnyfi brand animation"
        >
          <div className="intro-orb intro-orb-one" />
          <div className="intro-orb intro-orb-two" />
          <div className="intro-grid" />

          <div className="relative z-10 px-5 text-center">
            <div className="mb-6 flex items-center justify-center gap-1 sm:gap-2">
              {brandLetters.map((letter, index) => (
                <span
                  key={`${letter}-${index}`}
                  className="brand-letter"
                  style={{ animationDelay: `${index * 85}ms` }}
                >
                  {letter}
                </span>
              ))}
            </div>

            <div className="intro-subtitle mx-auto flex items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.34em] text-cyan-100/65 sm:text-xs sm:tracking-[0.48em]">
              <span className="h-px w-8 bg-cyan-300/50 sm:w-12" />
              Learn · Practise · Achieve
              <span className="h-px w-8 bg-cyan-300/50 sm:w-12" />
            </div>
          </div>

          <button
            type="button"
            onClick={skipIntro}
            className="absolute bottom-7 right-6 z-20 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            Skip intro <span aria-hidden="true">→</span>
          </button>
        </div>
      )}

      {/* Navigation */}
      <header className="relative z-30 border-b border-white/[0.08] bg-[#050816]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-3" aria-label="Learnyfi home">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 via-blue-500 to-indigo-600 text-lg font-black text-white shadow-lg shadow-blue-500/20 transition group-hover:rotate-3">
              L
            </span>
            <span className="text-xl font-black tracking-tight sm:text-2xl">
              LEARNY<span className="text-cyan-300">FI</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
            <a href="#features" className="text-sm font-medium text-slate-300 transition hover:text-white">Platform</a>
            <a href="#practice" className="text-sm font-medium text-slate-300 transition hover:text-white">Practice</a>
            <a href="#competitions" className="text-sm font-medium text-slate-300 transition hover:text-white">Competitions</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-300 transition hover:text-white">How it works</a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/auth/login"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/[0.06] hover:text-white"
            >
              Sign in
            </Link>
            <Link
              href="/auth/register"
              className="group inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/10 transition hover:-translate-y-0.5 hover:bg-cyan-200"
            >
              Get started <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white md:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-white/10 px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
              {[
                ["Platform", "#features"],
                ["Practice", "#practice"],
                ["Competitions", "#competitions"],
                ["How it works", "#how-it-works"],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm font-medium text-slate-300 hover:bg-white/[0.06] hover:text-white"
                >
                  {label}
                </a>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link href="/auth/login" className="rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-semibold">Sign in</Link>
                <Link href="/auth/register" className="rounded-xl bg-cyan-300 px-4 py-3 text-center text-sm font-bold text-slate-950">Get started</Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="hero-surface relative isolate overflow-hidden">
        <div className="hero-glow hero-glow-left" aria-hidden="true" />
        <div className="hero-glow hero-glow-right" aria-hidden="true" />
        <div className="hero-stars" aria-hidden="true" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8 lg:px-8 lg:pb-28 lg:pt-24">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/15 bg-cyan-200/[0.07] px-4 py-2 text-xs font-semibold text-cyan-100 sm:text-sm">
              <Sparkles className="h-4 w-4 text-cyan-300" />
              One platform. More ways to grow.
            </div>

            <h1 className="mt-7 text-4xl font-black leading-[1.08] tracking-[-0.045em] sm:text-5xl md:text-6xl lg:text-[4.25rem]">
              Your next level
              <span className="mt-2 block bg-gradient-to-r from-cyan-200 via-blue-300 to-violet-300 bg-clip-text pb-2 text-transparent">
                starts with learning.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              Prepare for exams, practise with confidence, learn new skills and
              take on educational competitions — all in one place with Learnyfi.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/auth/register"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-cyan-300 px-7 text-sm font-extrabold text-slate-950 shadow-xl shadow-cyan-500/15 transition hover:-translate-y-1 hover:bg-cyan-200"
              >
                Start learning for free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.04] px-7 text-sm font-bold text-white transition hover:border-white/25 hover:bg-white/[0.08]"
              >
                I already have an account
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-xs font-medium text-slate-400 sm:text-sm">
              {["Exam practice", "Learning tools", "Competitions"].map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* CSS-built mobile app mockup */}
          <div className="relative mx-auto w-full max-w-[480px] lg:mr-0 lg:ml-auto">
            <div className="phone-halo" aria-hidden="true" />
            <div className="float-card float-card-top">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-300/15 text-lg">🏆</span>
              <span>
                <span className="block text-xs font-bold text-white">Keep moving up</span>
                <span className="mt-1 block text-[10px] text-slate-400">Every practice counts</span>
              </span>
            </div>

            <div className="phone-frame">
              <div className="phone-screen">
                <div className="phone-notch" />
                <div className="flex items-center justify-between pt-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-blue-600 text-xs font-black text-white">L</div>
                    <div>
                      <p className="text-[11px] font-extrabold tracking-tight text-white">LEARNYFI</p>
                      <p className="text-[8px] text-slate-400">Your learning space</p>
                    </div>
                  </div>
                  <div className="h-8 w-8 rounded-full border border-white/10 bg-white/[0.06] p-1">
                    <div className="h-full w-full rounded-full bg-gradient-to-br from-violet-300 to-cyan-300" />
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-cyan-300/15 bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-cyan-300/[0.06] p-4">
                  <p className="text-[9px] font-semibold text-cyan-200">YOUR LEARNING JOURNEY</p>
                  <h3 className="mt-2 text-lg font-extrabold leading-tight text-white">Small steps.<br />Big achievements.</h3>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-[9px] text-slate-400">Weekly progress</p>
                      <p className="mt-1 text-xl font-black text-white">78<span className="text-xs text-slate-400">%</span></p>
                    </div>
                    <div className="flex h-12 items-end gap-1">
                      {[25, 40, 32, 58, 45, 76, 62].map((height, index) => (
                        <span key={index} className="w-2 rounded-t-sm bg-gradient-to-t from-blue-600 to-cyan-300" style={{ height: `${height}%` }} />
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-blue-500 to-cyan-300" />
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <p className="text-xs font-bold text-white">Explore learning</p>
                  <span className="text-[9px] font-semibold text-cyan-300">View all</span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-400/15 text-sm">📚</div>
                    <p className="mt-3 text-[10px] font-bold text-white">CBT Practice</p>
                    <p className="mt-1 text-[8px] leading-4 text-slate-400">Build exam confidence</p>
                  </div>
                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-300/15 text-sm">🏅</div>
                    <p className="mt-3 text-[10px] font-bold text-white">Challenges</p>
                    <p className="mt-1 text-[8px] leading-4 text-slate-400">Test your knowledge</p>
                  </div>
                </div>

                <div className="mt-3 rounded-xl border border-white/[0.08] bg-white/[0.035] p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-white">Continue learning</p>
                    <span className="text-[8px] text-cyan-300">65% complete</span>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400/15 text-sm">🧠</div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[9px] font-semibold text-slate-200">JAMB Mathematics</p>
                      <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-[65%] rounded-full bg-violet-300" />
                      </div>
                    </div>
                    <ArrowRight className="h-3 w-3 text-slate-400" />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-4 gap-1 border-t border-white/[0.08] pt-3 text-center">
                  {["Home", "Practice", "Games", "Profile"].map((label, index) => (
                    <div key={label} className={`rounded-lg py-1 text-[8px] ${index === 0 ? "bg-cyan-300/10 font-bold text-cyan-200" : "text-slate-500"}`}>
                      <div className="mb-1 text-[11px]">{["⌂", "▤", "✦", "◉"][index]}</div>
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="float-card float-card-bottom">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-300/15 text-lg">✓</span>
              <span>
                <span className="block text-xs font-bold text-white">Progress you can see</span>
                <span className="mt-1 block text-[10px] text-slate-400">Learn at your own pace</span>
              </span>
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/[0.08] bg-white/[0.015]">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 sm:px-6 md:grid-cols-4 lg:px-8">
            {[
              ["01", "Learn", "Build understanding"],
              ["02", "Practise", "Strengthen your skills"],
              ["03", "Test", "Measure your progress"],
              ["04", "Compete", "Challenge yourself"],
            ].map(([number, title, description]) => (
              <div key={number} className="flex items-center gap-3">
                <span className="text-xs font-black tracking-wider text-cyan-300">{number}</span>
                <span>
                  <span className="block text-sm font-bold text-white">{title}</span>
                  <span className="mt-1 block text-[10px] text-slate-500 sm:text-xs">{description}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform features */}
      <section id="features" className="relative py-20 sm:py-24 lg:py-28">
        <div className="absolute inset-x-0 top-0 -z-10 h-96 bg-gradient-to-b from-blue-500/[0.06] to-transparent" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-300/15 bg-blue-300/[0.06] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-cyan-200">
              Made for your next step
            </span>
            <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Everything you need to <span className="text-cyan-300">keep growing.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              A connected learning experience for exam preparation, skills development,
              daily practice and educational competition.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {learningFeatures.map((feature) => {
              const Icon = feature.icon;
              const toneClasses: Record<string, string> = {
                blue: "border-blue-300/15 bg-blue-300/10 text-blue-200 group-hover:border-blue-300/30",
                violet: "border-violet-300/15 bg-violet-300/10 text-violet-200 group-hover:border-violet-300/30",
                amber: "border-amber-300/15 bg-amber-300/10 text-amber-200 group-hover:border-amber-300/30",
                emerald: "border-emerald-300/15 bg-emerald-300/10 text-emerald-200 group-hover:border-emerald-300/30",
              };
              return (
                <article key={feature.title} className="group rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.045] sm:p-7">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition ${toneClasses[feature.tone]}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-white">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{feature.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Practice */}
      <section id="practice" className="relative overflow-hidden border-y border-white/[0.06] bg-[#080d20] py-20 sm:py-24">
        <div className="absolute -left-40 top-10 h-80 w-80 rounded-full bg-blue-500/[0.08] blur-3xl" aria-hidden="true" />
        <div className="relative">
          <PracticePreview />
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative py-20 sm:py-24">
        <div className="absolute left-1/2 top-0 -z-10 h-64 w-[min(90%,48rem)] -translate-x-1/2 rounded-full bg-indigo-500/[0.07] blur-3xl" aria-hidden="true" />
        <HowItWorks />
      </section>

      {/* Competitions */}
      <section id="competitions" className="relative overflow-hidden border-y border-white/[0.06] bg-[#080d20] py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/15 bg-amber-300/[0.06] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-amber-200">
              <Trophy className="h-4 w-4" /> Learn by challenging yourself
            </span>
            <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
              Turn your knowledge into <span className="text-amber-200">momentum.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              Join educational challenges, practise with purpose and track your progress
              alongside other learners.
            </p>
          </div>

          <CompetitionCategories />

          <div className="mt-16">
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

          <div className="mt-16">
            <CompetitionPrize
              totalPrize="₦1,000,000"
              prizes={[
                {
                  position: "🥇 First Place",
                  reward: "₦500,000 Scholarship",
                  description: "Scholarship support, medals, certificates and national recognition.",
                },
                {
                  position: "🥈 Second Place",
                  reward: "₦300,000 Scholarship",
                  description: "Scholarship support, medals and certificates.",
                },
                {
                  position: "🥉 Third Place",
                  reward: "₦200,000 Scholarship",
                  description: "Scholarship support and certificates.",
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Leaderboard and testimonials */}
      <section className="py-20 sm:py-24">
        <LeaderboardPreview />
      </section>

      <section className="border-t border-white/[0.06] bg-[#080d20] py-20 sm:py-24">
        <Testimonials />
      </section>

      {/* Final CTA and footer */}
      <section className="relative isolate overflow-hidden border-t border-white/[0.08] py-20 sm:py-24 lg:py-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.18),transparent_35%),radial-gradient(circle_at_80%_70%,rgba(6,182,212,0.12),transparent_35%)]" />
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-200/20 bg-cyan-200/10">
            <Smartphone className="h-7 w-7 text-cyan-200" />
          </div>
          <h2 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Your learning journey <span className="text-cyan-300">starts here.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            Make time for practice, build new skills and take the next step towards your goals with Learnyfi.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/auth/register" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-7 text-sm font-extrabold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200">
              Create your account <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/auth/login" className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.04] px-7 text-sm font-bold text-white transition hover:bg-white/[0.08]">
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.08] bg-[#030611]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-7 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <Link href="/" className="text-lg font-black tracking-tight">
            LEARNY<span className="text-cyan-300">FI</span>
          </Link>
          <p className="text-xs leading-5 text-slate-500">
            Learn · Practise · Test · Compete · Grow
          </p>
          <div className="flex gap-5 text-xs font-semibold text-slate-400">
            <Link href="/auth/login" className="transition hover:text-white">Sign in</Link>
            <Link href="/auth/register" className="transition hover:text-white">Create account</Link>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
          scroll-padding-top: 5rem;
        }

        .brand-intro {
          animation: intro-background 2.6s ease both;
        }

        .intro-grid {
          position: absolute;
          inset: 0;
          opacity: 0.15;
          background-image:
            linear-gradient(rgba(148, 208, 255, 0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 208, 255, 0.12) 1px, transparent 1px);
          background-size: 54px 54px;
          mask-image: radial-gradient(ellipse at center, black, transparent 75%);
        }

        .intro-orb {
          position: absolute;
          width: 24rem;
          height: 24rem;
          border-radius: 9999px;
          filter: blur(90px);
          opacity: 0.25;
          animation: orb-drift 5s ease-in-out infinite alternate;
        }

        .intro-orb-one {
          top: 15%;
          left: 10%;
          background: #2563eb;
        }

        .intro-orb-two {
          right: 8%;
          bottom: 8%;
          background: #06b6d4;
          animation-delay: -2s;
        }

        .brand-letter {
          display: inline-block;
          color: #f8fbff;
          font-size: clamp(2rem, 7vw, 5.8rem);
          font-weight: 950;
          letter-spacing: -0.075em;
          line-height: 1;
          text-shadow: 0 0 32px rgba(103, 232, 249, 0.16);
          opacity: 0;
          transform: translate3d(0, 0, 0) scale(0.6) rotateY(70deg);
          animation: letter-assemble 850ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .brand-letter:nth-child(1) { --from-x: -100vw; --from-y: -25vh; }
        .brand-letter:nth-child(2) { --from-x: 0; --from-y: 100vh; }
        .brand-letter:nth-child(3) { --from-x: 100vw; --from-y: -35vh; }
        .brand-letter:nth-child(4) { --from-x: -100vw; --from-y: 45vh; }
        .brand-letter:nth-child(5) { --from-x: 100vw; --from-y: 30vh; }
        .brand-letter:nth-child(6) { --from-x: 0; --from-y: -100vh; }
        .brand-letter:nth-child(7) { --from-x: -100vw; --from-y: -45vh; }
        .brand-letter:nth-child(8) { --from-x: 100vw; --from-y: 50vh; }

        .intro-subtitle {
          opacity: 0;
          animation: subtitle-reveal 600ms ease 1.25s forwards;
        }

        .hero-surface {
          background:
            radial-gradient(ellipse at 75% 38%, rgba(37, 99, 235, 0.14), transparent 42%),
            linear-gradient(180deg, #050816 0%, #070b1b 75%, #050816 100%);
        }

        .hero-stars {
          position: absolute;
          inset: 0;
          opacity: 0.24;
          background-image: radial-gradient(rgba(191, 219, 254, 0.7) 0.7px, transparent 0.7px);
          background-size: 34px 34px;
          mask-image: linear-gradient(to bottom, black, transparent 85%);
          pointer-events: none;
        }

        .hero-glow {
          position: absolute;
          width: 24rem;
          height: 24rem;
          border-radius: 9999px;
          filter: blur(95px);
          pointer-events: none;
        }

        .hero-glow-left {
          top: 8rem;
          left: -14rem;
          background: rgba(37, 99, 235, 0.16);
        }

        .hero-glow-right {
          top: 8rem;
          right: -10rem;
          background: rgba(6, 182, 212, 0.13);
        }

        .phone-halo {
          position: absolute;
          inset: 12% 8%;
          border-radius: 50%;
          background: linear-gradient(120deg, rgba(59, 130, 246, 0.24), rgba(34, 211, 238, 0.12), rgba(139, 92, 246, 0.18));
          filter: blur(50px);
          animation: halo-pulse 5s ease-in-out infinite alternate;
        }

        .phone-frame {
          position: relative;
          z-index: 2;
          width: min(76%, 285px);
          margin-inline: auto;
          padding: 8px;
          border: 1px solid rgba(255, 255, 255, 0.24);
          border-radius: 2.8rem;
          background: linear-gradient(145deg, #28334c, #080b14 35%, #171f34 70%, #05070c);
          box-shadow:
            0 35px 100px rgba(0, 0, 0, 0.55),
            0 0 0 1px rgba(255, 255, 255, 0.04),
            inset 0 1px 1px rgba(255, 255, 255, 0.35);
          transform: rotateY(-7deg) rotateX(2deg);
          animation: phone-enter 1s cubic-bezier(0.16, 1, 0.3, 1) both, phone-float 7s ease-in-out 1s infinite;
        }

        .phone-screen {
          position: relative;
          min-height: 490px;
          overflow: hidden;
          border-radius: 2.3rem;
          padding: 1.25rem 1rem 1rem;
          background:
            radial-gradient(circle at 90% 5%, rgba(59, 130, 246, 0.16), transparent 30%),
            #0a1021;
        }

        .phone-notch {
          position: absolute;
          top: 7px;
          left: 50%;
          width: 82px;
          height: 17px;
          transform: translateX(-50%);
          border-radius: 999px;
          background: #02040a;
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.06);
        }

        .float-card {
          position: absolute;
          z-index: 5;
          display: flex;
          align-items: center;
          gap: 0.7rem;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 1.1rem;
          background: rgba(10, 16, 33, 0.88);
          padding: 0.7rem 0.85rem;
          box-shadow: 0 20px 55px rgba(0, 0, 0, 0.28);
          backdrop-filter: blur(18px);
          animation: card-float 5s ease-in-out infinite;
        }

        .float-card-top {
          top: 16%;
          right: -1%;
        }

        .float-card-bottom {
          bottom: 14%;
          left: -4%;
          animation-delay: -2.5s;
        }

        @keyframes letter-assemble {
          0% {
            opacity: 0;
            transform: translate3d(var(--from-x, 0), var(--from-y, 0), 0) scale(0.55) rotateY(80deg);
            filter: blur(12px);
          }
          70% {
            opacity: 1;
            filter: blur(0);
            transform: translate3d(0, 0, 0) scale(1.08) rotateY(0);
          }
          100% {
            opacity: 1;
            filter: blur(0);
            transform: translate3d(0, 0, 0) scale(1) rotateY(0);
          }
        }

        @keyframes subtitle-reveal {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes intro-background {
          0%, 82% { opacity: 1; visibility: visible; }
          100% { opacity: 0; visibility: hidden; }
        }

        @keyframes orb-drift {
          from { transform: translate3d(-12px, 8px, 0) scale(0.92); }
          to { transform: translate3d(20px, -14px, 0) scale(1.08); }
        }

        @keyframes phone-enter {
          from { opacity: 0; transform: translateY(35px) rotateY(-7deg) rotateX(2deg) scale(0.96); }
          to { opacity: 1; transform: translateY(0) rotateY(-7deg) rotateX(2deg) scale(1); }
        }

        @keyframes phone-float {
          0%, 100% { translate: 0 0; }
          50% { translate: 0 -9px; }
        }

        @keyframes card-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes halo-pulse {
          from { opacity: 0.55; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1.05); }
        }

        @media (max-width: 420px) {
          .float-card {
            padding: 0.55rem;
            gap: 0.45rem;
          }
          .float-card-top { right: -2%; }
          .float-card-bottom { left: -2%; }
          .phone-screen { min-height: 465px; }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </main>
  );
}




































