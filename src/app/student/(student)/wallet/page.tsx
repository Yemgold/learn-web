

"use client";

import { useState } from "react";
import {
  ChevronDown,
  Wallet,
  AlertCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { useAuthStore } from "@/stores";
import { useWallet } from "@/hooks/wallet/useWallet";
import { useWalletTransactions } from "@/hooks/wallet/useWalletTransactions";

import WalletHeader from "@/components/wallet/WalletHeader";
import WalletBalanceCard from "@/components/wallet/WalletBalanceCard";
import WalletSummaryCards from "@/components/wallet/WalletSummaryCards";
import WalletQuickActions from "@/components/wallet/WalletQuickActions";
import WalletTransactions from "@/components/wallet/WalletTransactions";
import WithdrawFundsModal from "@/components/wallet/WithdrawFundsModal";
import FundWalletModal from "@/components/wallet/FundWalletModal";

export default function WalletPage() {
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [fundOpen, setFundOpen] = useState(false);

  // Collapsible sections
  const [showSummary, setShowSummary] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [showTransactions, setShowTransactions] = useState(false);

  // Get the authenticated user's ID.
  const userId = useAuthStore((state) => {
    const user = state.user as
      | { _id?: string; id?: string }
      | null
      | undefined;

    return user?._id ?? user?.id;
  });

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
    if (walletLoading) return;

    if (walletError || !wallet?._id) {
      console.error(
        "[Wallet] Cannot fund wallet: wallet information is unavailable.",
      );
      return;
    }

    setFundOpen(true);
  };

  /* ============================================================
     WITHDRAW FUNDS
  ============================================================ */

  const handleWithdraw = () => {
    if (walletLoading) return;

    if (walletError || !wallet?._id) {
      console.error(
        "[Wallet] Cannot withdraw: wallet information is unavailable.",
      );
      return;
    }

    if (!userId) {
      console.error(
        "[Wallet] Cannot withdraw: authenticated user ID is unavailable.",
      );
      return;
    }

    setWithdrawOpen(true);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* BACKGROUND */}

      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.14),transparent_35%)]" />

        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(15,23,42,0.1),rgba(2,6,23,0.7))]" />
      </div>

      {/* PAGE CONTENT */}

      <div className="relative w-full px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6">
        <div className="mx-auto w-full max-w-7xl space-y-6">
          {/* HEADER */}

          <WalletHeader onWithdraw={handleWithdraw} />

          {/* WALLET ERROR */}

          {walletError && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200"
            >
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

              <div>
                <p className="font-semibold">
                  Unable to load your wallet
                </p>

                <p className="mt-1 text-red-200/80">
                  Please refresh the page and try again. Funding and
                  withdrawal actions are unavailable until your wallet
                  information loads successfully.
                </p>
              </div>
            </div>
          )}

          {/* AUTHENTICATION WARNING */}

          {!userId && (
            <div
              role="alert"
              className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100"
            >
              Your user information is unavailable. Please sign in again
              before creating a bank account or requesting a withdrawal.
            </div>
          )}

          {/* BALANCE */}

          <section className="w-full min-w-0">
            <WalletBalanceCard
              balance={balance}
              isLoading={walletLoading}
              onWithdraw={handleWithdraw}
              onFundWallet={handleFundWallet}
            />
          </section>

          {/* QUICK ACTIONS */}

          <section className="w-full min-w-0 rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                  <Wallet size={19} />
                </div>

                <div>
                  <h2 className="font-bold text-white">
                    Quick Actions
                  </h2>

                  <p className="mt-0.5 text-sm text-white/50">
                    Manage your wallet.
                  </p>
                </div>
              </div>

              <ViewDetailsButton
                open={showQuickActions}
                onClick={() =>
                  setShowQuickActions((value) => !value)
                }
                label="View Actions"
              />
            </div>

            <AnimatePresence initial={false}>
              {showQuickActions && (
                <motion.div
                  key="wallet-quick-actions"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="pt-5">
                    <WalletQuickActions />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* SUMMARY CARDS */}

          <section className="w-full min-w-0 rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-bold text-white">
                  Wallet Summary
                </h2>

                <p className="mt-0.5 text-sm text-white/50">
                  Review your wallet activity at a glance.
                </p>
              </div>

              <ViewDetailsButton
                open={showSummary}
                onClick={() =>
                  setShowSummary((value) => !value)
                }
                label="View Summary"
              />
            </div>

            <AnimatePresence initial={false}>
              {showSummary && (
                <motion.div
                  key="wallet-summary"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="pt-5">
                    <WalletSummaryCards
                      balance={balance}
                      transactions={transactions}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* TRANSACTION HISTORY */}

          <section className="w-full min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-bold text-white">
                  Transaction History
                </h2>

                <p className="mt-0.5 text-sm text-white/50">
                  {transactionsLoading
                    ? "Loading your transactions..."
                    : `${totalCount} transaction${
                        totalCount === 1 ? "" : "s"
                      } available`}
                </p>
              </div>

              <ViewDetailsButton
                open={showTransactions}
                onClick={() =>
                  setShowTransactions((value) => !value)
                }
                label="View Transactions"
              />
            </div>

            <AnimatePresence initial={false}>
              {showTransactions && (
                <motion.div
                  key="wallet-transactions"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="pt-5">
                    <WalletTransactions
                      transactions={transactions}
                      isLoading={transactionsLoading}
                      totalCount={totalCount}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </div>

      {/* FUND WALLET MODAL */}

      <FundWalletModal
        open={fundOpen}
        onOpenChange={setFundOpen}
        walletId={wallet?._id}
      />

      {/* WITHDRAWAL + BANK ACCOUNT CREATION MODAL */}

      <WithdrawFundsModal
        open={withdrawOpen}
        onOpenChange={setWithdrawOpen}
        balance={balance}
        walletId={wallet?._id}
        userId={userId}
      />
    </main>
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
      className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
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
























// ///api/v1/wallets/fund-wallet-by-walletId/{walletId}/{provider}



// "use client";

// import { useState } from "react";
// import { ChevronDown, Wallet } from "lucide-react";
// import { AnimatePresence, motion } from "framer-motion";

// import { useWallet } from "@/hooks/wallet/useWallet";
// import { useWalletTransactions } from "@/hooks/wallet/useWalletTransactions";

// import WalletHeader from "@/components/wallet/WalletHeader";
// import WalletBalanceCard from "@/components/wallet/WalletBalanceCard";
// import WalletSummaryCards from "@/components/wallet/WalletSummaryCards";
// import WalletQuickActions from "@/components/wallet/WalletQuickActions";
// import WalletTransactions from "@/components/wallet/WalletTransactions";
// import WithdrawFundsModal from "@/components/wallet/WithdrawFundsModal";
// import FundWalletModal from "@/components/wallet/FundWalletModal";

// export default function WalletPage() {
//   const [withdrawOpen, setWithdrawOpen] = useState(false);

//   // Collapsible sections
//   const [showSummary, setShowSummary] = useState(false);
//   const [showQuickActions, setShowQuickActions] = useState(true);
//   const [showTransactions, setShowTransactions] = useState(false);

//   const [fundOpen, setFundOpen] = useState(false);

//   const {
//     wallet,
//     balance,
//     isLoading: walletLoading,
//     isError: walletError,
//   } = useWallet();

//   const {
//     transactions,
//     isLoading: transactionsLoading,
//     totalCount,
//   } = useWalletTransactions();

//   /* ============================================================
//      FUND WALLET
//   ============================================================ */

//  const handleFundWallet = () => {
//   if (!wallet?._id) {
//     console.error("[Wallet] Cannot fund wallet: wallet ID is missing.");
//     return;
//   }

//   setFundOpen(true);
// };

//   return (
//     <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
//       {/* BACKGROUND */}

//       <div className="pointer-events-none fixed inset-0">
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.14),transparent_35%)]" />

//         <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(15,23,42,0.1),rgba(2,6,23,0.7))]" />
//       </div>

//       {/* PAGE CONTENT */}

//       <div className="relative w-full px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6">
//         <div className="mx-auto w-full max-w-7xl space-y-6">
//           {/* HEADER */}

//           <WalletHeader
//             onWithdraw={() => setWithdrawOpen(true)}
//           />

//           {/* WALLET ERROR */}

//           {walletError && (
//             <div
//               role="alert"
//               className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200"
//             >
//               We could not load your wallet information. Please refresh the page and try again.
//             </div>
//           )}

//           {/* BALANCE */}

//           <section className="w-full min-w-0">
//             <WalletBalanceCard
//               balance={balance}
//               isLoading={walletLoading}
//               onWithdraw={() => setWithdrawOpen(true)}
//               onFundWallet={handleFundWallet}
//             />
//           </section>

//           {/* QUICK ACTIONS */}

//           <section className="w-full min-w-0 rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
//             <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
//                   <Wallet size={19} />
//                 </div>

//                 <div>
//                   <h2 className="font-bold text-white">
//                     Quick Actions
//                   </h2>

//                   <p className="mt-0.5 text-sm text-white/50">
//                     Manage your wallet.
//                   </p>
//                 </div>
//               </div>

//               <ViewDetailsButton
//                 open={showQuickActions}
//                 onClick={() =>
//                   setShowQuickActions((value) => !value)
//                 }
//                 label="View Actions"
//               />
//             </div>

//             <AnimatePresence initial={false}>
//               {showQuickActions && (
//                 <motion.div
//                   key="wallet-quick-actions"
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: "auto" }}
//                   exit={{ opacity: 0, height: 0 }}
//                   transition={{ duration: 0.25 }}
//                   className="overflow-hidden"
//                 >
//                   <div className="pt-5">
//                     <WalletQuickActions />
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </section>

