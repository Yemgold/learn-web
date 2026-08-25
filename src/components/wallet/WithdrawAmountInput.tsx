

"use client";

import { Wallet } from "lucide-react";

interface WithdrawAmountInputProps {
  amount: string;
  balance: number;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function WithdrawAmountInput({
  amount,
  balance,
  onChange,
  disabled = false,
}: WithdrawAmountInputProps) {
  const formattedBalance = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(balance);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label
          htmlFor="withdraw-amount"
          className="text-sm font-semibold text-slate-700"
        >
          Withdrawal Amount
        </label>

        <span className="text-xs text-slate-400">
          Available: {formattedBalance}
        </span>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <span className="text-lg font-semibold text-slate-400">
            ₦
          </span>
        </div>

        <input
          id="withdraw-amount"
          type="number"
          min="1"
          step="1"
          value={amount}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          placeholder="0.00"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-10 pr-4 text-lg font-semibold text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <button
        type="button"
        disabled={disabled || balance <= 0}
        onClick={() => onChange(String(balance))}
        className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Wallet className="h-3.5 w-3.5" />
        Withdraw available balance
      </button>
    </div>
  );
}