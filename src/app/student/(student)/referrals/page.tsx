



"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  AlertCircle,
  ArrowUpRight,
  Check,
  ChevronRight,
  Clock3,
  Copy,
  Gift,
  Loader2,
  Share2,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

import { motion } from "framer-motion";

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

   Your current User type does not yet contain these backend
   fields, so we normalize only the fields required by this page.

   This keeps the referral page independent from unrelated
   User type changes.
   ============================================================ */

interface ReferralUserData {
  _id?: string;

  referralCode?: string;

  userWallet?: {
    balance?: number;
  };
}

/* ============================================================
   PAGE
   ============================================================ */

export default function ReferralsPage() {
  /* ============================================================
     AUTH
     ============================================================ */

  const { user } = useAuthStore();

  /*
   * Your backend login response contains:
   *
   * _id
   * referralCode
   * userWallet
   *
   * Your current frontend User type does not declare them yet.
   *
   * We safely read those backend fields here.
   */

  const referralUser =
    user as typeof user & ReferralUserData;

  const userId = referralUser?._id ?? "";

  const referralCode =
    referralUser?.referralCode ?? "";

  const walletBalance =
    referralUser?.userWallet?.balance ?? 0;

  /* ============================================================
     STATE
     ============================================================ */

  const [copied, setCopied] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [referrals, setReferrals] =
    useState<ReferralNetworkMember[]>([]);

  const [stats, setStats] =
    useState<ReferralStats | null>(null);

  const [paidNetwork, setPaidNetwork] =
    useState<ReferralPaidNetworkData | null>(
      null,
    );

  /* ============================================================
     REFERRAL LINK
     ============================================================ */

  const referralLink = useMemo(() => {
    if (
      typeof window === "undefined" ||
      !referralCode
    ) {
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

        /*
         * Load all referral information.
         *
         * These are independent endpoints, so they can be
         * requested together.
         */

        const [
          networkResponse,
          statsResponse,
          paidNetworkResponse,
        ] = await Promise.all([
          getReferralNetwork(userId),

          getReferralStats(userId),

          getPaidReferralNetwork(userId),
        ]);

        if (cancelled) {
          return;
        }

        /* ======================================================
           NETWORK
           ====================================================== */

        if (networkResponse.success) {
          setReferrals(
            Array.isArray(networkResponse.data)
              ? networkResponse.data
              : [],
          );
        }

        /* ======================================================
           STATS
           ====================================================== */

        if (statsResponse.success) {
          setStats(statsResponse.data);
        }

        /* ======================================================
           PAID / UNPAID
           ====================================================== */

        if (
          paidNetworkResponse.success
        ) {
          setPaidNetwork(
            paidNetworkResponse.data,
          );
        }

        /*
         * If one endpoint failed, show a general error.
         */

        if (
          !networkResponse.success ||
          !statsResponse.success ||
          !paidNetworkResponse.success
        ) {
          setError(
            "Some referral information could not be loaded.",
          );
        }
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to load referral data:",
          err,
        );

        setError(
          "Unable to load your referral information. Please try again.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadReferralData();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  /* ============================================================
     DERIVED STATS
     ============================================================ */

  const totalReferrals =
    stats?.totalReferred ??
    referrals.length;

  const paidCount =
    stats?.paidCount ??
    paidNetwork?.totalPaid ??
    0;

  const unpaidCount =
    stats?.unpaidCount ??
    paidNetwork?.totalUnpaid ??
    0;

  const level1 =
    stats?.breakdown.level1 ?? 0;

  const level2 =
    stats?.breakdown.level2 ?? 0;

  const level3 =
    stats?.breakdown.level3 ?? 0;

  /*
   * There is currently no earnings endpoint in the APIs
   * you provided.
   *
   * Therefore we do not invent an earnings amount.
   */

  const totalEarned = 0;

  /* ============================================================
     COPY
     ============================================================ */

  const copyReferralLink = async () => {
    if (!referralLink) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        referralLink,
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error(
        "Failed to copy referral link:",
        err,
      );
    }
  };

  /* ============================================================
     SHARE
     ============================================================ */

  const shareReferral = async () => {
    if (!referralLink) {
      return;
    }

    const shareData = {
      title: "Join Klazik Exams",

      text:
        "Join me on Klazik Exams and prepare smarter for your exams.",

      url: referralLink,
    };

    try {
      if (
        typeof navigator !== "undefined" &&
        navigator.share
      ) {
        await navigator.share(
          shareData,
        );

        return;
      }

      await navigator.clipboard.writeText(
        referralLink,
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      if (
        (err as Error)?.name !==
        "AbortError"
      ) {
        console.error(
          "Share failed:",
          err,
        );
      }
    }
  };

  /* ============================================================
     LOADING
     ============================================================ */

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading your referral information...
          </p>
        </div>
      </div>
    );
  }

  /* ============================================================
     PAGE
     ============================================================ */

  return (
    <div className="space-y-8">
      {/* ========================================================
          HEADER
      ======================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.45,
        }}
      >
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600">
            <Gift size={17} />

            <span>
              Referral Programme
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Invite Friends. Earn Rewards.
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Invite other students to Klazik
            Exams using your personal referral
            link and track your referral network.
          </p>
        </div>
      </motion.div>

      {/* ========================================================
          ERROR
      ======================================================== */}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
          <AlertCircle
            size={19}
            className="mt-0.5 shrink-0 text-amber-600"
          />

          <div>
            <p className="font-semibold text-amber-900">
              Referral information
            </p>

            <p className="mt-1 text-sm text-amber-700">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* ========================================================
          MAIN STATS
      ======================================================== */}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {/* Wallet */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.05,
            duration: 0.45,
          }}
          className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl"
        >
          <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-500/20 blur-2xl" />

          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                <Wallet size={21} />
              </div>

              <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                Wallet
              </span>
            </div>

            <p className="mt-6 text-sm text-white/55">
              Available Balance
            </p>

            <p className="mt-1 text-3xl font-extrabold tracking-tight">
              ₦{walletBalance.toLocaleString()}
            </p>

            <button
              type="button"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white"
            >
              Withdraw earnings
              <ArrowUpRight size={15} />
            </button>
          </div>
        </motion.div>

        {/* Total Earned */}

        <ReferralStat
          icon={
            <TrendingUp size={20} />
          }
          label="Total Earned"
          value={`₦${totalEarned.toLocaleString()}`}
          description="Lifetime referral earnings"
          delay={0.1}
        />

        {/* Total Referrals */}

        <ReferralStat
          icon={<Users size={20} />}
          label="Total Referrals"
          value={totalReferrals.toString()}
          description="Students in your network"
          delay={0.15}
        />

        {/* Paid Referrals */}

        <ReferralStat
          icon={<Check size={20} />}
          label="Paid Referrals"
          value={paidCount.toString()}
          description="Referrals with qualifying payment"
          delay={0.2}
        />
      </div>

      {/* ========================================================
          NETWORK BREAKDOWN
      ======================================================== */}

      <motion.section
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.22,
          duration: 0.5,
        }}
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Referral Network
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            See how your referral network is distributed across
            different levels.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
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

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
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
      </motion.section>

      {/* ========================================================
          REFERRAL LINK
      ======================================================== */}

      <motion.section
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.25,
          duration: 0.5,
        }}
        className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Share2 size={20} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Your Referral Link
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Share your personal link with
                friends and other students.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          {/* Referral Code */}

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Referral Code
            </p>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span className="font-mono text-base font-bold tracking-wider text-slate-900">
                {referralCode ||
                  "No referral code"}
              </span>
            </div>
          </div>

          {/* Referral Link */}

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Referral Link
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="truncate text-sm text-slate-600">
                  {referralLink ||
                    "Referral link unavailable"}
                </p>
              </div>

              <button
                type="button"
                onClick={
                  copyReferralLink
                }
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
                onClick={
                  shareReferral
                }
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

      {/* ========================================================
          HOW IT WORKS
      ======================================================== */}

      <motion.section
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.3,
          duration: 0.5,
        }}
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="mb-7">
          <h2 className="text-lg font-bold text-slate-900">
            How Referrals Work
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Start growing your network in three simple steps.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <ReferralStep
            number="01"
            title="Share Your Link"
            description="Copy your personal referral link and share it with friends, classmates and other students."
          />

          <ReferralStep
            number="02"
            title="They Join"
            description="When someone registers through your referral link, the referral is automatically connected to your network."
          />

          <ReferralStep
            number="03"
            title="Track & Earn"
            description="Track your referral levels and qualifying referrals from your dashboard."
          />
        </div>
      </motion.section>

      {/* ========================================================
          REFERRAL HISTORY
      ======================================================== */}

      <motion.section
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.35,
          duration: 0.5,
        }}
        className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Referral History
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Students who joined your referral network.
            </p>
          </div>
        </div>

        {referrals.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Users size={27} />
            </div>

            <h3 className="mt-5 text-base font-bold text-slate-900">
              No referrals yet
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Your referral activity will
              appear here when students join
              using your referral link.
            </p>

            <button
              type="button"
              onClick={shareReferral}
              disabled={!referralLink}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Share2 size={17} />
              Invite Someone
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {referrals.map(
              (referral) => {
                const fullName =
                  `${referral.firstName} ${referral.lastName}`.trim();

                const initials =
                  fullName
                    .split(" ")
                    .filter(Boolean)
                    .map(
                      (name) =>
                        name.charAt(0),
                    )
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                return (
                  <div
                    key={referral.id}
                    className="flex items-center justify-between gap-4 px-6 py-5 transition hover:bg-slate-50 sm:px-8"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                        {initials}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900">
                          {fullName}
                        </p>

                        <p className="mt-1 truncate text-sm text-slate-500">
                          {referral.email}
                        </p>
                      </div>
                    </div>

                    <div className="hidden shrink-0 text-right sm:block">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Referral Code
                      </p>

                      <p className="mt-1 font-mono text-sm font-bold text-slate-700">
                        {
                          referral.referralCode
                        }
                      </p>
                    </div>

                    <ChevronRight
                      size={18}
                      className="shrink-0 text-slate-300"
                    />
                  </div>
                );
              },
            )}
          </div>
        )}
      </motion.section>

      {/* ========================================================
          WALLET NOTE
      ======================================================== */}

      <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4">
        <Clock3
          size={18}
          className="mt-0.5 shrink-0 text-blue-600"
        />

        <p className="text-sm leading-6 text-blue-800">
          Referral rewards are credited to your
          wallet according to the qualifying
          activities configured for the referral
          programme.
        </p>
      </div>
    </div>
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
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay,
        duration: 0.45,
      }}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
        {icon}
      </div>

      <p className="mt-5 text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>
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
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {level}
      </p>

      <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>
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
    <div className="relative rounded-2xl border border-slate-100 bg-slate-50 p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-extrabold text-blue-600">
          {number}
        </span>

        <ChevronRight
          size={17}
          className="text-slate-300"
        />
      </div>

      <h3 className="mt-5 text-base font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}