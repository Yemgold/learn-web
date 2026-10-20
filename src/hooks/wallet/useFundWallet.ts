
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  fundWalletByWalletId,
  type FundWalletRequest,
} from "@/lib/api/wallet";

export function useFundWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: FundWalletRequest) =>
      fundWalletByWalletId(payload),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["wallet"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["wallet-transactions"],
        }),
      ]);
    },
  });
}
