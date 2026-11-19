




import { apiClient } from "@/lib/api";

export interface SchoolSubscription {
  id: string;
  planName: string;
  planId: string;
  status: string;
  amount: number;
  currency: string;
  billingCycle: string;
  startDate: string | null;
  endDate: string | null;
  nextBillingDate: string | null;
  autoRenew: boolean;
}

export interface SchoolSubscriptionPayment {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  paidAt: string | null;
  createdAt: string | null;
}

export interface RequestSubscriptionRenewalPayload {
  planId: string;
  paymentMethod?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function unwrapResponse(value: unknown): unknown {
  let result = value;

  for (let i = 0; i < 3; i++) {
    if (!isRecord(result) || !("data" in result)) break;
    result = result.data;
  }

  return result;
}

function normalizeSubscription(value: unknown): SchoolSubscription {
  const result = unwrapResponse(value);

  if (!isRecord(result)) {
    return {
      id: "",
      planName: "No subscription",
      planId: "",
      status: "inactive",
      amount: 0,
      currency: "NGN",
      billingCycle: "",
      startDate: null,
      endDate: null,
      nextBillingDate: null,
      autoRenew: false,
    };
  }

  const plan = isRecord(result.plan) ? result.plan : {};

  return {
    id: String(result.id ?? result._id ?? ""),
    planName: String(result.planName ?? plan.name ?? "School Plan"),
    planId: String(result.planId ?? plan.id ?? plan._id ?? ""),
    status: String(result.status ?? "inactive"),
    amount: Number(result.amount ?? plan.amount ?? 0),
    currency: String(result.currency ?? plan.currency ?? "NGN"),
    billingCycle: String(result.billingCycle ?? plan.billingCycle ?? ""),
    startDate: result.startDate ? String(result.startDate) : null,
    endDate: result.endDate ? String(result.endDate) : null,
    nextBillingDate: result.nextBillingDate
      ? String(result.nextBillingDate)
      : null,
    autoRenew: Boolean(result.autoRenew),
  };
}

function normalizePayments(value: unknown): SchoolSubscriptionPayment[] {
  const result = unwrapResponse(value);

  const records = Array.isArray(result)
    ? result
    : isRecord(result) && Array.isArray(result.payments)
      ? result.payments
      : [];

  return records.filter(isRecord).map((payment) => ({
    id: String(payment.id ?? payment._id ?? ""),
    reference: String(payment.reference ?? payment.transactionReference ?? ""),
    amount: Number(payment.amount ?? 0),
    currency: String(payment.currency ?? "NGN"),
    status: String(payment.status ?? "pending"),
    paymentMethod: String(payment.paymentMethod ?? payment.method ?? ""),
    paidAt: payment.paidAt ? String(payment.paidAt) : null,
    createdAt: payment.createdAt ? String(payment.createdAt) : null,
  }));
}

export async function getSchoolSubscription(): Promise<SchoolSubscription> {
  const response: unknown = await apiClient.get("/schools/subscription");
  return normalizeSubscription(response);
}

export async function getSchoolSubscriptionPayments(): Promise<
  SchoolSubscriptionPayment[]
> {
  const response: unknown = await apiClient.get(
    "/schools/subscription/payments"
  );

  return normalizePayments(response);
}

export async function requestSchoolSubscriptionRenewal(
  payload: RequestSubscriptionRenewalPayload
): Promise<unknown> {
  return apiClient.post("/schools/subscription/renew", payload);
}