//           {/* SUMMARY CARDS */}

//           <section className="w-full min-w-0 rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
//             <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//               <div>
//                 <h2 className="font-bold text-white">
//                   Wallet Summary
//                 </h2>

//                 <p className="mt-0.5 text-sm text-white/50">
//                   Review your wallet activity at a glance.
//                 </p>
//               </div>

//               <ViewDetailsButton
//                 open={showSummary}
//                 onClick={() =>
//                   setShowSummary((value) => !value)
//                 }
//                 label="View Summary"
//               />
//             </div>

//             <AnimatePresence initial={false}>
//               {showSummary && (
//                 <motion.div
//                   key="wallet-summary"
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: "auto" }}
//                   exit={{ opacity: 0, height: 0 }}
//                   transition={{ duration: 0.25 }}
//                   className="overflow-hidden"
//                 >
//                   <div className="pt-5">
//                     <WalletSummaryCards
//                       balance={balance}
//                       transactions={transactions}
//                     />
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </section>

//           {/* TRANSACTION HISTORY */}

//           <section className="w-full min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
//             <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//               <div>
//                 <h2 className="font-bold text-white">
//                   Transaction History
//                 </h2>

//                 <p className="mt-0.5 text-sm text-white/50">
//                   {transactionsLoading
//                     ? "Loading your transactions..."
//                     : `${totalCount} transaction${totalCount === 1 ? "" : "s"} available`}
//                 </p>
//               </div>

