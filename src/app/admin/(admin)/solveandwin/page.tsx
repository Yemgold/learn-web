




import Link from "next/link";

interface Challenge {
  id: string;
  title: string;
  description: string;
  examType: string;
  subject: {
    id: string;
    name: string;
    slug: string;
  };
  questions: number;
  durationMinutes: number;
  entryCost: {
    cbtPoints: number;
  };
  reward: {
    type: string;
    amount: number;
    currency: string;
  };
  difficulty: string;
  participants: number;
  status: string;
  icon: string;
  enabled: boolean;
}

export default async function SolveAndWinPage() {
  // Temporary placeholder data.
  // This will be replaced with the admin API later.
  const challenges: Challenge[] = [
    {
      id: "65f123abc",
      title: "JAMB Quick Challenge",
      description:
        "Test yourself with a fast-paced mixture of JAMB-style questions.",
      examType: "jamb",
      subject: {
        id: "subject-id",
        name: "Mixed",
        slug: "mixed",
      },
      questions: 10,
      durationMinutes: 10,
      entryCost: {
        cbtPoints: 500,
      },
      reward: {
        type: "cash",
        amount: 500,
        currency: "NGN",
      },
      difficulty: "easy",
      participants: 1240,
      status: "available",
      icon: "zap",
      enabled: true,
    },
    {
      id: "65f456def",
      title: "JAMB Biology Challenge",
      description:
        "Challenge yourself with carefully selected JAMB Biology questions.",
      examType: "jamb",
      subject: {
        id: "biology-id",
        name: "Biology",
        slug: "biology",
      },
      questions: 20,
      durationMinutes: 15,
      entryCost: {
        cbtPoints: 750,
      },
      reward: {
        type: "cash",
        amount: 1000,
        currency: "NGN",
      },
      difficulty: "medium",
      participants: 842,
      status: "available",
      icon: "book",
      enabled: true,
    },
    {
      id: "65f789ghi",
      title: "JAMB Science Master",
      description:
        "A difficult mixed science challenge for serious JAMB candidates.",
      examType: "jamb",
      subject: {
        id: "science-id",
        name: "Science",
        slug: "science",
      },
      questions: 30,
      durationMinutes: 25,
      entryCost: {
        cbtPoints: 1000,
      },
      reward: {
        type: "cash",
        amount: 2000,
        currency: "NGN",
      },
      difficulty: "hard",
      participants: 316,
      status: "disabled",
      icon: "brain",
      enabled: false,
    },
  ];

  const totalParticipants = challenges.reduce(
    (total, challenge) => total + challenge.participants,
    0,
  );

  const activeChallenges = challenges.filter(
    (challenge) =>
      challenge.enabled && challenge.status === "available",
  ).length;

  const totalRewardValue = challenges.reduce(
    (total, challenge) => total + challenge.reward.amount,
    0,
  );

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/admin"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              ← Back to Admin Dashboard
            </Link>

            <h1 className="mt-3 text-4xl font-bold text-slate-900">
              Solve & Win
            </h1>

            <p className="mt-2 text-slate-600">
              Create and manage Solve & Win challenges, entry costs,
              questions and rewards.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/solveandwin/create"
              className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              + Create Challenge
            </Link>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Challenges"
            value={challenges.length.toString()}
            description="All created challenges"
          />

          <StatCard
            label="Active Challenges"
            value={activeChallenges.toString()}
            description="Currently available"
          />

          <StatCard
            label="Participants"
            value={totalParticipants.toLocaleString()}
            description="Total challenge entries"
          />

          <StatCard
            label="Reward Value"
            value={`₦${totalRewardValue.toLocaleString()}`}
            description="Configured rewards"
          />
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Challenges */}
          <section className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Challenges
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage your Solve & Win challenges.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button className="rounded-xl border bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    All
                  </button>

                  <button className="rounded-xl border bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    Active
                  </button>

                  <button className="rounded-xl border bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    Disabled
                  </button>
                </div>
              </div>
            </div>

            {challenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
              />
            ))}
          </section>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Quick Actions */}
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-semibold text-slate-900">
                Quick Actions
              </h2>

              <div className="space-y-3">
                <Link
                  href="/admin/solveandwin/create"
                  className="block rounded-xl bg-blue-600 px-4 py-3 text-center font-semibold text-white hover:bg-blue-700"
                >
                  Create Challenge
                </Link>

                <Link
                  href="/admin/solveandwin/questions"
                  className="block rounded-xl border border-slate-300 bg-white px-4 py-3 text-center font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Manage Questions
                </Link>

                <Link
                  href="/admin/solveandwin/participants"
                  className="block rounded-xl border border-slate-300 bg-white px-4 py-3 text-center font-semibold text-slate-700 hover:bg-slate-50"
                >
                  View Participants
                </Link>

                <Link
                  href="/admin/solveandwin/rewards"
                  className="block rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-center font-semibold text-green-700 hover:bg-green-100"
                >
                  Manage Rewards
                </Link>
              </div>
            </section>

            {/* Challenge Rules */}
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-semibold text-slate-900">
                Challenge System
              </h2>

              <div className="space-y-5">
                <Info
                  label="Entry"
                  value="CBT Points"
                />

                <Info
                  label="Question Source"
                  value="CBT Question Bank"
                />

                <Info
                  label="Rewards"
                  value="Cash / CBT Points"
                />

                <Info
                  label="Competition"
                  value="Score-based"
                />
              </div>
            </section>

            {/* Important Note */}
            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <h2 className="font-semibold text-amber-900">
                Admin Control
              </h2>

              <p className="mt-2 text-sm leading-6 text-amber-800">
                A challenge should only become available to students
                after it has been configured, assigned questions and
                enabled by an administrator.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

