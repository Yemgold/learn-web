
"use client";

import { useCallback, useEffect,useRef, useMemo, useState } from "react";
import {
  Loader2,
  Wallet,
  X,
  AlertCircle,
  Building2,
  CheckCircle2,
  ArrowLeft,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { AxiosError } from "axios";

import {
  createAccount,
  getBankCodes,
  getUserAccount,
  resolveBankAccountDetails,
  type BankCode,
  type UserBankAccount,
  type ResolvedBankAccount,
} from "@/services/wallet.service";

import { useWithdrawFunds } from "@/hooks/wallet/useWithdrawFunds";

/* ============================================================
   TYPES
============================================================ */

interface WithdrawFundsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  balance: number;
  walletId?: string;
  userId?: string;
}

type ModalStep = "loading" | "account" | "create" | "withdraw";

interface NormalizedBank {
  name: string;
  code: string;
}

interface AccountDetails {
  accountName: string;
  accountNumber: string;
  bankCode: string;
  bankName: string;
}

type UnknownRecord = Record<string, unknown>;

/* ============================================================
   HELPERS
============================================================ */

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getString(
  record: UnknownRecord | undefined,
  ...keys: string[]
): string {
  if (!record) return "";

  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    if (typeof value === "number") {
      return String(value);
    }
  }

  return "";
}

function unwrapData(value: unknown): unknown {
  if (!isRecord(value)) return value;

  if ("data" in value && value.data !== undefined) {
    return value.data;
  }

  return value;
}

function normalizeAccount(value: unknown): AccountDetails | null {
  const unwrapped = unwrapData(value);

  if (!isRecord(unwrapped)) return null;

  const nested =
    isRecord(unwrapped.account) ? unwrapped.account : unwrapped;

  const accountName = getString(
    nested,
    "accountName",
    "account_name",
    "accountHolderName",
    "account_name_enquiry",
    "name",
  );

  const accountNumber = getString(
    nested,
    "accountNumber",
    "account_number",
    "accountNo",
  );

  const bankCode = getString(nested, "bankCode", "bank_code", "code");

  const bankName = getString(
    nested,
    "bankName",
    "bank_name",
    "institutionName",
  );

  if (!accountName && !accountNumber && !bankCode && !bankName) {
    return null;
  }

  return {
    accountName,
    accountNumber,
    bankCode,
    bankName,
  };
}

function normalizeBanks(value: unknown): NormalizedBank[] {
  let source = unwrapData(value);

  if (isRecord(source)) {
    source =
      source.banks ??
      source.bankCodes ??
      source.bank_codes ??
      source.results ??
      source.items ??
      [];
  }

  if (!Array.isArray(source)) return [];

  const banks = source
    .filter(isRecord)
    .map((item) => ({
      name: getString(item, "name", "bankName", "bank_name", "institutionName"),
      code: getString(item, "code", "bankCode", "bank_code", "id"),
    }))
    .filter((bank) => bank.name && bank.code);

  return banks.filter(
    (bank, index, all) =>
      all.findIndex((other) => other.code === bank.code) === index,
  );
}

function getErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<{
    message?: string;
    error?: string;
  }>;

  return (
    axiosError.response?.data?.message ||
    axiosError.response?.data?.error ||
    axiosError.message ||
    "Something went wrong. Please try again."
  );
}

function isMissingAccountError(error: unknown): boolean {
  const axiosError = error as AxiosError<{
    message?: string;
    error?: string;
  }>;

  if (axiosError.response?.status === 404) return true;

  const message = getErrorMessage(error).toLowerCase();

  return (
    message.includes("account not found") ||
    message.includes("no bank account") ||
    message.includes("bank account not found") ||
    message.includes("account does not exist") ||
    message.includes("account does not exist for")
  );
}

function maskAccountNumber(accountNumber: string): string {
  if (accountNumber.length <= 4) return accountNumber;

  return `${"•".repeat(Math.max(0, accountNumber.length - 4))}${accountNumber.slice(-4)}`;
}

/* ============================================================
   COMPONENT
============================================================ */

