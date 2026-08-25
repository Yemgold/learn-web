import { axiosInstance } from "@/lib/api/axios";

/* ============================================================
   WALLET
============================================================ */

export interface Wallet {
  _id: string;
  userId: string;

  /**
   * Backend returns wallet balance in KOBO.
   *
   * Example:
   * 230000 = ₦2,300.00
   */
  balanceInKobo: number;

  createdAt: string;
  updatedAt: string;

  __v?: number;
}

export interface WalletResponse {
  success: boolean;
  message: string;
  data: Wallet;
}

/* ============================================================
   WALLET BALANCE
============================================================ */

export interface WalletBalanceResponse {
  success: boolean;
  message: string;

  /**
   * Backend balance endpoint may return kobo.
   */
  data: number;
}

export interface WalletTransaction {
  _id: string;

  walletId: string;

  withdrawalId?: string;

  /*
   * Backend returns amountInKobo.
   *
   * Example:
   * 10000 = ₦100.00
   */
  amountInKobo: number;

  type: "CREDIT" | "DEBIT";

  description: string;

  category?: string;

  referralLevel?: number;

  referredUserId?: string;

  referralUserId?: string;

  createdAt: string;

  updatedAt: string;

  __v?: number;
}

/* ============================================================
   TRANSACTIONS RESPONSE
============================================================ */

export interface TransactionsData {
  totalCount: number;
  totalPages: number;
  transactionObj: WalletTransaction[];
}

export interface TransactionsResponse {
  success: boolean;
  message: string;
  data: TransactionsData;
}

export type WalletTransactionsResponse =
  TransactionsResponse;

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
   GET WALLET BALANCE BY WALLET ID
============================================================ */

export async function getWalletBalanceByWalletId(
  walletId: string,
): Promise<WalletBalanceResponse> {
  const response =
    await axiosInstance.get<WalletBalanceResponse>(
      `/wallets/get-wallet-balance-by-walletId/${walletId}`,
    );

  return response.data;
}

/* ============================================================
   EMPTY TRANSACTIONS RESPONSE
============================================================ */

function createEmptyTransactionsResponse(): WalletTransactionsResponse {
  return {
    success: true,

    message: "No transactions found.",

    data: {
      totalCount: 0,
      totalPages: 0,
      transactionObj: [],
    },
  };
}

/* ============================================================
   GET USER TRANSACTIONS
============================================================ */

export async function getWalletTransactions(
  userId: string,
  page = 1,
  limit = 10,
): Promise<WalletTransactionsResponse> {
  try {
    const response =
      await axiosInstance.get<WalletTransactionsResponse>(
        `/transactions/get-all-transactions-with-userId/${userId}`,
        {
          params: {
            page,
            limit,
          },
        },
      );

    const data = response.data;

    if (
      !data ||
      !data.data ||
      !Array.isArray(
        data.data.transactionObj,
      )
    ) {
      return createEmptyTransactionsResponse();
    }

    return data;
  } catch (error: unknown) {
    if (
      isAxios404TransactionsNotFound(error)
    ) {
      return createEmptyTransactionsResponse();
    }

    throw error;
  }
}

/* ============================================================
   DETECT EMPTY TRANSACTIONS 404
============================================================ */

function isAxios404TransactionsNotFound(
  error: unknown,
): boolean {
  if (
    !error ||
    typeof error !== "object"
  ) {
    return false;
  }

  const axiosError =
    error as {
      response?: {
        status?: number;
        data?: {
          message?: string;
          success?: boolean;
          status?: number;
        };
      };
    };

  const response =
    axiosError.response;

  if (!response) {
    return false;
  }

  if (response.status !== 404) {
    return false;
  }

  const message =
    response.data?.message
      ?.toLowerCase()
      .trim();

  return (
    message === "transactions not found" ||
    message?.includes(
      "transactions not found",
    ) === true
  );
}

/* ============================================================
   GET TRANSACTION BY ID
============================================================ */

export async function getTransactionById(
  transactionId: string,
): Promise<{
  success: boolean;
  message: string;
  data: WalletTransaction;
}> {
  const response =
    await axiosInstance.get<{
      success: boolean;
      message: string;
      data: WalletTransaction;
    }>(
      `/transactions/get-transaction-by-id/${transactionId}`,
    );

  return response.data;
}

/* ============================================================
   REQUEST WITHDRAWAL
============================================================ */

export async function requestWithdrawal(
  payload: WithdrawalRequest,
): Promise<WithdrawalResponse> {
  const response =
    await axiosInstance.post<WithdrawalResponse>(
      `/withdrawals/request-withdrawal`,
      payload,
    );

  return response.data;
}