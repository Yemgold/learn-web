

"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  AlertCircle,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Gift,
  Loader2,
  Share2,
  TrendingUp,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { useAuthStore } from "@/stores";

import {
  getReferralNetwork,
  getReferralStats,
  getPaidReferralNetwork,
  type ReferralNetworkMember,
  type ReferralStats,
  type ReferralPaidNetworkData,
} from "@/services/referral.service";

/* ============================================================
   FRONTEND USER SHAPE
============================================================ */

interface ReferralUserData {
  _id?: string;
  referralCode?: string;
}

/* ============================================================
   PAGE
============================================================ */

export default function ReferralsPage() {
  const { user } = useAuthStore();

  const referralUser = user as typeof user & ReferralUserData;

  const userId = referralUser?._id ?? "";
  const referralCode = referralUser?.referralCode ?? "";

  /* ============================================================
     STATE
  ============================================================ */

  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [referrals, setReferrals] = useState<ReferralNetworkMember[]>([]);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [paidNetwork, setPaidNetwork] =
    useState<ReferralPaidNetworkData | null>(null);

  const [showNetwork, setShowNetwork] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  /* ============================================================
     REFERRAL LINK
  ============================================================ */

  const referralLink = useMemo(() => {
    if (typeof window === "undefined" || !referralCode) {
      return "";
    }

    return `${window.location.origin}/register?ref=${encodeURIComponent(
      referralCode,
    )}`;
  }, [referralCode]);

  /* ============================================================
     LOAD REFERRAL DATA
  ============================================================ */

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError(
        "Your account information is not available. Please log in again.",
      );
      return;
    }

    let cancelled = false;

    async function loadReferralData() {
      try {
        setLoading(true);
        setError(null);

        const [networkResponse, statsResponse, paidNetworkResponse] =
          await Promise.all([
            getReferralNetwork(userId),
            getReferralStats(userId),
            getPaidReferralNetwork(userId),
          ]);

        if (cancelled) return;

        if (networkResponse.success) {
          setReferrals(
            Array.isArray(networkResponse.data)
              ? networkResponse.data
              : [],
          );
        }

        if (statsResponse.success) {
          setStats(statsResponse.data);
        }

        if (paidNetworkResponse.success) {
          setPaidNetwork(paidNetworkResponse.data);
        }

        if (
          !networkResponse.success ||
          !statsResponse.success ||
          !paidNetworkResponse.success
        ) {
          setError("Some referral information could not be loaded.");
        }
      } catch (err) {
        if (cancelled) return;

        console.error("Failed to load referral data:", err);

        setError(
          "Unable to load your referral information. Please try again.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadReferralData();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  /* ============================================================
     DERIVED REFERRAL STATISTICS
  ============================================================ */

  const totalReferrals = stats?.totalReferred ?? referrals.length;

  const paidCount = stats?.paidCount ?? paidNetwork?.totalPaid ?? 0;

  const unpaidCount = stats?.unpaidCount ?? paidNetwork?.totalUnpaid ?? 0;

  const level1 = stats?.breakdown.level1 ?? 0;
  const level2 = stats?.breakdown.level2 ?? 0;
  const level3 = stats?.breakdown.level3 ?? 0;

  // Display referral earnings only when the referral API provides
  // an actual earnings field. No wallet balance is read here.
  const totalEarned = 0;

  /* ============================================================
     COPY REFERRAL LINK
  ============================================================ */

  const copyReferralLink = async () => {
    if (!referralLink) return;

    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);

      window.setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy referral link:", err);
      setError("Unable to copy the referral link. Please try again.");
    }
  };

  /* ============================================================
     SHARE REFERRAL LINK
  ============================================================ */

  const shareReferral = async () => {
    if (!referralLink) return;

    const shareData = {
      title: "Join Learnyfi Exams",
      text:
        "Join me on Learnyfi Exams and prepare smarter for your exams.",
      url: referralLink,
    };

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(referralLink);
      setCopied(true);

      window.setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      if ((err as Error)?.name !== "AbortError") {
        console.error("Share failed:", err);
        setError("Unable to share the referral link. Please try again.");
      }
    }
  };

  /* ============================================================
     LOADING STATE
  ============================================================ */

  if (loading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
        <PageBackground />

        <div className="relative flex min-h-[500px] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-400" />

            <p className="mt-4 text-sm font-medium text-white/50">
              Loading your referral information...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* ============================================================
     MAIN PAGE
  ============================================================ */

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <PageBackground />

      <div className="relative space-y-7 px-1 pb-8 sm:space-y-8">
        {/* HEADER */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-400">
            <Gift size={17} />
            <span>Referral Programme</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Invite Friends. Earn Rewards.
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50 sm:text-base">
            Invite other students to Learnyfi Exams using your personal
            referral link and track your referral network.
          </p>
        </motion.div>

        {/* ERROR */}

        {error && (
          <div className="mx-1 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
            <AlertCircle
              size={19}
              className="mt-0.5 shrink-0 text-amber-600"
            />

            <div className="min-w-0 flex-1">
              <p className="font-semibold text-amber-900">
                Referral information
              </p>

              <p className="mt-1 text-sm text-amber-700">{error}</p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-2 text-sm font-semibold text-amber-900 underline underline-offset-4"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* REFERRAL STATISTICS — NO WALLET BALANCE */}

        <div className="grid gap-4 px-1 sm:grid-cols-2 xl:grid-cols-3">
          <ReferralStat
            icon={<TrendingUp size={20} />}
            label="Total Earned"
            value={`₦${totalEarned.toLocaleString()}`}
            description="Lifetime referral earnings"
            delay={0.05}
          />

          <ReferralStat
            icon={<Users size={20} />}
            label="Total Referrals"
            value={totalReferrals.toString()}
            description="Students in your network"
            delay={0.1}
          />

          <ReferralStat
            icon={<Check size={20} />}
            label="Paid Referrals"
            value={paidCount.toString()}
            description="Referrals with qualifying payment"
            delay={0.15}
          />
        </div>

        {/* REFERRAL NETWORK */}

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mx-1 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Referral Network
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                View your referral levels and payment status.
              </p>
            </div>

            <ViewDetailsButton
              open={showNetwork}
              onClick={() => setShowNetwork((value) => !value)}
              label="View Network"
            />
          </div>

          <AnimatePresence initial={false}>
            {showNetwork && (
              <motion.div
                key="referral-network"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <NetworkLevel
                    level="Level 1"
                    value={level1}
                    description="Direct referrals"
                  />

                  <NetworkLevel
                    level="Level 2"
                    value={level2}
                    description="Second-level referrals"
                  />

                  <NetworkLevel
                    level="Level 3"
                    value={level3}
                    description="Third-level referrals"
                  />
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                      Paid
                    </p>

                    <p className="mt-1 text-2xl font-extrabold text-emerald-900">
                      {paidCount}
                    </p>

                    <p className="mt-1 text-sm text-emerald-700">
                      Qualifying referrals
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Unpaid
                    </p>

                    <p className="mt-1 text-2xl font-extrabold text-slate-900">
                      {unpaidCount}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Referrals not yet qualifying
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* REFERRAL LINK */}

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="mx-1 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="border-b border-slate-100 px-5 py-4 sm:px-6 sm:py-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Share2 size={19} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Your Referral Link
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Share your personal link with friends and other students.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5 p-5 sm:p-6">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Referral Code
              </p>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="font-mono text-base font-bold tracking-wider text-slate-900">
                  {referralCode || "No referral code"}
                </span>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Referral Link
              </p>

              <div className="flex flex-col gap-2.5 sm:flex-row">
                <div className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="truncate text-sm text-slate-600">
                    {referralLink || "Referral link unavailable"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={copyReferralLink}
                  disabled={!referralLink}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {copied ? (
                    <>
                      <Check size={17} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={17} />
                      Copy Link
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={shareReferral}
                  disabled={!referralLink}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Share2 size={17} />
                  Share
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* HOW IT WORKS */}

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mx-1 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                How Referrals Work
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Learn how to grow your network in three simple steps.
              </p>
            </div>

            <ViewDetailsButton
              open={showHowItWorks}
              onClick={() => setShowHowItWorks((value) => !value)}
              label="How It Works"
            />
          </div>

          <AnimatePresence initial={false}>
            {showHowItWorks && (
              <motion.div
                key="referral-instructions"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <ReferralStep
                    number="01"
                    title="Share Your Link"
                    description="Copy your personal referral link and share it with friends, classmates and other students."
                  />

                  <ReferralStep
                    number="02"
                    title="They Join"
                    description="When someone registers through your referral link, the referral is connected to your network."
                  />

                  <ReferralStep
                    number="03"
                    title="Track Referrals"
                    description="Track your referral levels and qualifying referrals from your dashboard."
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* REFERRAL HISTORY */}

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mx-1 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Referral History
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                View the students who joined your referral network.
              </p>
            </div>

            <ViewDetailsButton
              open={showHistory}
              onClick={() => setShowHistory((value) => !value)}
              label="View Referrals"
            />
          </div>

          <AnimatePresence initial={false}>
            {showHistory && (
              <motion.div
                key="referral-history"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                {referrals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center px-5 py-12 text-center sm:px-6 sm:py-16">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                      <Users size={25} />
                    </div>

                    <h3 className="mt-4 text-base font-bold text-slate-900">
                      No referrals yet
                    </h3>

                    <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                      Your referral activity will appear here when students
                      join using your referral link.
                    </p>

                    <button
                      type="button"
                      onClick={shareReferral}
                      disabled={!referralLink}
                      className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Share2 size={17} />
                      Invite Someone
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {referrals.map((referral) => {
                      const fullName =
                        `${referral.firstName} ${referral.lastName}`.trim();

                      const initials = fullName
                        .split(" ")
                        .filter(Boolean)
                        .map((name) => name.charAt(0))
                        .join("")
                        .slice(0, 2)
                        .toUpperCase();

                      return (
                        <div
                          key={referral.id}
                          className="mx-1 flex items-center justify-between gap-3 rounded-xl px-4 py-4 transition hover:bg-slate-50 sm:mx-2"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                              {initials || "U"}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-slate-900">
                                {fullName || "Learnyfi Student"}
                              </p>

                              <p className="mt-0.5 truncate text-xs text-slate-500 sm:text-sm">
                                {referral.email}
                              </p>
                            </div>
                          </div>

                          <div className="hidden shrink-0 text-right sm:block">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                              Referral Code
                            </p>

                            <p className="mt-1 font-mono text-sm font-bold text-slate-700">
                              {referral.referralCode || "—"}
                            </p>
                          </div>

                          <ChevronRight
                            size={17}
                            className="shrink-0 text-slate-300"
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </div>
    </main>
  );
}

/* ============================================================
   BACKGROUND
============================================================ */

function PageBackground() {
  return (
    <div className="pointer-events-none fixed inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.14),transparent_35%)]" />

      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(15,23,42,0.1),rgba(2,6,23,0.7))]" />
    </div>
  );
}

/* ============================================================
   VIEW DETAILS BUTTON
============================================================ */

interface ViewDetailsButtonProps {
  open: boolean;
  onClick: () => void;
  label: string;
}

function ViewDetailsButton({
  open,
  onClick,
  label,
}: ViewDetailsButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      {open ? "Hide Details" : label}

      <ChevronDown
        size={16}
        className={`transition-transform duration-200 ${
          open ? "rotate-180" : ""
        }`}
      />
    </button>
  );
}

/* ============================================================
   REFERRAL STAT
============================================================ */

interface ReferralStatProps {
  icon: ReactNode;
  label: string;
  value: string;
  description: string;
  delay: number;
}

function ReferralStat({
  icon,
  label,
  value,
  description,
  delay,
}: ReferralStatProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
        {icon}
      </div>

      <p className="mt-4 text-sm font-medium text-slate-500">{label}</p>

      <p className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">{description}</p>
    </motion.div>
  );
}

/* ============================================================
   NETWORK LEVEL
============================================================ */

interface NetworkLevelProps {
  level: string;
  value: number;
  description: string;
}

function NetworkLevel({
  level,
  value,
  description,
}: NetworkLevelProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {level}
      </p>

      <p className="mt-1.5 text-2xl font-extrabold tracking-tight text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}

/* ============================================================
   REFERRAL STEP
============================================================ */

interface ReferralStepProps {
  number: string;
  title: string;
  description: string;
}

function ReferralStep({
  number,
  title,
  description,
}: ReferralStepProps) {
  return (
    <div className="relative rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-extrabold text-blue-600">
          {number}
        </span>

        <ChevronRight size={17} className="text-slate-300" />
      </div>

      <h3 className="mt-4 text-base font-bold text-slate-900">{title}</h3>

      <p className="mt-1.5 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}