export default function WithdrawFundsModal({
  open,
  onOpenChange,
  balance,
  walletId,
  userId,
}: WithdrawFundsModalProps) {
  const [step, setStep] = useState<ModalStep>("loading");

  const [savedAccount, setSavedAccount] =
    useState<AccountDetails | null>(null);

  const [banks, setBanks] = useState<NormalizedBank[]>([]);
  const [selectedBankCode, setSelectedBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [verifiedAccount, setVerifiedAccount] =
    useState<AccountDetails | null>(null);

  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loadingAccount, setLoadingAccount] = useState(false);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [resolvingAccount, setResolvingAccount] = useState(false);
  const [savingAccount, setSavingAccount] = useState(false);
  const [accountLookupFailed, setAccountLookupFailed] = useState(false);
  
  const withdrawMutation = useWithdrawFunds();

  const numericAmount = Number(amount);

  const selectedBank = useMemo(
    () => banks.find((bank) => bank.code === selectedBankCode),
    [banks, selectedBankCode],
  );

  /* ============================================================
     RESET FORM
  ============================================================ */

  const resetForm = useCallback(() => {
    setStep("loading");
    setSavedAccount(null);
    setSelectedBankCode("");
    setAccountNumber("");
    setVerifiedAccount(null);
    setAmount("");
    setError("");
    setNotice("");
    setLoadingAccount(false);
    setLoadingBanks(false);
    setResolvingAccount(false);
    setSavingAccount(false);
    setAccountLookupFailed(false);
  }, []);

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open, resetForm]);

  /* ============================================================
     LOAD USER'S SAVED ACCOUNT
  ============================================================ */

  const loadUserAccount = useCallback(async () => {
    if (!userId) {
      setStep("account");
      setAccountLookupFailed(true);
      setError(
        "Your user information is unavailable. Please sign in again before withdrawing.",
      );
      return;
    }

    setLoadingAccount(true);
    setAccountLookupFailed(false);
    setError("");
    setNotice("");
    setStep("loading");

    try {
      const response = await getUserAccount(userId);

      const account = normalizeAccount(response);

      if (
        response.success === false ||
        !account ||
        !account.accountNumber ||
        !account.accountName
      ) {
        setSavedAccount(null);
        setStep("create");
        return;
      }

      setSavedAccount(account);
      setStep("account");
    } catch (requestError) {
      if (isMissingAccountError(requestError)) {
        setSavedAccount(null);
        setStep("create");
      } else {
        setAccountLookupFailed(true);
        setStep("account");
        setError(
          `We couldn't check your saved bank account. ${getErrorMessage(requestError)}`,
        );
      }
    } finally {
      setLoadingAccount(false);
    }
  }, [userId]);

  useEffect(() => {
    if (open) {
      void loadUserAccount();
    }
  }, [open, loadUserAccount]);

  /* ============================================================
     LOAD BANK LIST
  ============================================================ */

  const loadBanks = useCallback(async () => {
    setLoadingBanks(true);
    setError("");

    try {
      const response = await getBankCodes();
      const bankList = normalizeBanks(response);

      if (bankList.length === 0) {
        setBanks([]);
        setError(
          "The bank list could not be read from the server. Please check the bank-codes API response format.",
        );
        return;
      }

      setBanks(bankList);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoadingBanks(false);
    }
  }, []);

  useEffect(() => {
    if (open && step === "create" && banks.length === 0 && !loadingBanks) {
      void loadBanks();
    }
  }, [open, step, banks.length, loadingBanks, loadBanks]);

  /* ============================================================
     START ACCOUNT CREATION
  ============================================================ */

  const handleStartCreateAccount = () => {
    setError("");
    setNotice("");
    setVerifiedAccount(null);
    setAccountNumber("");
    setSelectedBankCode("");
    setStep("create");
  };

  /* ============================================================
     RESOLVE / VERIFY BANK ACCOUNT
  ============================================================ */

  const handleResolveAccount = async () => {
    setError("");
    setNotice("");
    setVerifiedAccount(null);

    const cleanedAccountNumber = accountNumber.replace(/\s/g, "");

    if (!selectedBankCode) {
      setError("Please select your bank.");
      return;
    }

    if (!/^\d{10}$/.test(cleanedAccountNumber)) {
      setError("Enter a valid 10-digit bank account number.");
      return;
    }

    setResolvingAccount(true);

    try {
      const response = await resolveBankAccountDetails(
        selectedBankCode,
        cleanedAccountNumber,
      );

      const details = normalizeAccount(response);

      if (
        response.success === false ||
        !details?.accountName
      ) {
        setError(
          response.message || "We could not verify this bank account.",
        );
        return;
      }

      const resolved: AccountDetails = {
        accountName: details.accountName,
        accountNumber:
          details.accountNumber || cleanedAccountNumber,
        bankCode: details.bankCode || selectedBankCode,
        bankName: details.bankName || selectedBank?.name || "",
      };

      setVerifiedAccount(resolved);
      setNotice("Bank account verified successfully.");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setResolvingAccount(false);
    }
  };

  /* ============================================================
     SAVE BANK ACCOUNT
  ============================================================ */

 const handleSaveAccount = async () => {
  if (!userId) {
    setError("Your user ID is missing. Please sign in again.");
    return;
  }

  if (!verifiedAccount) {
    setError("Verify your bank account before saving it.");
    return;
  }

  const accountName = verifiedAccount.accountName.trim();
  const bankName = (
    verifiedAccount.bankName ||
    selectedBank?.name ||
    ""
  ).trim();
  const cleanedAccountNumber = verifiedAccount.accountNumber.trim();
  const bankCode = verifiedAccount.bankCode.trim();

  if (!accountName) {
    setError("The verified account name is missing. Please verify again.");
    return;
  }

  if (!bankName) {
    setError("The bank name is missing. Please select your bank and verify again.");
    return;
  }

  if (!/^\d{10}$/.test(cleanedAccountNumber)) {
    setError("The account number must contain exactly 10 digits.");
    return;
  }

  if (!bankCode) {
    setError("The bank code is missing. Please select your bank again.");
    return;
  }

  setSavingAccount(true);
  setError("");
  setNotice("");

  try {
    const response = await createAccount({
      userId,
      accountNumber: cleanedAccountNumber,
      accountName,
      bankCode,
      bankName,
    });

    if (response.success === false) {
      setError(response.message || "Unable to save your bank account.");
      return;
    }

    const responseAccount = normalizeAccount(response);

    const accountToSave: AccountDetails = {
      accountName:
        responseAccount?.accountName || accountName,
      accountNumber:
        responseAccount?.accountNumber || cleanedAccountNumber,
      bankCode:
        responseAccount?.bankCode || bankCode,
      bankName:
        responseAccount?.bankName || bankName,
    };

    setSavedAccount(accountToSave);
    setVerifiedAccount(null);
    setStep("account");
    setNotice("Your bank account has been saved successfully.");
  } catch (requestError) {
    setError(getErrorMessage(requestError));
  } finally {
    setSavingAccount(false);
  }
};
  /* ============================================================
     CONTINUE TO WITHDRAWAL
  ============================================================ */

  const handleContinueToWithdrawal = () => {
    setError("");
    setNotice("");
    setAmount("");
    setStep("withdraw");
  };

  /* ============================================================
     WITHDRAWAL VALIDATION
  ============================================================ */

  const validateAmount = () => {
    setError("");

    if (!userId) {
      setError("Your user information is unavailable. Please sign in again.");
      return false;
    }

    if (!walletId) {
      setError("Wallet information is unavailable. Please refresh the page.");
      return false;
    }

    if (!savedAccount?.accountNumber || !savedAccount?.accountName) {
      setError("Please add and verify your bank account first.");
      setStep("account");
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
        `Insufficient balance. Your available balance is ${formatCurrency(balance)}.`,
      );
      return false;
    }

    return true;
  };

 const idempotencyKeyRef = useRef<string | null>(null);
