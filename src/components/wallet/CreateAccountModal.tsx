





"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { AxiosError } from "axios";

import {
  createAccount,
  getBankCodes,
  resolveBankAccountDetails,
  type BankCode,
} from "@/services/wallet.service";

/* ============================================================
   PROPS
============================================================ */

interface CreateAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: string;
  onAccountCreated?: () => void;
}

/* ============================================================
   TYPES
============================================================ */

interface BankOption {
  name: string;
  code: string;
}

interface VerifiedAccount {
  accountName: string;
  accountNumber: string;
  bankCode: string;
  bankName: string;
}

interface UnknownRecord {
  [key: string]: unknown;
}

/* ============================================================
   HELPERS
============================================================ */

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getString(
  value: UnknownRecord,
  ...keys: string[]
): string {
  for (const key of keys) {
    const item = value[key];

    if (typeof item === "string" && item.trim()) {
      return item.trim();
    }

    if (typeof item === "number") {
      return String(item);
    }
  }

  return "";
}

function unwrapData(value: unknown): unknown {
  if (!isRecord(value)) return value;

  return value.data !== undefined ? value.data : value;
}

function normalizeBanks(value: unknown): BankOption[] {
  let data = unwrapData(value);

  if (isRecord(data)) {
    data =
      data.banks ??
      data.bankCodes ??
      data.bank_codes ??
      data.results ??
      data.items ??
      [];
  }

  if (!Array.isArray(data)) return [];

  return data
    .filter(isRecord)
    .map((item) => ({
      name: getString(
        item,
        "name",
        "bankName",
        "bank_name",
        "institutionName",
      ),
      code: getString(item, "code", "bankCode", "bank_code", "id"),
    }))
    .filter((bank) => bank.name && bank.code)
    .filter(
      (bank, index, all) =>
        all.findIndex((item) => item.code === bank.code) === index,
    );
}

