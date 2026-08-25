






import { axiosInstance } from "@/lib/api/axios";

/* ============================================================
   TRANSACTION
   ============================================================ */

export interface Transaction {
  _id: string;

  walletId: string;

  withdrawalId?: string;

  amount: number;

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
   PAGINATED RESPONSE
   ============================================================ */

export interface TransactionData {
  totalCount: number;

  totalPages: number;

  transactionObj: Transaction[];
}

export interface TransactionResponse {
  success: boolean;

  message: string;

  data: TransactionData;
}

/* ============================================================
   GET USER TRANSACTIONS
   ============================================================ */

export async function getUserTransactions(
  userId: string,
  page = 1,
  limit = 10,
): Promise<TransactionResponse> {
  const response =
    await axiosInstance.get<TransactionResponse>(
      `/transactions/get-all-transactions-with-userId/${userId}`,
      {
        params: {
          page,
          limit,
        },
      },
    );

  return response.data;
}

/* ============================================================
   GET TRANSACTION BY ID
   ============================================================ */

export async function getTransactionById(
  transactionId: string,
): Promise<{
  success: boolean;
  message: string;
  data: Transaction;
}> {
  const response =
    await axiosInstance.get(
      `/transactions/get-transaction-by-id/${transactionId}`,
    );

  return response.data;
}