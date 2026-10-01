




"use client";

import {
  ArrowRight,
  BookOpen,
  Gift,
  GraduationCap,
  HelpCircle,
  Lightbulb,
  Send,
  ShoppingBag,
  Sparkles,
  Target,
  Trophy,
  WalletCards,
  Zap,
} from "lucide-react";

interface HowCbtPointsWorkProps {
  className?: string;
  showAction?: boolean;
  actionHref?: string;
  actionLabel?: string;
}

const earningMethods = [
  {
    icon: BookOpen,
    title: "Practice Questions",
    description:
      "Complete CBT practice questions and earn points as you learn.",
  },
  {
    icon: Trophy,
    title: "Quiz Competitions",
    description:
      "Take part in Quiz Board competitions and earn points from your performance.",
  },
  {
    icon: Target,
    title: "Learning Goals",
    description:
      "Complete your daily learning activities and receive learning bonuses.",
  },
  {
    icon: Sparkles,
    title: "Special Bonuses",
    description:
      "Watch out for promotional rewards, challenges, and special learning events.",
  },
];

const spendingMethods = [
  {
    icon: ShoppingBag,
    title: "Student Rewards",
    description:
      "Use your CBT Points to redeem gadgets, study materials, school items, and more.",
  },
  {
    icon: GraduationCap,
    title: "Education Rewards",
    description:
      "Spend points on mock exams, learning access, textbooks, and education support.",
  },
  {
    icon: Trophy,
    title: "Competition Entries",
    description:
      "Use your points to participate in eligible learning competitions.",
  },
  {
    icon: Send,
    title: "Send Points",
    description:
      "Transfer CBT Points to another student when transfers are available.",
  },
];

export default function HowCbtPointsWork({
  className = "",
  showAction = true,
  actionHref = "/student/practice/cbtsubjects?exam=jamb",
  actionLabel = "Start Earning Points",
}: HowCbtPointsWorkProps) {
  return (
    <section
      className={`overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 ${className}`}
    >
      {/* Header */}
      <div className="relative overflow-hidden border-b border-slate-800 px-5 py-7 sm:px-7">
        <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-cyan-500/5 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/10 text-violet-400 ring-1 ring-inset ring-violet-500/10">
              <WalletCards className="h-6 w-6" />
            </div>

            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-violet-300">
                  CBT Points
                </span>
              </div>

              <h2 className="text-xl font-bold text-white">
                How CBT Points Work
              </h2>

              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
                Learn, practice, compete, earn points, and turn
                your progress into useful student rewards.
              </p>
            </div>
          </div>

          <div className="hidden shrink-0 rounded-2xl border border-slate-800 bg-slate-900/70 p-3 sm:block">
            <Zap className="h-6 w-6 text-amber-400" />
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        {/* Flow */}
        <div className="mb-8 grid gap-3 sm:grid-cols-4">
          <FlowStep
            number="01"
            icon={BookOpen}
            title="Learn"
            description="Study lessons and practice questions."
          />

          <FlowConnector />

          <FlowStep
            number="02"
            icon={Zap}
            title="Earn"
            description="Complete activities and earn CBT Points."
          />

          <FlowConnector />

          <FlowStep
            number="03"
            icon={ShoppingBag}
            title="Redeem"
            description="Exchange points for student rewards."
          />
        </div>

        {/* Earn + Spend */}
        <div className="grid gap-5 lg:grid-cols-2">
          <InfoPanel
            title="Ways to Earn"
            description="Your learning activities can help you build your point balance."
            icon={Zap}
            iconClassName="bg-emerald-500/10 text-emerald-400"
            items={earningMethods}
          />

          <InfoPanel
            title="Ways to Use"
            description="Put the points you earn toward useful learning and student rewards."
            icon={Gift}
            iconClassName="bg-violet-500/10 text-violet-400"
            items={spendingMethods}
          />
        </div>

        {/* Important notes */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <NoteCard
            icon={Lightbulb}
            title="Keep learning"
            description="The more eligible learning activities you complete, the more opportunities you have to earn CBT Points."
          />

          <NoteCard
            icon={HelpCircle}
            title="Check reward requirements"
            description="Each reward has its own point cost, availability, and redemption requirements."
          />
        </div>

        {/* CTA */}
        {showAction && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-500/10 via-slate-900 to-cyan-500/5 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                  <Sparkles className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Ready to build your balance?
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Start practicing and turn your learning
                    progress into CBT Points.
                  </p>
                </div>
              </div>

              <a
                href={actionHref}
                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
              >
                {actionLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

interface FlowStepProps {
  number: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

function FlowStep({
  number,
  icon: Icon,
  title,
  description,
}: FlowStepProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
          <Icon className="h-4 w-4" />
        </div>

        <span className="text-[10px] font-bold tracking-widest text-slate-700">
          {number}
        </span>
      </div>

      <h3 className="text-sm font-semibold text-white">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function FlowConnector() {
  return (
    <div className="hidden items-center justify-center sm:flex">
      <ArrowRight className="h-4 w-4 text-slate-700" />
    </div>
  );
}

interface InfoPanelProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClassName: string;
  items: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
  }[];
}

function InfoPanel({
  title,
  description,
  icon: Icon,
  iconClassName,
  items,
}: InfoPanelProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
      <div className="mb-5 flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <h3 className="text-sm font-bold text-white">
            {title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          const ItemIcon = item.icon;

          return (
            <div
              key={item.title}
              className="flex gap-3"
            >
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800/80 text-slate-400">
                <ItemIcon className="h-4 w-4" />
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-200">
                  {item.title}
                </p>

                <p className="mt-1 text-[11px] leading-5 text-slate-500">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface NoteCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

function NoteCard({
  icon: Icon,
  title,
  description,
}: NoteCardProps) {
  return (
    <div className="flex gap-3 rounded-2xl border border-slate-800 bg-slate-900/30 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800/80 text-slate-400">
        <Icon className="h-4 w-4" />
      </div>

      <div>
        <h3 className="text-xs font-semibold text-slate-300">
          {title}
        </h3>

        <p className="mt-1 text-[11px] leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}