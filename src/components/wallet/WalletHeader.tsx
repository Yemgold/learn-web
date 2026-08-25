


"use client";

import { motion } from "framer-motion";
import {
  ArrowDownToLine,
  Plus,
  Wallet as WalletIcon,
} from "lucide-react";

interface WalletHeaderProps {
  onWithdraw: () => void;
  onFundWallet?: () => void;
}

export default function WalletHeader({
  onWithdraw,
  onFundWallet,
}: WalletHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      {/* ============================================================
          TITLE
      ============================================================ */}

      <div>
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
            <WalletIcon className="h-5 w-5 text-blue-600" />
          </div>

          <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Student Wallet
          </span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          My Wallet
        </h1>

        <p className="mt-1 max-w-xl text-sm text-slate-500 sm:text-base">
          Manage your earnings, rewards, referral income and wallet
          transactions.
        </p>
      </div>

      {/* ============================================================
          ACTIONS
      ============================================================ */}

      <div className="flex flex-col gap-2 sm:flex-row">
        {/* <button
          type="button"
          onClick={onWithdraw}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.98]"
        >
          <ArrowDownToLine className="h-4 w-4" />
          Withdraw 
        </button> */}

        {onFundWallet && (
          <button
            type="button"
            onClick={onFundWallet}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Add Funds
          </button>
        )}
      </div>
    </motion.div>
  );
}