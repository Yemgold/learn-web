




"use client";

import { useCallback, useState } from "react";

import {
  formatCbtPoints,
  type CbtTransaction,
} from "@/lib/api/cbtWallet";

/**
 * ============================================================
 * SEND CBT POINTS HOOK
 * ============================================================
 *
 * Currently uses MOCK DATA.
 *
 * Responsibilities:
 *
 * - Validate recipient email
 * - Validate points
 * - Validate available wallet balance
 * - Send CBT points
 * - Create a mock transaction
 * - Track loading state
 * - Track success/error messages
 * - Prevent duplicate submissions
 *
 * Later, the mock request can be replaced with:
 *
 * sendCbtPoints({
 *   recipientEmail,
 *   points,
 *   description,
 * });
 *
 * ============================================================
 */

export interface SendCbtPointsResult {
  success: boolean;
  message: string;
  transaction?: CbtTransaction;
}

export interface UseSendCbtPointsOptions {
  balance?: number;
  userId?: string;
}

export interface UseSendCbtPointsReturn {
  /* State */
  isSending: boolean;
  error: string | null;
  successMessage: string | null;
  transaction: CbtTransaction | null;

  /* Actions */
  sendPoints: (
    recipientEmail: string,
    points: number,
    description?: string,
  ) => Promise<SendCbtPointsResult>;

  clearMessages: () => void;
  reset: () => void;

  /* Validation */
  validateRecipientEmail: (
    email: string,
  ) => string | null;

  validatePoints: (
    points: number,
  ) => string | null;

  /* Helpers */
  formatPoints: (points: number) => string;
}

/* ============================================================
 * HELPERS
 * ============================================================
 */

const wait = (milliseconds: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds);
  });

const normalizeEmail = (email: string): string =>
  email.trim().toLowerCase();

const normalizePoints = (points: number): number =>
  Math.floor(Number(points));

const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/* ============================================================
 * HOOK
 * ============================================================
 */

export function useSendCbtPoints(
  options: UseSendCbtPointsOptions = {},
): UseSendCbtPointsReturn {
  const {
    balance = 0,
    userId = "mock-student-001",
  } = options;

  const [isSending, setIsSending] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  const [transaction, setTransaction] =
    useState<CbtTransaction | null>(null);

  /* ==========================================================
   * VALIDATE EMAIL
   * ==========================================================
   */

  const validateRecipientEmail =
    useCallback(
      (email: string): string | null => {
        const normalizedEmail =
          normalizeEmail(email);

        if (!normalizedEmail) {
          return "Enter the recipient's email address.";
        }

        if (!isValidEmail(normalizedEmail)) {
          return "Enter a valid recipient email address.";
        }

        return null;
      },
      [],
    );

  /* ==========================================================
   * VALIDATE POINTS
   * ==========================================================
   */

  const validatePoints = useCallback(
    (points: number): string | null => {
      const amount = normalizePoints(points);

      if (!Number.isFinite(amount)) {
        return "Enter a valid number of CBT points.";
      }

      if (amount <= 0) {
        return "CBT points must be greater than zero.";
      }

      if (amount > balance) {
        return `You only have ${formatCbtPoints(
          balance,
        )} CBT points available.`;
      }

      return null;
    },
    [balance],
  );

  /* ==========================================================
   * CLEAR MESSAGES
   * ==========================================================
   */

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  /* ==========================================================
   * RESET
   * ==========================================================
   */

  const reset = useCallback(() => {
    setIsSending(false);
    setError(null);
    setSuccessMessage(null);
    setTransaction(null);
  }, []);

  /* ==========================================================
   * SEND POINTS
   * ==========================================================
   */

  const sendPoints = useCallback(
    async (
      recipientEmail: string,
      points: number,
      description = "CBT points transfer",
    ): Promise<SendCbtPointsResult> => {
      /*
       * Prevent duplicate submissions.
       */

      if (isSending) {
        return {
          success: false,
          message:
            "A CBT points transfer is already being processed.",
        };
      }

      clearMessages();
      setTransaction(null);

      /* ------------------------------------------------------
       * Validate email
       * ------------------------------------------------------
       */

      const normalizedEmail =
        normalizeEmail(recipientEmail);

      const emailError =
        validateRecipientEmail(
          normalizedEmail,
        );

      if (emailError) {
        setError(emailError);

        return {
          success: false,
          message: emailError,
        };
      }

      /* ------------------------------------------------------
       * Validate points
       * ------------------------------------------------------
       */

      const amount =
        normalizePoints(points);

      const pointsError =
        validatePoints(amount);

      if (pointsError) {
        setError(pointsError);

        return {
          success: false,
          message: pointsError,
        };
      }

      /* ------------------------------------------------------
       * Prevent sending to yourself
       * ------------------------------------------------------
       *
       * This is only possible if the page passes the user's
       * own email separately in the future.
       *
       * For now, no self-email check is performed.
       */

      setIsSending(true);

      try {
        /*
         * ====================================================
         * MOCK REQUEST
         * ====================================================
         *
         * Replace this section later with:
         *
         * const response = await sendCbtPoints({
         *   senderUserId: userId,
         *   recipientEmail: normalizedEmail,
         *   points: amount,
         *   description,
         * });
         *
         * const transaction = response.data;
         */

        await wait(800);

        const now =
          new Date().toISOString();

        const balanceBefore = balance;

        const balanceAfter =
          balanceBefore - amount;

        const mockTransaction: CbtTransaction =
          {
            _id: `mock-send-${Date.now()}`,

            userId,

            type: "sent",

            amount,

            balanceBefore,

            balanceAfter,

            recipientEmail:
              normalizedEmail,

            description,

            status: "completed",

            reference: `SEND-${Date.now()}`,

            createdAt: now,

            updatedAt: now,
          };

        setTransaction(
          mockTransaction,
        );

        const message = `${formatCbtPoints(
          amount,
        )} CBT points sent successfully to ${normalizedEmail}.`;

        setSuccessMessage(message);

        return {
          success: true,
          message,
          transaction:
            mockTransaction,
        };
      } catch (err) {
        console.error(
          "Failed to send CBT points:",
          err,
        );

        const message =
          "We could not send the CBT points. Please try again.";

        setError(message);

        return {
          success: false,
          message,
        };
      } finally {
        setIsSending(false);
      }
    },
    [
      balance,
      clearMessages,
      isSending,
      userId,
      validatePoints,
      validateRecipientEmail,
    ],
  );

  /* ==========================================================
   * FORMAT POINTS
   * ==========================================================
   */

  const formatPoints = useCallback(
    (points: number): string => {
      return formatCbtPoints(points);
    },
    [],
  );

  /* ==========================================================
   * RETURN
   * ==========================================================
   */

  return {
    /* State */
    isSending,
    error,
    successMessage,
    transaction,

    /* Actions */
    sendPoints,
    clearMessages,
    reset,

    /* Validation */
    validateRecipientEmail,
    validatePoints,

    /* Helpers */
    formatPoints,
  };
}

export default useSendCbtPoints;