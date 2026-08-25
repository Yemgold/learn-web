





"use client";

import { useEffect, useState } from "react";
import { Loader2, Wallet, X, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useWithdrawFunds } from "@/hooks/wallet/useWithdrawFunds";

interface WithdrawFundsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  balance: number;
  walletId?: string;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function WithdrawFundsModal({
  open,
  onOpenChange,
  balance,
  walletId,
}: WithdrawFundsModalProps) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const withdrawMutation = useWithdrawFunds();

  /*
   * Reset the form whenever the modal closes.
   */
  useEffect(() => {
    if (!open) {
      setAmount("");
      setError("");
    }
  }, [open]);

  const numericAmount = Number(amount);

  const validateAmount = () => {
    setError("");

    if (!walletId) {
      setError("Wallet information is unavailable. Please refresh the page.");
      return false;
    }

    if (!amount.trim()) {
      setError("Please enter the amount you want to withdraw.");
      return false;
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid withdrawal amount.");
      return false;
    }

    if (numericAmount < 100) {
      setError("Minimum withdrawal amount is ₦100.");
      return false;
    }

    if (numericAmount > balance) {
      setError(
        `Insufficient balance. Your available balance is ${formatCurrency(
          balance,
        )}.`,
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateAmount()) {
      return;
    }

    try {
      await withdrawMutation.mutateAsync({
        amount: numericAmount,
        walletId: walletId!,
      });

      onOpenChange(false);
    } catch (error: any) {
      const backendMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to process your withdrawal request.";

      setError(backendMessage);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              onOpenChange(false);
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* ========================================================
                HEADER
            ======================================================== */}

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                  <Wallet className="h-5 w-5 text-blue-600" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Withdraw Funds
                  </h2>

                  <p className="text-xs text-slate-500">
                    Transfer money from your wallet
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={withdrawMutation.isPending}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* ========================================================
                BODY
            ======================================================== */}

            <div className="space-y-5 p-5">
              {/* Balance */}
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">
                  Available Balance
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900">
                  {formatCurrency(balance)}
                </p>
              </div>

              {/* Amount */}
              <div>
                <label
                  htmlFor="withdrawal-amount"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Withdrawal Amount
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
                    ₦
                  </span>

                  <input
                    id="withdrawal-amount"
                    type="number"
                    min="100"
                    step="1"
                    value={amount}
                    onChange={(event) => {
                      setAmount(event.target.value);
                      setError("");
                    }}
                    disabled={withdrawMutation.isPending}
                    placeholder="Enter amount"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:bg-slate-50"
                  />
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Minimum withdrawal: ₦100
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />

                  <p className="text-sm leading-5 text-red-600">
                    {error}
                  </p>
                </div>
              )}

              {/* Confirmation */}
              {numericAmount > 0 &&
                numericAmount <= balance &&
                !error && (
                  <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                    <p className="text-xs text-blue-600">
                      You are requesting to withdraw
                    </p>

                    <p className="mt-1 text-lg font-bold text-blue-900">
                      {formatCurrency(numericAmount)}
                    </p>
                  </div>
                )}
            </div>

            {/* ========================================================
                FOOTER
            ======================================================== */}

            <div className="flex gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={withdrawMutation.isPending}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={
                  withdrawMutation.isPending ||
                  !walletId ||
                  !amount ||
                  numericAmount <= 0
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {withdrawMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Request Withdrawal"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}