function normalizeResolvedAccount(value: unknown): VerifiedAccount | null {
  const data = unwrapData(value);

  if (!isRecord(data)) return null;

  const account = isRecord(data.account) ? data.account : data;

  const accountName = getString(
    account,
    "accountName",
    "account_name",
    "accountHolderName",
    "name",
  );

  const accountNumber = getString(
    account,
    "accountNumber",
    "account_number",
    "accountNo",
  );

  const bankCode = getString(
    account,
    "bankCode",
    "bank_code",
    "code",
  );

  const bankName = getString(
    account,
    "bankName",
    "bank_name",
    "institutionName",
  );

  if (!accountName) return null;

  return {
    accountName,
    accountNumber,
    bankCode,
    bankName,
  };
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

/* ============================================================
   COMPONENT
============================================================ */

export default function CreateAccountModal({
  open,
  onOpenChange,
  userId,
  onAccountCreated,
}: CreateAccountModalProps) {
  const [banks, setBanks] = useState<BankOption[]>([]);
  const [selectedBankCode, setSelectedBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [verifiedAccount, setVerifiedAccount] =
    useState<VerifiedAccount | null>(null);

  const [loadingBanks, setLoadingBanks] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const selectedBank = banks.find(
    (bank) => bank.code === selectedBankCode,
  );

  const busy = loadingBanks || resolving || saving;

  /* ============================================================
     RESET
  ============================================================ */

  const resetForm = useCallback(() => {
    setSelectedBankCode("");
    setAccountNumber("");
    setVerifiedAccount(null);
    setError("");
    setSuccessMessage("");
  }, []);

  useEffect(() => {
    if (!open) resetForm();
  }, [open, resetForm]);

  /* ============================================================
     LOAD BANKS
  ============================================================ */

  const loadBanks = useCallback(async () => {
    setLoadingBanks(true);
    setError("");

    try {
      const response = await getBankCodes();
      const normalized = normalizeBanks(response);

      if (response.success === false) {
        throw new Error(response.message || "Unable to load banks.");
      }

      if (normalized.length === 0) {
        setBanks([]);
        setError(
          "No banks were returned. Please check the bank-codes API response.",
        );
        return;
      }

      setBanks(normalized);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoadingBanks(false);
    }
  }, []);

  useEffect(() => {
    if (open && banks.length === 0 && !loadingBanks) {
      void loadBanks();
    }
  }, [open, banks.length, loadingBanks, loadBanks]);

  /* ============================================================
     VERIFY BANK ACCOUNT
  ============================================================ */

  const handleVerify = async () => {
    setError("");
    setSuccessMessage("");
    setVerifiedAccount(null);

    if (!userId) {
      setError("Your user ID is unavailable. Please sign in again.");
      return;
    }

    if (!selectedBankCode) {
      setError("Please select your bank.");
      return;
    }

    const cleanedAccountNumber = accountNumber.replace(/\s/g, "");

    if (!/^\d{10}$/.test(cleanedAccountNumber)) {
      setError("Enter a valid 10-digit account number.");
      return;
    }

    setResolving(true);

    try {
      const response = await resolveBankAccountDetails(
        selectedBankCode,
        cleanedAccountNumber,
      );

      if (response.success === false) {
        throw new Error(
          response.message || "Unable to verify the bank account.",
        );
      }

      const account = normalizeResolvedAccount(response);

      if (!account?.accountName) {
        setError(
          "The bank did not return an account name. Please check the details and try again.",
        );
        return;
      }

      setVerifiedAccount({
        accountName: account.accountName,
        accountNumber: account.accountNumber || cleanedAccountNumber,
        bankCode: account.bankCode || selectedBankCode,
        bankName: account.bankName || selectedBank?.name || "",
      });

      setSuccessMessage("Bank account verified successfully.");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setResolving(false);
    }
  };

  /* ============================================================
     SAVE ACCOUNT
  ============================================================ */

  const handleSave = async () => {
    if (!userId) {
      setError("Your user ID is unavailable. Please sign in again.");
      return;
    }

    if (!verifiedAccount) {
      setError("Verify your bank account before saving.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await createAccount({
        userId,
        accountNumber: verifiedAccount.accountNumber,
        bankCode: verifiedAccount.bankCode,
      });

      if (response.success === false) {
        throw new Error(
          response.message || "Unable to save your bank account.",
        );
      }

      setSuccessMessage("Your bank account has been saved successfully.");

      onAccountCreated?.();
      onOpenChange(false);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  /* ============================================================
     UI
  ============================================================ */

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/70 p-3 backdrop-blur-sm sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !busy) {
              onOpenChange(false);
            }
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-account-title"
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
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>

                <div>
                  <h2
                    id="create-account-title"
                    className="font-bold text-slate-900"
                  >
                    Add Bank Account
                  </h2>

                  <p className="text-xs text-slate-500">
                    Set up your withdrawal destination
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label="Close modal"
                onClick={() => onOpenChange(false)}
                disabled={busy}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* BODY */}

            <div className="max-h-[75vh] space-y-5 overflow-y-auto p-5">
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                  <div>
                    <p className="text-sm font-semibold text-blue-900">
                      Verify before saving
                    </p>

                    <p className="mt-1 text-sm leading-5 text-blue-800">
                      Select your bank and enter your account number. Confirm
                      that the resolved account name belongs to you before
                      saving.
                    </p>
                  </div>
                </div>
              </div>

              {/* BANK */}

              <div>
                <label
                  htmlFor="create-account-bank"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Bank
                </label>

                <select
                  id="create-account-bank"
                  value={selectedBankCode}
                  onChange={(event) => {
                    setSelectedBankCode(event.target.value);
                    setVerifiedAccount(null);
                    setError("");
                    setSuccessMessage("");
                  }}
                  disabled={busy}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:bg-slate-100"
                >
                  <option value="">
                    {loadingBanks ? "Loading banks..." : "Select your bank"}
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
                  htmlFor="create-account-number"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Account Number
                </label>

                <input
                  id="create-account-number"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={10}
                  value={accountNumber}
                  onChange={(event) => {
                    setAccountNumber(
                      event.target.value.replace(/\D/g, "").slice(0, 10),
                    );
                    setVerifiedAccount(null);
                    setError("");
                    setSuccessMessage("");
                  }}
                  disabled={busy}
                  placeholder="Enter your 10-digit account number"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:bg-slate-100"
                />

                <p className="mt-1 text-xs text-slate-400">
                  {accountNumber.length}/10 digits
                </p>
              </div>

              {/* VERIFIED DETAILS */}

              {verifiedAccount && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />

                    <p className="text-sm font-bold text-emerald-800">
                      Account Verified
                    </p>
                  </div>

                  <p className="mt-4 text-xs text-slate-500">
                    Account Name
                  </p>

                  <p className="mt-1 break-words font-bold text-slate-900">
                    {verifiedAccount.accountName}
                  </p>

                  <p className="mt-3 text-xs text-slate-500">Bank</p>

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

              {/* ERROR */}

              {error && (
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

              {/* SUCCESS */}

              {successMessage && (
                <div
                  role="status"
                  className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                  <p className="text-sm leading-5 text-emerald-700">
                    {successMessage}
                  </p>
                </div>
              )}
            </div>

            {/* FOOTER */}

            <div className="flex gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={busy}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              {!verifiedAccount ? (
                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={
                    busy ||
                    !userId ||
                    !selectedBankCode ||
                    accountNumber.length !== 10
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {resolving ? (
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
                  onClick={handleSave}
                  disabled={busy || !userId}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Account"
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
