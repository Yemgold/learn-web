




import { axiosInstance } from "@/lib/api/axios";

/* ============================================================
   WALLET
============================================================ */

export interface Wallet {
  _id: string;
  userId: string;
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
  data: number;
}

/* ============================================================
   WALLET TRANSACTIONS
============================================================ */

export interface WalletTransaction {
  _id: string;
  walletId: string;
  withdrawalId?: string;
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

export type WalletTransactionsResponse = TransactionsResponse;

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
   FUND WALLET
============================================================ */

/**
 * Provider accepted by the funding endpoint.
 *
 * Change the value to match your backend enum if necessary.
 */
export type WalletFundingProvider = "MONNIFY";

export interface FundWalletRequest {
  walletId: string;
  provider: WalletFundingProvider;
  amount: number;
}

/**
 * The backend response may contain a payment checkout URL.
 * Additional response fields are permitted.
 */
export interface FundWalletData {
  checkoutUrl?: string;
  paymentUrl?: string;
  authorizationUrl?: string;
  redirectUrl?: string;
  transactionReference?: string;
  reference?: string;
  [key: string]: unknown;
}

export interface FundWalletResponse {
  success: boolean;
  message: string;
  data?: FundWalletData | string | null;
  [key: string]: unknown;
}

/**
 * Start wallet funding.
 *
 * Endpoint:
 * POST /wallets/fund-wallet-by-walletId/{walletId}/{provider}
 *
 * Assumed request body:
 * { amount: number }
 *
 * The amount is supplied in naira unless your backend specifies
 * a different request contract.
 */
export async function fundWalletByWalletId(
  payload: FundWalletRequest,
): Promise<FundWalletResponse> {
  const { walletId, provider, amount } = payload;

  if (!walletId?.trim()) {
    throw new Error("Wallet ID is required.");
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Enter a valid funding amount.");
  }

  const response =
    await axiosInstance.post<FundWalletResponse>(
      `/wallets/fund-wallet-by-walletId/${encodeURIComponent(
        walletId,
      )}/${encodeURIComponent(provider)}`,
      { amount },
    );

  return response.data;
}

/* ============================================================
   GET WALLET BY USER ID
============================================================ */

export async function getWalletByUserId(
  userId: string,
): Promise<WalletResponse> {
  const response = await axiosInstance.get<WalletResponse>(
    `/wallets/get-wallet-by-userId/${encodeURIComponent(
      userId,
    )}`,
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
    `/wallets/get-wallet-by-walletId/${encodeURIComponent(
      walletId,
    )}`,
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
      `/wallets/get-wallet-balance-by-walletId/${encodeURIComponent(
        walletId,
      )}`,
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
        `/transactions/get-all-transactions-with-userId/${encodeURIComponent(
          userId,
        )}`,
        {
          params: {
            page,
            limit,
          },
        },
      );

    const data = response.data;

    if (
      !data?.data ||
      !Array.isArray(data.data.transactionObj)
    ) {
      return createEmptyTransactionsResponse();
    }

    return data;
  } catch (error: unknown) {
    if (isAxios404TransactionsNotFound(error)) {
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
  if (!error || typeof error !== "object") {
    return false;
  }

  const axiosError = error as {
    response?: {
      status?: number;
      data?: {
        message?: string;
      };
    };
  };

  if (axiosError.response?.status !== 404) {
    return false;
  }

  const message = axiosError.response.data?.message
    ?.toLowerCase()
    .trim();

  return message?.includes("transactions not found") === true;
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
  const response = await axiosInstance.get<{
    success: boolean;
    message: string;
    data: WalletTransaction;
  }>(
    `/transactions/get-transaction-by-id/${encodeURIComponent(
      transactionId,
    )}`,
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
      "/withdrawals/request-withdrawal",
      payload,
    );

  return response.data;
}