//               <ViewDetailsButton
//                 open={showTransactions}
//                 onClick={() =>
//                   setShowTransactions((value) => !value)
//                 }
//                 label="View Transactions"
//               />
//             </div>

//             <AnimatePresence initial={false}>
//               {showTransactions && (
//                 <motion.div
//                   key="wallet-transactions"
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: "auto" }}
//                   exit={{ opacity: 0, height: 0 }}
//                   transition={{ duration: 0.25 }}
//                   className="overflow-hidden"
//                 >
//                   <div className="pt-5">
//                     <WalletTransactions
//                       transactions={transactions}
//                       isLoading={transactionsLoading}
//                       totalCount={totalCount}
//                     />
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </section>
//         </div>
//       </div>
     
//      {/* FUND WALLET MODAL */}

// <FundWalletModal
//   open={fundOpen}
//   onOpenChange={setFundOpen}
//   walletId={wallet?._id}
// />



//       {/* WITHDRAWAL MODAL */}

//       <WithdrawFundsModal
//         open={withdrawOpen}
//         onOpenChange={setWithdrawOpen}
//         balance={balance}
//         walletId={wallet?._id}
//       />
//     </main>
//   );
// }

// /* ============================================================
//    VIEW DETAILS BUTTON
// ============================================================ */

// interface ViewDetailsButtonProps {
//   open: boolean;
//   onClick: () => void;
//   label: string;
// }

// function ViewDetailsButton({
//   open,
//   onClick,
//   label,
// }: ViewDetailsButtonProps) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       aria-expanded={open}
//       className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
//     >
//       {open ? "Hide Details" : label}

//       <ChevronDown
//         size={16}
//         className={`transition-transform duration-200 ${
//           open ? "rotate-180" : ""
//         }`}
//       />
//     </button>
//   );
// }