/* ============================================================
   SUBMIT WITHDRAWAL
============================================================ */

const handleSubmit = async () => {
  if (!validateAmount()) return;

  if (!Number.isSafeInteger(Math.round(numericAmount * 100))) {
    setError("Please enter a valid withdrawal amount.");
    return;
  }

  // Reuse the key when retrying the same withdrawal request.
  if (!idempotencyKeyRef.current) {
    idempotencyKeyRef.current = crypto.randomUUID();
  }

  try {
    await withdrawMutation.mutateAsync({
  walletId: walletId!,
  amountInKobo: Math.round(numericAmount * 100),
  idempotencyKey: idempotencyKeyRef.current!,
});

    idempotencyKeyRef.current = null;
    onOpenChange(false);
  } catch (requestError) {
    setError(getErrorMessage(requestError));
  }
};


  const busy =
    loadingAccount ||
    loadingBanks ||
    resolvingAccount ||
    savingAccount ||
    withdrawMutation.isPending;

  /* ============================================================
     UI
  ============================================================ */

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/70 p-3 backdrop-blur-sm sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !busy
            ) {
              onOpenChange(false);
            }
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="withdraw-modal-title"
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ duration: 0.2 }}
            className="my-auto w-full max-w-md overflow-hidden rounded-2xl bg-white text-slate-900 shadow-2xl"
          >
            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                  <Wallet className="h-5 w-5 text-blue-600" />
                </div>

                <div>
                  <h2
                    id="withdraw-modal-title"
                    className="font-bold text-slate-900"
                  >
                    Withdraw Funds
                  </h2>

                  <p className="text-xs text-slate-500">
                    Transfer money from your wallet
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label="Close withdrawal modal"
                onClick={() => onOpenChange(false)}
                disabled={busy}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* BODY */}

            <div className="max-h-[75vh] space-y-5 overflow-y-auto p-5">
              {/* BALANCE */}

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">
                  Available Balance
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900">
                  {formatCurrency(balance)}
                </p>
              </div>

              {/* LOADING ACCOUNT */}

              {step === "loading" && (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />

                  <p className="text-sm font-semibold text-slate-700">
                    Checking your bank account...
                  </p>

                  <p className="text-xs text-slate-500">
                    Please wait while we retrieve your account details.
                  </p>
                </div>
              )}

              {/* ACCOUNT DETAILS */}

              {step === "account" && (
                <div className="space-y-4">
                  {accountLookupFailed ? (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-amber-900">
                            Could not load your bank account
                          </p>

                          <p className="mt-1 break-words text-sm text-amber-800">
                            {error}
                          </p>

                          <button
                            type="button"
                            onClick={() => void loadUserAccount()}
                            disabled={loadingAccount}
                            className="mt-3 inline-flex items-center gap-2 rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 disabled:opacity-50"
                          >
                            <RefreshCw className="h-4 w-4" />
                            Retry
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : savedAccount ? (
                    <>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />

                        <h3 className="font-bold text-slate-900">
                          Your Withdrawal Account
                        </h3>
                      </div>

                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
                            <Building2 className="h-5 w-5" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="break-words font-bold text-slate-900">
                              {savedAccount.bankName || "Bank account"}
                            </p>

                            <p className="mt-1 break-words text-sm text-slate-600">
                              {savedAccount.accountName}
                            </p>

                            <p className="mt-2 font-mono text-sm tracking-wider text-slate-800">
                              {maskAccountNumber(savedAccount.accountNumber)}
                            </p>
                          </div>

                          <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600" />
                        </div>

                        <div className="mt-4 flex items-center gap-2 border-t border-emerald-200 pt-3 text-xs text-emerald-800">
                          <CheckCircle2 className="h-4 w-4" />
                          Saved withdrawal account
                        </div>
                      </div>

                      {notice && (
                        <p className="text-sm text-emerald-700">
                          {notice}
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={handleContinueToWithdrawal}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        Continue to Withdrawal
                      </button>
                    </>
                  ) : (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                      <p className="font-semibold text-amber-900">
                        No bank account found
                      </p>

                      <p className="mt-1 text-sm leading-6 text-amber-800">
                        Add your bank account before requesting a withdrawal.
                        We will verify the account details before saving them.
                      </p>

                      <button
                        type="button"
                        onClick={handleStartCreateAccount}
                        className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                      >
                        Add Bank Account
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* CREATE ACCOUNT */}

              {step === "create" && (
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => {
                      setError("");
                      setNotice("");
                      setStep("account");
                    }}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Add Your Bank Account
                    </h3>

                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      Enter your bank details. We will resolve the account
                      name before saving your account.
                    </p>
                  </div>

                  {/* BANK SELECT */}

                  <div>
                    <label
                      htmlFor="withdraw-bank"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Select Bank
                    </label>

                    <select
                      id="withdraw-bank"
                      value={selectedBankCode}
                      onChange={(event) => {
                        setSelectedBankCode(event.target.value);
                        setVerifiedAccount(null);
                        setNotice("");
                        setError("");
                      }}
                      disabled={loadingBanks || savingAccount || resolvingAccount}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:bg-slate-100"
                    >
                      <option value="">
                        {loadingBanks ? "Loading banks..." : "Choose your bank"}
                      </option>

                      {banks.map((bank) => (
                        <option key={bank.code} value={bank.code}>
                          {bank.name}
                        </option>
                      ))}
                    </select>

                    {!loadingBanks && banks.length === 0 && (
                      <button
                        type="button"
                        onClick={() => void loadBanks()}
                        className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-800"
                      >
                        Retry loading banks
                      </button>
                    )}
                  </div>

                  {/* ACCOUNT NUMBER */}

                  <div>
                    <label
                      htmlFor="withdraw-account-number"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Account Number
                    </label>

                    <input
                      id="withdraw-account-number"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={10}
                      value={accountNumber}
                      onChange={(event) => {
                        const value = event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10);

                        setAccountNumber(value);
                        setVerifiedAccount(null);
                        setNotice("");
                        setError("");
                      }}
                      disabled={savingAccount || resolvingAccount}
                      placeholder="Enter your 10-digit account number"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:bg-slate-100"
                    />

                    <p className="mt-1 text-xs text-slate-400">
                      {accountNumber.length}/10 digits
                    </p>
                  </div>

                  {/* VERIFIED ACCOUNT */}

                  {verifiedAccount && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                      <div className="flex items-center gap-2 text-emerald-700">
                        <CheckCircle2 className="h-5 w-5" />

                        <p className="text-sm font-bold">
                          Account Verified
                        </p>
                      </div>

                      <p className="mt-3 text-xs text-slate-500">
                        Account Name
                      </p>

                      <p className="mt-1 break-words font-bold text-slate-900">
                        {verifiedAccount.accountName}
                      </p>

                      <p className="mt-3 text-xs text-slate-500">
                        Bank
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {verifiedAccount.bankName || selectedBank?.name}
                      </p>

                      <p className="mt-3 text-xs text-slate-500">
                        Account Number
                      </p>

                      <p className="mt-1 font-mono text-sm text-slate-900">
                        {verifiedAccount.accountNumber}
                      </p>
                    </div>
                  )}

                  {notice && (
                    <p className="text-sm text-emerald-700">{notice}</p>
                  )}
                </div>
              )}

              {/* WITHDRAWAL AMOUNT */}

              {step === "withdraw" && (
                <div className="space-y-5">
                  <button
                    type="button"
                    onClick={() => {
                      setError("");
                      setStep("account");
                    }}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Account
                  </button>

                  {/* DESTINATION */}

                  <div className="rounded-xl border border-slate-200 p-3">
                    <p className="mb-2 text-xs font-medium text-slate-500">
                      Withdrawal will be sent to
                    </p>

                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <Building2 className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="break-words text-sm font-bold text-slate-900">
                          {savedAccount?.accountName}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {savedAccount?.bankName || "Bank"} ·{" "}
                          {maskAccountNumber(savedAccount?.accountNumber ?? "")}
                        </p>
                      </div>

                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                    </div>
                  </div>

                  {/* AMOUNT */}

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
                        max={balance}
                        step="1"
                        value={amount}
                        
                        onChange={(event) => {
                          setAmount(event.target.value);
                          idempotencyKeyRef.current = null;
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

                  {/* CONFIRMATION */}

                  {numericAmount > 0 &&
                    Number.isFinite(numericAmount) &&
                    numericAmount <= balance &&
                    numericAmount >= 100 && (
                      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                        <p className="text-xs text-blue-600">
                          Withdrawal request amount
                        </p>

                        <p className="mt-1 text-lg font-bold text-blue-900">
                          {formatCurrency(numericAmount)}
                        </p>

                        <p className="mt-2 text-xs leading-5 text-blue-700">
                          Please confirm the amount before submitting your
                          withdrawal request.
                        </p>
                      </div>
                    )}
                </div>
              )}

              {/* ERROR */}

              {error && step !== "account" && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />

                  <p className="break-words text-sm leading-5 text-red-600">
                    {error}
                  </p>
                </div>
              )}

              {error && step === "account" && !accountLookupFailed && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />

                  <p className="break-words text-sm leading-5 text-red-600">
                    {error}
                  </p>
                </div>
              )}
            </div>

            {/* FOOTER */}

            {step !== "loading" && (
              <div className="flex gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4">
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  disabled={busy}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                {step === "create" && (
                  <>
                    {!verifiedAccount ? (
                      <button
                        type="button"
                        onClick={handleResolveAccount}
                        disabled={
                          busy ||
                          !selectedBankCode ||
                          accountNumber.length !== 10
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {resolvingAccount ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          "Verify Account"
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSaveAccount}
                        disabled={busy}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {savingAccount ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Account"
                        )}
                      </button>
                    )}
                  </>
                )}

                {step === "withdraw" && (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={
                      busy ||
                      !walletId ||
                      !userId ||
                      !savedAccount?.accountNumber ||
                      !amount.trim() ||
                      !Number.isFinite(numericAmount) ||
                      numericAmount < 100 ||
                      numericAmount > balance
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
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
