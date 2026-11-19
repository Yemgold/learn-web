




import { apiClient } from "@/lib/api";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type SchoolSubscriptionStatus =
  | "ACTIVE"
  | "PENDING"
  | "EXPIRED"
  | "CANCELLED"
  | "SUSPENDED";

export type SubscriptionBillingCycle = "MONTHLY" | "YEARLY";

export interface SchoolSubscriptionSchool {
  _id?: string;
  id?: string;
  schoolName?: string;
  name?: string;
  subDomain?: string;
  schoolEmail?: string;
}

export interface SchoolSubscriptionPlan {
  _id?: string;
  id?: string;
  name?: string;
  description?: string;
  monthlyPrice?: number;
  yearlyPrice?: number;
}

export interface SchoolSubscription {
  _id?: string;
  id?: string;

  schoolId?: string;
  school?: SchoolSubscriptionSchool;
  schoolName?: string;

  planId?: string;
  plan?: SchoolSubscriptionPlan;
  planName?: string;

  amount?: number;
  price?: number;
  currency?: string;

  billingCycle?: SubscriptionBillingCycle | string;

  status?: SchoolSubscriptionStatus | string;
  paymentStatus?: string;
  paymentReference?: string;

  startsAt?: string;
  startDate?: string;
  expiresAt?: string;
  endDate?: string;
  nextBillingDate?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface GetSchoolSubscriptionsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: SchoolSubscriptionStatus;
  schoolId?: string;
  planId?: string;
  billingCycle?: SubscriptionBillingCycle;
}

export interface UpdateSchoolSubscriptionStatusPayload {
  status: SchoolSubscriptionStatus;
}

export interface SchoolSubscriptionListData {
  subscriptions?: SchoolSubscription[];
  schoolSubscriptions?: SchoolSubscription[];
  records?: SchoolSubscription[];
  data?: SchoolSubscription[];

  total?: number;
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
  limit?: number;
}

export interface SchoolSubscriptionApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/* -------------------------------------------------------------------------- */
/* API Endpoints                                                              */
/* -------------------------------------------------------------------------- */

/**
 * These routes are proposed defaults.
 * Confirm them against your backend routes before relying on them.
 */
const SUBSCRIPTION_ENDPOINTS = {
  list: "/school-subscriptions",

  updateStatus: (subscriptionId: string) =>
    `/school-subscriptions/${encodeURIComponent(subscriptionId)}/status`,
};

/* -------------------------------------------------------------------------- */
/* Get School Subscriptions                                                   */
/* -------------------------------------------------------------------------- */

export const getSchoolSubscriptions = (
  params?: GetSchoolSubscriptionsParams
) => {
  return apiClient.get<
    SchoolSubscriptionApiResponse<
      SchoolSubscriptionListData | SchoolSubscription[]
    >
  >(SUBSCRIPTION_ENDPOINTS.list, {
    params: {
      ...(params?.page !== undefined && { page: params.page }),
      ...(params?.limit !== undefined && { limit: params.limit }),
      ...(params?.search && { search: params.search }),
      ...(params?.status && { status: params.status }),
      ...(params?.schoolId && { schoolId: params.schoolId }),
      ...(params?.planId && { planId: params.planId }),
      ...(params?.billingCycle && {
        billingCycle: params.billingCycle,
      }),
    },
  });
};

/* -------------------------------------------------------------------------- */
/* Update Subscription Status                                                */
/* -------------------------------------------------------------------------- */

export const updateSchoolSubscriptionStatus = (
  subscriptionId: string,
  payload: UpdateSchoolSubscriptionStatusPayload
) => {
  if (!subscriptionId?.trim()) {
    throw new Error("A valid subscription ID is required.");
  }

  if (!payload?.status) {
    throw new Error("A valid subscription status is required.");
  }

  return apiClient.patch<
    SchoolSubscriptionApiResponse<SchoolSubscription>
  >(
    SUBSCRIPTION_ENDPOINTS.updateStatus(subscriptionId),
    payload
  );
};
