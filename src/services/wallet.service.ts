


// src/services/wallet.service.ts

// src/services/wallet.service.ts

import { axiosInstance } from "@/lib/api/axios";

/* ============================================================
   WALLET
   ============================================================ */

export interface Wallet {
  _id: string;
  userId: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

/* ============================================================
   WALLET RESPONSE
   ============================================================ */

export interface WalletResponse {
  success: boolean;
  message: string;
  data: Wallet;
}

/* ============================================================
   WALLET BALANCE RESPONSE
   ============================================================ */

export interface WalletBalanceResponse {
  success: boolean;
  message: string;
  data: number;
}

/* ============================================================
   WITHDRAWAL REQUEST
   ============================================================ */

export interface WithdrawalRequest {
  amount: number;
  walletId: string;
}

/* ============================================================
   WITHDRAWAL RESPONSE
   ============================================================ */

export interface WithdrawalResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

/* ============================================================
   GET WALLET BY USER ID
   ============================================================ */

export async function getWalletByUserId(
  userId: string,
): Promise<WalletResponse> {
  const response =
    await axiosInstance.get<WalletResponse>(
      `/wallets/get-wallet-by-userId/${userId}`,
    );

  return response.data;
}

/* ============================================================
   GET WALLET BY WALLET ID
   ============================================================ */

export async function getWalletByWalletId(
  walletId: string,
): Promise<WalletResponse> {
  const response =
    await axiosInstance.get<WalletResponse>(
      `/wallets/get-wallet-by-walletId/${walletId}`,
    );

  return response.data;
}

/* ============================================================
   GET WALLET BALANCE
   ============================================================ */

export async function getWalletBalance(
  walletId: string,
): Promise<WalletBalanceResponse> {
  const response =
    await axiosInstance.get<WalletBalanceResponse>(
      `/wallets/get-wallet-balance-by-walletId/${walletId}`,
    );

  return response.data;
}

/* ============================================================
   REQUEST WITHDRAWAL
   ============================================================ */

export async function requestWithdrawal(
  data: WithdrawalRequest,
): Promise<WithdrawalResponse> {
  const response =
    await axiosInstance.post<WithdrawalResponse>(
      `/withdrawals/request-withdrawal`,
      data,
    );

  return response.data;
}