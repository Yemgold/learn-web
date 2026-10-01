


"use client";

import { useState } from "react";

import { useWallet } from "@/hooks/wallet/useWallet";
import { useWalletTransactions } from "@/hooks/wallet/useWalletTransactions";

import WalletHeader from "@/components/wallet/WalletHeader";
import WalletBalanceCard from "@/components/wallet/WalletBalanceCard";
import WalletSummaryCards from "@/components/wallet/WalletSummaryCards";
import WalletQuickActions from "@/components/wallet/WalletQuickActions";
import WalletTransactions from "@/components/wallet/WalletTransactions";
import WithdrawFundsModal from "@/components/wallet/WithdrawFundsModal";

export default function WalletPage() {
  const [withdrawOpen, setWithdrawOpen] =
    useState(false);

  const {
    wallet,
    balance,
    isLoading: walletLoading,
    isError: walletError,
  } = useWallet();

  const {
    transactions,
    isLoading: transactionsLoading,
    totalCount,
  } = useWalletTransactions();

  /* ============================================================
     FUND WALLET
  ============================================================ */

  const handleFundWallet = () => {
    /*
     * Temporary action.
     *
     * We will connect this to Paystack/funding modal
     * once the funding component/API is confirmed.
     */
    console.log(
      "[Wallet] Fund Wallet clicked",
    );
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* ======================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.14),transparent_35%)]" />

        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(15,23,42,0.1),rgba(2,6,23,0.7))]" />
      </div>

      {/* ======================================================
          PAGE CONTENT

          The horizontal padding prevents the first and last
          cards from touching the sides of the container.
      ====================================================== */}

      <div className="relative w-full px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6">
        <div className="mx-auto w-full max-w-7xl space-y-6">
          {/* ==================================================
              HEADER
          ================================================== */}

          <WalletHeader
            onWithdraw={() =>
              setWithdrawOpen(true)
            }
          />

          {/* ==================================================
              BALANCE
          ================================================== */}

          <section className="w-full min-w-0">
            <WalletBalanceCard
              balance={balance}
              isLoading={walletLoading}
              onWithdraw={() =>
                setWithdrawOpen(true)
              }
              onFundWallet={
                handleFundWallet
              }
            />
          </section>

          {/* ==================================================
              SUMMARY
          ================================================== */}

          <section className="w-full min-w-0">
            <WalletSummaryCards
              balance={balance}
              transactions={transactions}
            />
          </section>

          {/* ==================================================
              QUICK ACTIONS
          ================================================== */}

          <section className="w-full min-w-0">
            <WalletQuickActions />
          </section>

          {/* ==================================================
              TRANSACTIONS
          ================================================== */}

          <section className="w-full min-w-0">
            <WalletTransactions
              transactions={transactions}
              isLoading={
                transactionsLoading
              }
              totalCount={totalCount}
            />
          </section>
        </div>
      </div>

      {/* ======================================================
          WITHDRAWAL MODAL
      ====================================================== */}

      <WithdrawFundsModal
        open={withdrawOpen}
        onOpenChange={
          setWithdrawOpen
        }
        balance={balance}
        walletId={
          wallet?._id
        }
      />
    </main>
  );
}