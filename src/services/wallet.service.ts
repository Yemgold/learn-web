
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

export interface WalletResponse {
  success: boolean;
  message: string;
  data: Wallet;
}

export interface WalletBalanceResponse {
  success: boolean;
  message: string;
  data: number;
}

/* ============================================================
   WITHDRAWAL
   ============================================================ */

export interface WithdrawalRequest {
  amount: number;
  walletId: string;
}

export interface WithdrawalResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

/* ============================================================
   USER BANK ACCOUNT
   ============================================================ */

export interface UserBankAccount {
  _id?: string;
  userId?: string;
  accountName?: string;
  accountNumber?: string;
  bankCode?: string;
  bankName?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface UserBankAccountResponse {
  success: boolean;
  message: string;
  data: UserBankAccount;
}

/* ============================================================
   CREATE BANK ACCOUNT
   ============================================================ */

export interface CreateAccountRequest {
  userId: string;
  accountNumber: string;
  accountName: string;
  bankCode: string;
  bankName: string;
}

export interface CreateAccountResponse {
  success: boolean;
  message: string;
  data?: UserBankAccount | unknown;
}

/* ============================================================
   BANK CODES
   ============================================================ */

export interface BankCode {
  name?: string;
  bankName?: string;
  code?: string;
  bankCode?: string;
  id?: string;
  [key: string]: unknown;
}

export interface BankCodesResponse {
  success: boolean;
  message: string;
  data: BankCode[] | Record<string, unknown>;
}

/* ============================================================
   RESOLVE BANK ACCOUNT DETAILS
   ============================================================ */

export interface ResolvedBankAccount {
  accountName?: string;
  accountNumber?: string;
  bankCode?: string;
  bankName?: string;
  [key: string]: unknown;
}

export interface ResolveBankAccountResponse {
  success: boolean;
  message: string;
  data: ResolvedBankAccount;
}

/* ============================================================
   GET WALLET BY USER ID
   ============================================================ */

export async function getWalletByUserId(
  userId: string,
): Promise<WalletResponse> {
  const response = await axiosInstance.get<WalletResponse>(
    `/wallets/get-wallet-by-userId/${encodeURIComponent(userId)}`,
  );

  return response.data;
}

/* ============================================================
   GET WALLET BY WALLET ID
   ============================================================ */

export async function getWalletByWalletId(
  walletId: string,
): Promise<WalletResponse> {
  const response = await axiosInstance.get<WalletResponse>(
    `/wallets/get-wallet-by-walletId/${encodeURIComponent(walletId)}`,
  );

  return response.data;
}

/* ============================================================
   GET WALLET BALANCE
   ============================================================ */

export async function getWalletBalance(
  walletId: string,
): Promise<WalletBalanceResponse> {
  const response = await axiosInstance.get<WalletBalanceResponse>(
    `/wallets/get-wallet-balance-by-walletId/${encodeURIComponent(walletId)}`,
  );

  return response.data;
}

/* ============================================================
   REQUEST WITHDRAWAL
   ============================================================ */

export async function requestWithdrawal(
  data: WithdrawalRequest,
): Promise<WithdrawalResponse> {
  const response = await axiosInstance.post<WithdrawalResponse>(
    `/withdrawals/request-withdrawal`,
    data,
  );

  return response.data;
}

/* ============================================================
   GET USER BANK ACCOUNT
   GET /accounts/get-user-account/{userId}
   ============================================================ */

export async function getUserAccount(
  userId: string,
): Promise<UserBankAccountResponse> {
  const response = await axiosInstance.get<UserBankAccountResponse>(
    `/accounts/get-user-account/${encodeURIComponent(userId)}`,
  );

  return response.data;
}

/* ============================================================
   CREATE BANK ACCOUNT
   POST /accounts/create-account
   ============================================================ */

export async function createAccount(
  data: CreateAccountRequest,
): Promise<CreateAccountResponse> {
  const response = await axiosInstance.post<CreateAccountResponse>(
    `/accounts/create-account`,
    data,
  );

  return response.data;
}

/* ============================================================
   GET BANK CODES
   GET /accounts/get-bank-codes
   ============================================================ */

export async function getBankCodes(): Promise<BankCodesResponse> {
  const response = await axiosInstance.get<BankCodesResponse>(
    `/accounts/get-bank-codes`,
  );

  return response.data;
}

/* ============================================================
   RESOLVE BANK ACCOUNT DETAILS
   GET /accounts/resolve-bank-account-details/{bankCode}/{accountNumber}
   ============================================================ */

export async function resolveBankAccountDetails(
  bankCode: string,
  accountNumber: string,
): Promise<ResolveBankAccountResponse> {
  const response =
    await axiosInstance.get<ResolveBankAccountResponse>(
      `/accounts/resolve-bank-account-details/${encodeURIComponent(bankCode)}/${encodeURIComponent(accountNumber)}`,
    );

  return response.data;
}