/* ============================================================
   CHALLENGE CARD
   ============================================================ */

interface ChallengeCardProps {
  challenge: Challenge;
}

function ChallengeCard({
  challenge,
}: ChallengeCardProps) {
  const isActive =
    challenge.enabled && challenge.status === "available";

  return (
    <article className="rounded-2xl border bg-white p-6 shadow-sm">
      {/* Top */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
            {getIcon(challenge.icon)}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-bold text-slate-900">
                {challenge.title}
              </h3>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {isActive ? "Available" : "Disabled"}
              </span>
            </div>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              {challenge.description}
            </p>
          </div>
        </div>

        <div
          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
            challenge.difficulty === "easy"
              ? "bg-green-50 text-green-700"
              : challenge.difficulty === "medium"
                ? "bg-amber-50 text-amber-700"
                : "bg-red-50 text-red-700"
          }`}
        >
          {challenge.difficulty}
        </div>
      </div>

      {/* Challenge Information */}
      <div className="mt-6 grid gap-4 border-t pt-6 sm:grid-cols-2 lg:grid-cols-4">
        <Info
          label="Exam"
          value={challenge.examType.toUpperCase()}
        />

        <Info
          label="Subject"
          value={challenge.subject.name}
        />

        <Info
          label="Questions"
          value={`${challenge.questions}`}
        />

        <Info
          label="Duration"
          value={`${challenge.durationMinutes} minutes`}
        />
      </div>

      {/* Entry & Reward */}
      <div className="mt-6 grid gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Entry Cost
          </p>

          <p className="mt-1 text-lg font-bold text-slate-900">
            {challenge.entryCost.cbtPoints.toLocaleString()} CBT Points
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-500">
            Reward
          </p>

          <p className="mt-1 text-lg font-bold text-green-700">
            {formatReward(challenge.reward)}
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t pt-6">
        <div>
          <p className="text-sm text-slate-500">
            Participants
          </p>

          <p className="font-bold text-slate-900">
            {challenge.participants.toLocaleString()}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/solveandwin/${challenge.id}`}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            View
          </Link>

          <Link
            href={`/admin/solveandwin/${challenge.id}/questions`}
            className="rounded-xl border border-blue-300 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100"
          >
            Questions
          </Link>

          <Link
            href={`/admin/solveandwin/${challenge.id}/edit`}
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Edit
          </Link>

          {isActive ? (
            <button className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-100">
              Disable
            </button>
          ) : (
            <button className="rounded-xl border border-green-300 bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-700 hover:bg-green-100">
              Enable
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

/* ============================================================
   STAT CARD
   ============================================================ */

interface StatCardProps {
  label: string;
  value: string;
  description: string;
}

function StatCard({
  label,
  value,
  description,
}: StatCardProps) {
  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-500">
        {description}
      </p>
    </section>
  );
}

/* ============================================================
   INFO
   ============================================================ */

interface InfoProps {
  label: string;
  value: string;
}

function Info({
  label,
  value,
}: InfoProps) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-2 font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   HELPERS
   ============================================================ */

function formatReward(reward: Challenge["reward"]) {
  if (reward.type === "cash") {
    return `₦${reward.amount.toLocaleString()}`;
  }

  return `${reward.amount.toLocaleString()} ${reward.type}`;
}

function getIcon(icon: string) {
  switch (icon) {
    case "zap":
      return "⚡";

    case "book":
      return "📚";

    case "brain":
      return "🧠";

    case "trophy":
      return "🏆";

    case "target":
      return "🎯";

    default:
      return "🏆";
  }
}