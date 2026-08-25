


import { BaseEntity } from "./common";

export interface Payment extends BaseEntity {
  amount: number;

  reference: string;

  status:
    | "PENDING"
    | "SUCCESS"
    | "FAILED";

  method: string;
}



export interface CreatePaymentIntentResponse {
  success: boolean;

  data?: {
    paymentUrl: string;
    paymentReference: string;
  };

  message?: string;
}