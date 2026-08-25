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
    <div className="space-y-8">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <WalletHeader
        onWithdraw={() =>
          setWithdrawOpen(true)
        }
      />

      {/* ======================================================
          BALANCE
      ====================================================== */}

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

      {/* ======================================================
          SUMMARY
      ====================================================== */}

      <WalletSummaryCards
        balance={balance}
        transactions={transactions}
      />

      {/* ======================================================
          QUICK ACTIONS
      ====================================================== */}

      <WalletQuickActions />

      {/* ======================================================
          TRANSACTIONS
      ====================================================== */}

      <WalletTransactions
        transactions={transactions}
        isLoading={
          transactionsLoading
        }
        totalCount={totalCount}
      />

      {/* ======================================================
          WITHDRAWAL
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
    </div>
  );
}




// "use client";

// import { useState } from "react";

// import { useWallet } from "@/hooks/wallet/useWallet";
// import { useWalletTransactions } from "@/hooks/wallet/useWalletTransactions";

// import WalletHeader from "@/components/wallet/WalletHeader";
// import WalletBalanceCard from "@/components/wallet/WalletBalanceCard";
// import WalletSummaryCards from "@/components/wallet/WalletSummaryCards";
// import WalletQuickActions from "@/components/wallet/WalletQuickActions";
// import WalletTransactions from "@/components/wallet/WalletTransactions";
// import WithdrawFundsModal from "@/components/wallet/WithdrawFundsModal";


// export default function WalletPage() {
//   const [withdrawOpen, setWithdrawOpen] = useState(false);

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

//   return (
//     <div className="space-y-8">

//       {/* Header */}
//       <WalletHeader
//         onWithdraw={() => setWithdrawOpen(true)}
//       />

//       {/* Balance */}
//       <WalletBalanceCard
//         balance={balance}
//         isLoading={walletLoading}
//         onWithdraw={() => setWithdrawOpen(true)}
//       />

//       {/* Summary */}
//       <WalletSummaryCards
//         balance={balance}
//         transactions={transactions}
//       />

//       {/* Referral / Arena actions */}
//       <WalletQuickActions />

//       {/* Transactions */}
//       <WalletTransactions
//         transactions={transactions}
//         isLoading={transactionsLoading}
//         totalCount={totalCount}
//       />

//       {/* Withdrawal */}
//       <WithdrawFundsModal
//         open={withdrawOpen}
//         onOpenChange={setWithdrawOpen}
//         balance={balance}
//         walletId={wallet?._id}
//       />

//     </div>
//   );
// }