



"use client";

import { useEffect, useState } from "react";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  X,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  canRedeemReward,
  formatRewardPoints,
} from "@/data/cbt-wallet/student-rewards";

import type { StudentReward } from "@/types/cbt-wallet/reward";

interface RedeemRewardModalProps {
  open: boolean;
  reward: StudentReward | null;
  balance: number;
  onClose: () => void;
  onRedeem?: (data: {
    reward: StudentReward;
    deliveryAddress?: string;
    phoneNumber?: string;
  }) => Promise<void> | void;
}

type ModalStep = "confirm" | "delivery" | "success";

export default function RedeemRewardModal({
  open,
  reward,
  balance,
  onClose,
  onRedeem,
}: RedeemRewardModalProps) {
  const [step, setStep] = useState<ModalStep>("confirm");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requiresDelivery = Boolean(reward?.deliveryAvailable);

  const canRedeem = reward
    ? canRedeemReward(reward, balance)
    : false;

  const remainingBalance = reward
    ? balance - reward.points
    : balance;

  useEffect(() => {
    if (!open) {
      setStep("confirm");
      setDeliveryAddress("");
      setPhoneNumber("");
      setError("");
      setIsSubmitting(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, isSubmitting, onClose]);

  if (!open || !reward) {
    return null;
  }

  const handleContinue = () => {
    setError("");

    if (!canRedeem) {
      setError(
        "You do not have enough CBT Points or this reward is currently unavailable.",
      );
      return;
    }

    if (requiresDelivery) {
      setStep("delivery");
      return;
    }

    handleRedeem();
  };

  const handleDeliveryContinue = () => {
    setError("");

    if (!deliveryAddress.trim()) {
      setError("Please enter your delivery address.");
      return;
    }

    if (!phoneNumber.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (phoneNumber.replace(/\D/g, "").length < 7) {
      setError("Please enter a valid phone number.");
      return;
    }

    handleRedeem();
  };

  const handleRedeem = async () => {
    if (!canRedeem) {
      setError(
        "This reward cannot be redeemed with your current balance.",
      );
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await onRedeem?.({
        reward,
        deliveryAddress: requiresDelivery
          ? deliveryAddress.trim()
          : undefined,
        phoneNumber: requiresDelivery
          ? phoneNumber.trim()
          : undefined,
      });

      setStep("success");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "We could not complete the redemption. Please try again.";

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setError("");

    if (step === "delivery") {
      setStep("confirm");
    }
  };

  const handleDone = () => {
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="redeem-reward-title"
        className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-slate-800 bg-slate-950 shadow-2xl shadow-black/50 sm:rounded-3xl"
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div className="flex items-center gap-3">
            {step === "delivery" && (
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
                aria-label="Go back"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}

            <div>
              <p
                id="redeem-reward-title"
                className="text-base font-bold text-white"
              >
                {step === "confirm" && "Redeem Reward"}
                {step === "delivery" && "Delivery Details"}
                {step === "success" && "Reward Redeemed"}
              </p>

              <p className="text-xs text-slate-500">
                {step === "confirm" &&
                  "Review your reward before redeeming"}
                {step === "delivery" &&
                  "Tell us where to deliver your reward"}
                {step === "success" &&
                  "Your redemption has been submitted"}
              </p>
            </div>
          </div>

          {step !== "success" && (
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="overflow-y-auto px-5 py-5">
          {step === "confirm" && (
            <ConfirmStep
              reward={reward}
              balance={balance}
              remainingBalance={remainingBalance}
              canRedeem={canRedeem}
              error={error}
              onContinue={handleContinue}
              isSubmitting={isSubmitting}
              requiresDelivery={requiresDelivery}
            />
          )}

          {step === "delivery" && (
            <DeliveryStep
              reward={reward}
              deliveryAddress={deliveryAddress}
              phoneNumber={phoneNumber}
              setDeliveryAddress={setDeliveryAddress}
              setPhoneNumber={setPhoneNumber}
              error={error}
              onContinue={handleDeliveryContinue}
              isSubmitting={isSubmitting}
            />
          )}

          {step === "success" && (
            <SuccessStep
              reward={reward}
              remainingBalance={remainingBalance}
              onDone={handleDone}
            />
          )}
        </div>
      </div>
    </div>
  );
}

interface ConfirmStepProps {
  reward: StudentReward;
  balance: number;
  remainingBalance: number;
  canRedeem: boolean;
  error: string;
  onContinue: () => void;
  isSubmitting: boolean;
  requiresDelivery: boolean;
}

function ConfirmStep({
  reward,
  balance,
  remainingBalance,
  canRedeem,
  error,
  onContinue,
  isSubmitting,
  requiresDelivery,
}: ConfirmStepProps) {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-slate-900 to-cyan-500/5 p-5">
        <div className="mb-4 flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400 ring-1 ring-inset ring-violet-500/20">
            <ShoppingBag className="h-8 w-8" />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-400">
              Reward
            </p>

            <h3 className="mt-1 text-lg font-bold text-white">
              {reward.title}
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              {reward.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Reward cost
            </p>

            <p className="mt-1 text-lg font-black text-violet-300">
              {formatRewardPoints(reward.points)}
            </p>

            <p className="text-[10px] text-slate-500">
              CBT Points
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Your balance
            </p>

            <p className="mt-1 text-lg font-black text-white">
              {formatRewardPoints(balance)}
            </p>

            <p className="text-[10px] text-slate-500">
              CBT Points
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-slate-400">
            Current balance
          </span>

          <span className="text-sm font-semibold text-white">
            {formatRewardPoints(balance)} pts
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-slate-800 py-2">
          <span className="text-sm text-slate-400">
            Reward cost
          </span>

          <span className="text-sm font-semibold text-rose-400">
            -{formatRewardPoints(reward.points)} pts
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-slate-800 pt-3">
          <span className="text-sm font-semibold text-white">
            Remaining balance
          </span>

          <span
            className={`text-base font-bold ${
              remainingBalance >= 0
                ? "text-emerald-400"
                : "text-rose-400"
            }`}
          >
            {formatRewardPoints(Math.max(0, remainingBalance))} pts
          </span>
        </div>
      </div>

      {requiresDelivery ? (
        <div className="flex gap-3 rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-4">
          <Truck className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />

          <div>
            <p className="text-sm font-semibold text-cyan-300">
              Physical reward
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              You&apos;ll be asked for your delivery address and
              phone number on the next step.
            </p>

            {reward.deliveryTime && (
              <p className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
                <Clock3 className="h-3.5 w-3.5" />
                Estimated delivery: {reward.deliveryTime}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex gap-3 rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-4">
          <Zap className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />

          <div>
            <p className="text-sm font-semibold text-emerald-300">
              Digital / education reward
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              This reward does not require physical delivery.
            </p>
          </div>
        </div>
      )}

      {error && (
        <ErrorMessage message={error} />
      )}

      {!canRedeem && !error && (
        <ErrorMessage message="You do not currently have enough CBT Points to redeem this reward, or the reward is unavailable." />
      )}

      <div className="flex items-start gap-2 rounded-xl bg-slate-900 px-3 py-3">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />

        <p className="text-[11px] leading-5 text-slate-500">
          Please review your reward carefully. Once submitted,
          the CBT Points will be deducted from your wallet.
        </p>
      </div>

      <Button
        type="button"
        onClick={onContinue}
        disabled={!canRedeem || isSubmitting}
        className="h-12 w-full rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 font-semibold text-white shadow-lg shadow-violet-900/20 hover:from-violet-500 hover:to-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <LoadingSpinner />
            Processing...
          </>
        ) : (
          <>
            <Zap className="mr-2 h-4 w-4" />
            Continue to Redeem
          </>
        )}
      </Button>
    </div>
  );
}

interface DeliveryStepProps {
  reward: StudentReward;
  deliveryAddress: string;
  phoneNumber: string;
  setDeliveryAddress: (value: string) => void;
  setPhoneNumber: (value: string) => void;
  error: string;
  onContinue: () => void;
  isSubmitting: boolean;
}

function DeliveryStep({
  reward,
  deliveryAddress,
  phoneNumber,
  setDeliveryAddress,
  setPhoneNumber,
  error,
  onContinue,
  isSubmitting,
}: DeliveryStepProps) {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
            <Package className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              You are redeeming
            </p>

            <p className="truncate text-sm font-semibold text-white">
              {reward.title}
            </p>

            <p className="text-xs text-violet-300">
              {formatRewardPoints(reward.points)} CBT Points
            </p>
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="delivery-address"
          className="mb-2 block text-sm font-medium text-slate-200"
        >
          Delivery Address
        </label>

        <div className="relative">
          <MapPin className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-500" />

          <textarea
            id="delivery-address"
            value={deliveryAddress}
            onChange={(event) =>
              setDeliveryAddress(event.target.value)
            }
            placeholder="Enter your full delivery address"
            rows={4}
            className="w-full resize-none rounded-xl border border-slate-800 bg-slate-900 px-10 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10"
          />
        </div>

        <p className="mt-1.5 text-[11px] text-slate-500">
          Include your area, city, state, and any useful delivery
          instructions.
        </p>
      </div>

      <div>
        <label
          htmlFor="delivery-phone"
          className="mb-2 block text-sm font-medium text-slate-200"
        >
          Phone Number
        </label>

        <Input
          id="delivery-phone"
          type="tel"
          value={phoneNumber}
          onChange={(event) =>
            setPhoneNumber(event.target.value)
          }
          placeholder="08012345678"
          className="h-11 rounded-xl border-slate-800 bg-slate-900 text-white placeholder:text-slate-600 focus:border-violet-500/50 focus:ring-violet-500/10"
        />

        <p className="mt-1.5 text-[11px] text-slate-500">
          We may contact you to arrange delivery.
        </p>
      </div>

      {reward.deliveryTime && (
        <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-3">
          <Clock3 className="h-4 w-4 text-cyan-400" />

          <div>
            <p className="text-xs font-medium text-slate-300">
              Estimated delivery
            </p>

            <p className="text-[11px] text-slate-500">
              {reward.deliveryTime}
            </p>
          </div>
        </div>
      )}

      {error && <ErrorMessage message={error} />}

      <Button
        type="button"
        onClick={onContinue}
        disabled={isSubmitting}
        className="h-12 w-full rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 font-semibold text-white shadow-lg shadow-violet-900/20 hover:from-violet-500 hover:to-violet-400"
      >
        {isSubmitting ? (
          <>
            <LoadingSpinner />
            Submitting...
          </>
        ) : (
          <>
            <Truck className="mr-2 h-4 w-4" />
            Confirm Redemption
          </>
        )}
      </Button>
    </div>
  );
}

interface SuccessStepProps {
  reward: StudentReward;
  remainingBalance: number;
  onDone: () => void;
}

function SuccessStep({
  reward,
  remainingBalance,
  onDone,
}: SuccessStepProps) {
  return (
    <div className="py-4 text-center">
      <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 ring-8 ring-emerald-500/5">
        <CheckCircle2 className="h-10 w-10" />
      </div>

      <div className="mx-auto max-w-sm">
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
          <Sparkles className="h-3 w-3" />
          Redemption successful
        </div>

        <h3 className="mt-3 text-xl font-bold text-white">
          You redeemed {reward.title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Your reward redemption has been submitted successfully.
          Your CBT Points have been deducted from your wallet.
        </p>
      </div>

      <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-left">
        <div className="flex items-center justify-between py-2">
          <span className="text-xs text-slate-500">
            Reward
          </span>

          <span className="max-w-[60%] truncate text-xs font-semibold text-white">
            {reward.title}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-slate-800 py-2">
          <span className="text-xs text-slate-500">
            Points used
          </span>

          <span className="text-xs font-semibold text-rose-400">
            -{formatRewardPoints(reward.points)}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-slate-800 pt-3">
          <span className="text-xs font-semibold text-white">
            Remaining balance
          </span>

          <span className="text-sm font-bold text-emerald-400">
            {formatRewardPoints(Math.max(0, remainingBalance))} pts
          </span>
        </div>
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-4 text-left">
        <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />

        <div>
          <p className="text-sm font-semibold text-cyan-300">
            What happens next?
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            {reward.deliveryAvailable
              ? "Our team will process your reward and arrange delivery using the details you provided."
              : "Your digital or education reward will be processed and made available to you."}
          </p>
        </div>
      </div>

      <Button
        type="button"
        onClick={onDone}
        className="mt-6 h-12 w-full rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 font-semibold text-white hover:from-violet-500 hover:to-violet-400"
      >
        Done
      </Button>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 text-xs text-rose-300"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <svg
      className="mr-2 h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="3"
        className="opacity-25"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="opacity-90"
      />
    </svg>
  );
}