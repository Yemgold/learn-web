



"use client";

import { useState } from "react";
import { AlertCircle, Loader2, Wallet, X } from "lucide-react";
import { useFundWallet } from "@/hooks/wallet/useFundWallet";

interface FundWalletModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  walletId?: string;
}

function getCheckoutUrl(response: unknown): string | undefined {
  if (!response || typeof response !== "object") return undefined;

  const result = response as Record<string, unknown>;
  const nested =
    result.data && typeof result.data === "object"
      ? (result.data as Record<string, unknown>)
      : undefined;

  const candidates = [
    result.checkoutUrl,
    result.paymentUrl,
    result.authorizationUrl,
    result.redirectUrl,
    nested?.checkoutUrl,
    nested?.paymentUrl,
    nested?.authorizationUrl,
    nested?.redirectUrl,
  ];

  return candidates.find(
    (value): value is string =>
      typeof value === "string" &&
      /^https?:\/\//i.test(value),
  );
}

function getErrorMessage(error: unknown): string {
  if (!error || typeof error !== "object") {
    return "Unable to start wallet funding. Please try again.";
  }

  const err = error as {
    message?: string;
    response?: {
      data?: {
        message?: string;
        error?: string;
      };
    };
  };

  return (
    err.response?.data?.message ||
    err.response?.data?.error ||
    err.message ||
    "Unable to start wallet funding. Please try again."
  );
}

export default function FundWalletModal({
  open,
  onOpenChange,
  walletId,
}: FundWalletModalProps) {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const fundWallet = useFundWallet();

  if (!open) return null;

  const parsedAmount = Number(amount);
  const validAmount =
    amount.trim() !== "" &&
    Number.isFinite(parsedAmount) &&
    parsedAmount > 0;

  const handleClose = () => {
    if (fundWallet.isPending) return;

    setAmount("");
    setMessage("");
    fundWallet.reset();
    onOpenChange(false);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setMessage("");

    if (!walletId) {
      setMessage("Your wallet ID is missing. Please reload and try again.");
      return;
    }

    if (!validAmount) {
      setMessage("Enter a valid funding amount.");
      return;
    }

    try {
      const response = await fundWallet.mutateAsync({
        walletId,
        provider: "MONNIFY",
        amount: parsedAmount,
      });

      const checkoutUrl = getCheckoutUrl(response);

      if (checkoutUrl) {
        window.location.assign(checkoutUrl);
        return;
      }

      setMessage(
        "The funding request was submitted, but no checkout URL was returned. Please check the API response before trying again.",
      );
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="fund-wallet-title"
        className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-5 text-white shadow-2xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300">
              <Wallet size={23} />
            </div>

            <div>
              <h2
                id="fund-wallet-title"
                className="text-xl font-bold"
              >
                Fund Your Wallet
              </h2>
              <p className="mt-1 text-sm text-white/50">
                Add money securely through Monnify.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={fundWallet.isPending}
            aria-label="Close funding modal"
            className="rounded-xl p-2 text-white/60 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="fund-amount"
              className="mb-2 block text-sm font-medium text-white/80"
            >
              Amount (NGN)
            </label>

            <div className="flex items-center rounded-2xl border border-white/10 bg-white/5 px-4 focus-within:border-blue-400">
              <span className="text-lg font-semibold text-white/50">
                ₦
              </span>

              <input
                id="fund-amount"
                name="amount"
                type="number"
                min="1"
                step="0.01"
                inputMode="decimal"
                placeholder="Enter amount"
                value={amount}
                onChange={(event) => {
                  setAmount(event.target.value);
                  setMessage("");
                }}
                disabled={fundWallet.isPending}
                required
                className="min-h-14 w-full bg-transparent px-3 text-lg font-semibold text-white outline-none placeholder:text-white/30"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-blue-400/15 bg-blue-500/10 p-4">
            <p className="text-sm font-semibold text-blue-200">
              Payment method: Monnify
            </p>
            <p className="mt-1 text-xs leading-5 text-white/55">
              You will continue to the payment page to complete your
              transaction.
            </p>
          </div>

          {message && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-200"
            >
              <AlertCircle
                size={18}
                className="mt-0.5 shrink-0"
              />
              <p>{message}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={
              !walletId ||
              !validAmount ||
              fundWallet.isPending
            }
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {fundWallet.isPending ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Starting payment...
              </>
            ) : (
              `Continue to Payment${validAmount ? ` · ₦${parsedAmount.toLocaleString("en-NG")}` : ""}`
            )}
          </button>
        </form>
      </section>
    </div>
  );
}
