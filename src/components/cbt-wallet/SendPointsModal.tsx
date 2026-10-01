




"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mail,
  Send,
  User,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface SendPointsModalProps {
  open: boolean;

  balance: number;

  onClose: () => void;

  /**
   * Called after successful validation/submission.
   */
  onSend?: (data: {
    recipientEmail: string;
    recipientName: string;
    amount: number;
    message?: string;
  }) => Promise<void> | void;
}

interface Recipient {
  name: string;
  email: string;
}

const MIN_TRANSFER_AMOUNT = 50;

export default function SendPointsModal({
  open,
  balance,
  onClose,
  onSend,
}: SendPointsModalProps) {
  const [recipientEmail, setRecipientEmail] =
    useState("");

  const [recipient, setRecipient] =
    useState<Recipient | null>(null);

  const [amount, setAmount] = useState("");

  const [message, setMessage] = useState("");

  const [isFindingRecipient, setIsFindingRecipient] =
    useState(false);

  const [isSending, setIsSending] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState(false);

  /**
   * Reset the form whenever the modal closes.
   */
  useEffect(() => {
    if (!open) {
      setRecipientEmail("");
      setRecipient(null);
      setAmount("");
      setMessage("");
      setError("");
      setSuccess(false);
      setIsFindingRecipient(false);
      setIsSending(false);
    }
  }, [open]);

  /**
   * Prevent body scrolling while the modal is open.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  const numericAmount = Number(amount);

  const isValidAmount =
    Number.isFinite(numericAmount) &&
    numericAmount >= MIN_TRANSFER_AMOUNT &&
    numericAmount <= balance;

  async function handleFindRecipient() {
    setError("");
    setRecipient(null);

    const email = recipientEmail.trim();

    if (!email) {
      setError("Enter the recipient's email address.");
      return;
    }

    if (!isValidEmail(email)) {
      setError(
        "Enter a valid recipient email address."
      );
      return;
    }

    setIsFindingRecipient(true);

    try {
      /**
       * Temporary mock recipient lookup.
       *
       * Replace this section with your real API call.
       */
      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      );

      setRecipient({
        name: "Daniel Okafor",
        email,
      });
    } catch {
      setError(
        "We couldn't find a student with that email address."
      );
    } finally {
      setIsFindingRecipient(false);
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const email = recipientEmail.trim();

    if (!email) {
      setError(
        "Enter the recipient's email address."
      );
      return;
    }

    if (!isValidEmail(email)) {
      setError(
        "Enter a valid recipient email address."
      );
      return;
    }

    if (!recipient) {
      setError(
        "Find and verify the recipient before sending points."
      );
      return;
    }

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      setError("Enter the amount of points to send.");
      return;
    }

    if (numericAmount < MIN_TRANSFER_AMOUNT) {
      setError(
        `The minimum transfer is ${MIN_TRANSFER_AMOUNT.toLocaleString(
          "en-NG"
        )} CBT Points.`
      );
      return;
    }

    if (numericAmount > balance) {
      setError(
        "You do not have enough CBT Points for this transfer."
      );
      return;
    }

    setIsSending(true);

    try {
      await onSend?.({
        recipientEmail: recipient.email,
        recipientName: recipient.name,
        amount: numericAmount,
        message:
          message.trim() || undefined,
      });

      setSuccess(true);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while sending the points.";

      setError(message);
    } finally {
      setIsSending(false);
    }
  }

  function handleAmountChange(
    value: string
  ) {
    /**
     * Allow the input to be empty.
     */
    if (value === "") {
      setAmount("");
      return;
    }

    /**
     * Only allow whole numbers.
     */
    if (!/^\d+$/.test(value)) {
      return;
    }

    setAmount(value);
    setError("");
  }

  function handleEmailChange(
    value: string
  ) {
    setRecipientEmail(value);
    setRecipient(null);
    setError("");
  }

  function handleDone() {
    setSuccess(false);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="send-points-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <Card className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto border-slate-800 bg-slate-950 shadow-2xl shadow-black/40">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSending}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {success ? (
          <SuccessState
            recipient={recipient}
            amount={numericAmount}
            onDone={handleDone}
          />
        ) : (
          <>
            {/* Header */}
            <div className="border-b border-slate-800 px-6 py-6 pr-14">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/10">
                  <Send className="h-5 w-5 text-violet-400" />
                </div>

                <div>
                  <h2
                    id="send-points-title"
                    className="text-lg font-bold text-white"
                  >
                    Send CBT Points
                  </h2>

                  <p className="mt-0.5 text-sm text-slate-400">
                    Send points to another student.
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >
              {/* Balance */}
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3">
                <span className="text-xs text-slate-500">
                  Available balance
                </span>

                <span className="text-sm font-bold text-violet-300">
                  {balance.toLocaleString("en-NG")}{" "}
                  CBT Points
                </span>
              </div>

              {/* Recipient Email */}
              <div className="space-y-2">
                <label
                  htmlFor="recipient-email"
                  className="text-sm font-medium text-slate-200"
                >
                  Recipient Email
                </label>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                    <Input
                      id="recipient-email"
                      type="email"
                      value={recipientEmail}
                      onChange={(event) =>
                        handleEmailChange(
                          event.target.value
                        )
                      }
                      placeholder="student@example.com"
                      autoComplete="email"
                      disabled={
                        isFindingRecipient ||
                        isSending
                      }
                      className="border-slate-700 bg-slate-900 pl-10 text-white placeholder:text-slate-600 focus-visible:ring-violet-500"
                    />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleFindRecipient}
                    disabled={
                      isFindingRecipient ||
                      isSending ||
                      !recipientEmail.trim()
                    }
                    className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white"
                  >
                    {isFindingRecipient ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Find"
                    )}
                  </Button>
                </div>

                {/* Verified recipient */}
                {recipient && (
                  <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10">
                      <User className="h-4 w-4 text-emerald-400" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">
                        {recipient.name}
                      </p>

                      <p className="truncate text-xs text-slate-500">
                        {recipient.email}
                      </p>
                    </div>

                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                  </div>
                )}
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="send-points-amount"
                    className="text-sm font-medium text-slate-200"
                  >
                    Amount
                  </label>

                  <span className="text-[11px] text-slate-500">
                    Minimum{" "}
                    {MIN_TRANSFER_AMOUNT.toLocaleString(
                      "en-NG"
                    )}{" "}
                    points
                  </span>
                </div>

                <div className="relative">
                  <Input
                    id="send-points-amount"
                    type="text"
                    inputMode="numeric"
                    value={amount}
                    onChange={(event) =>
                      handleAmountChange(
                        event.target.value
                      )
                    }
                    placeholder="Enter points"
                    disabled={isSending}
                    className="border-slate-700 bg-slate-900 pr-24 text-white placeholder:text-slate-600 focus-visible:ring-violet-500"
                  />

                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500">
                    CBT Points
                  </span>
                </div>

                {/* Amount helper */}
                {numericAmount > 0 && (
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">
                      Remaining balance
                    </span>

                    <span
                      className={
                        numericAmount > balance
                          ? "font-semibold text-rose-400"
                          : "text-slate-400"
                      }
                    >
                      {Math.max(
                        0,
                        balance -
                          numericAmount
                      ).toLocaleString(
                        "en-NG"
                      )}{" "}
                      pts
                    </span>
                  </div>
                )}
              </div>

              {/* Message */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="send-points-message"
                    className="text-sm font-medium text-slate-200"
                  >
                    Message
                  </label>

                  <span className="text-[11px] text-slate-600">
                    Optional
                  </span>
                </div>

                <textarea
                  id="send-points-message"
                  value={message}
                  onChange={(event) =>
                    setMessage(
                      event.target.value
                    )
                  }
                  placeholder="Add a message..."
                  maxLength={160}
                  disabled={isSending}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                />

                <div className="text-right text-[10px] text-slate-600">
                  {message.length}/160
                </div>
              </div>

              {/* Warning */}
              <div className="flex gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />

                <p className="text-xs leading-5 text-slate-400">
                  Transfers are final. Make sure the
                  recipient email and amount are
                  correct before confirming.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="flex gap-3 rounded-xl border border-rose-500/20 bg-rose-500/5 p-3.5">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />

                  <p className="text-xs leading-5 text-rose-300">
                    {error}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSending}
                  className="border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white sm:min-w-28"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={
                    isSending ||
                    !recipient ||
                    !isValidAmount
                  }
                  className="bg-violet-600 text-white hover:bg-violet-500 disabled:bg-slate-800 disabled:text-slate-500 sm:min-w-32"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Points
                    </>
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </Card>
    </div>
  );
}

