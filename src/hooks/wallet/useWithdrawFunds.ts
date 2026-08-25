




"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  requestWithdrawal,
  type WithdrawalRequest,
  type WithdrawalResponse,
} from "@/lib/api/wallet";

/* ============================================================
   WITHDRAW FUNDS HOOK
   ============================================================ */

export function useWithdrawFunds() {
  const queryClient = useQueryClient();

  return useMutation<
    WithdrawalResponse,
    Error,
    WithdrawalRequest
  >({
    mutationFn: async (payload) => {
      return requestWithdrawal(payload);
    },

    onSuccess: async () => {
      /*
       * Refresh wallet balance and transactions after
       * a successful withdrawal.
       */

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["wallet"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["wallet", "transactions"],
        }),
      ]);
    },

    onError: (error) => {
      console.error(
        "========== WITHDRAWAL ERROR ==========",
      );

      console.error(
        "Message:",
        error.message,
      );
    },
  });
}