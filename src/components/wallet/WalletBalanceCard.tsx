




"use client";

import { motion } from "framer-motion";
import {
  ArrowDownToLine,
  Plus,
  ShieldCheck,
  Wallet as WalletIcon,
} from "lucide-react";

interface WalletBalanceCardProps {
  balance: number;
  isLoading?: boolean;
  onWithdraw: () => void;
  onFundWallet?: () => void;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function WalletBalanceCard({
  balance,
  isLoading = false,
  onWithdraw,
  onFundWallet,
}: WalletBalanceCardProps) {
  const formattedBalance = formatCurrency(balance);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 text-white shadow-xl sm:p-8"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative z-10">
        {/* Label */}
        <div className="flex items-center gap-2 text-sm text-white/60">
          <WalletIcon className="h-4 w-4" />
          Available Balance
        </div>

        <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          {/* Balance */}
          <div>
            {isLoading ? (
              <div className="h-12 w-56 animate-pulse rounded-lg bg-white/10 sm:h-14" />
            ) : (
              <p className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                {formattedBalance}
              </p>
            )}

            <div className="mt-3 flex items-center gap-2 text-xs text-white/50">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Your wallet is secure</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onWithdraw}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm font-semibold backdrop-blur transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowDownToLine className="h-4 w-4" />
              Withdraw 
            </button>

            {onFundWallet && (

              <button
                type="button"
                onClick={onFundWallet}
                disabled={isLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                Fund Wallet
              </button>
              
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}