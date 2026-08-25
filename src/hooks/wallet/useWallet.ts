"use client";

import { useQuery } from "@tanstack/react-query";

import { getWalletByUserId } from "@/lib/api/wallet";
import { useAuthStore } from "@/stores/auth.store";
import { getAccessToken } from "@/lib/auth/token";

/* ============================================================
   QUERY KEY
============================================================ */

export const walletQueryKey = (userId: string) =>
  ["wallet", userId] as const;

/* ============================================================
   USE WALLET
============================================================ */

export function useWallet() {
  const user = useAuthStore(
    (state) => state.user,
  );

  /*
   * Real MongoDB user ID.
   */
  const userId =
    user?._id ?? user?.id;

  /*
   * Access token.
   */
  const accessToken =
    getAccessToken();

  const canFetchWallet =
    Boolean(userId) &&
    Boolean(accessToken);

  const query = useQuery({
    queryKey: userId
      ? walletQueryKey(userId)
      : ["wallet", "unauthenticated"],

    queryFn: async () => {
      if (!userId) {
        throw new Error(
          "Cannot fetch wallet: authenticated user ID is missing.",
        );
      }

      const token =
        getAccessToken();

      if (!token) {
        throw new Error(
          "Cannot fetch wallet: access token is not available.",
        );
      }

      return getWalletByUserId(userId);
    },

    enabled: canFetchWallet,

    staleTime: 30 * 1000,

    refetchOnWindowFocus: false,
  });

  /* ============================================================
     WALLET
  ============================================================ */

  const wallet =
    query.data?.data;

  /*
   * Backend stores money in KOBO.
   *
   * 230000 kobo
   *     ↓
   * 230000 / 100
   *     ↓
   * ₦2,300
   */
  const balance =
    wallet?.balanceInKobo != null
      ? wallet.balanceInKobo / 100
      : 0;

  return {
    /* ========================================================
       REACT QUERY STATE
    ======================================================== */

    data: query.data,

    wallet,

    isLoading:
      query.isLoading,

    isFetching:
      query.isFetching,

    isError:
      query.isError,

    error:
      query.error,

    refetch:
      query.refetch,

    /* ========================================================
       CONVENIENCE VALUES
    ======================================================== */

    walletId:
      wallet?._id ?? null,

    userId:
      wallet?.userId ??
      userId ??
      null,

    /*
     * IMPORTANT:
     * This is now NAIRA, not KOBO.
     */
    balance,
  };
}