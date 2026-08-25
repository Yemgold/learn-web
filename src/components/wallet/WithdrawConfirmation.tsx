


"use client";

import {
  AlertTriangle,
  ArrowDownToLine,
  CheckCircle2,
} from "lucide-react";

interface WithdrawConfirmationProps {
  amount: number;
  balance: number;
}

export default function WithdrawConfirmation({
  amount,
  balance,
}: WithdrawConfirmationProps) {
  const remainingBalance = balance - amount;

  const formatAmount = (value: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(value);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-xl bg-amber-50 p-4">
        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />

        <p className="text-sm leading-5 text-amber-800">
          Please review your withdrawal before confirming.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Withdrawal amount
          </span>

          <span className="font-bold text-slate-900">
            {formatAmount(amount)}
          </span>
        </div>

        <div className="my-4 border-t border-slate-200" />

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Remaining balance
          </span>

          <span className="font-bold text-slate-900">
            {formatAmount(remainingBalance)}
          </span>
        </div>
      </div>

      <div className="flex items-start gap-3 text-sm text-slate-500">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />

        <p>
          Your withdrawal request will be sent to the backend for
          processing.
        </p>
      </div>
    </div>
  );
}