/* ============================================================ */
/* SUCCESS STATE */
/* ============================================================ */

interface SuccessStateProps {
  recipient: Recipient | null;
  amount: number;
  onDone: () => void;
}

function SuccessState({
  recipient,
  amount,
  onDone,
}: SuccessStateProps) {
  return (
    <div className="px-6 py-10 text-center sm:px-10">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
        <CheckCircle2 className="h-8 w-8 text-emerald-400" />
      </div>

      <h2 className="mt-5 text-xl font-bold text-white">
        Points Sent Successfully
      </h2>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">
        {amount.toLocaleString("en-NG")} CBT
        Points have been successfully sent to{" "}
        <span className="font-semibold text-white">
          {recipient?.name ?? "the recipient"}
        </span>
        .
      </p>

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">
            Amount sent
          </span>

          <span className="font-bold text-emerald-400">
            +
            {amount.toLocaleString("en-NG")}{" "}
            CBT Points
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-slate-500">
            Recipient
          </span>

          <span className="font-medium text-white">
            {recipient?.name}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-slate-500">
            Email
          </span>

          <span className="max-w-[220px] truncate text-xs text-slate-400">
            {recipient?.email}
          </span>
        </div>
      </div>

      <Button
        type="button"
        onClick={onDone}
        className="mt-6 w-full bg-violet-600 text-white hover:bg-violet-500"
      >
        Done
      </Button>
    </div>
  );
}

/* ============================================================ */
/* HELPERS */
/* ============================================================ */

function isValidEmail(
  email: string
): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
  );
}