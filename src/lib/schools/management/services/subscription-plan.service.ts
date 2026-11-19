



import { apiClient } from "@/lib/api";

/* ---------------------------------------------
   Types
--------------------------------------------- */

export interface SubscriptionPlan {
  _id?: string;
  id?: string;

  name: string;
  description?: string;

  monthlyPrice: number;
  yearlyPrice: number;

  currency?: string;

  maxStudents?: number;
  maxStaff?: number;
  maxStorage?: number;

  features: string[];

  isActive: boolean;
  isPopular?: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSubscriptionPlanPayload {
  name: string;
  description?: string;

  monthlyPrice: number;
  yearlyPrice: number;

  currency?: string;

  maxStudents?: number;
  maxStaff?: number;
  maxStorage?: number;

  features: string[];

  isActive?: boolean;
  isPopular?: boolean;
}

export type UpdateSubscriptionPlanPayload =
  Partial<CreateSubscriptionPlanPayload>;

export interface SubscriptionPlanApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface SubscriptionPlanListData {
  plans?: SubscriptionPlan[];
  subscriptionPlans?: SubscriptionPlan[];
  records?: SubscriptionPlan[];
  total?: number;
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
  limit?: number;
}

/* ---------------------------------------------
   API endpoints

   Confirm these paths against your backend routes.
--------------------------------------------- */

const SUBSCRIPTION_PLAN_ENDPOINTS = {
  list: "/school-subscription-plans",
  create: "/school-subscription-plans",
  update: (planId: string) =>
    `/school-subscription-plans/${encodeURIComponent(planId)}`,
  delete: (planId: string) =>
    `/school-subscription-plans/${encodeURIComponent(planId)}`,
};

/* ---------------------------------------------
   Get all subscription plans
--------------------------------------------- */

export const getSubscriptionPlans = () => {
  return apiClient.get<
    SubscriptionPlanApiResponse<SubscriptionPlanListData | SubscriptionPlan[]>
  >(SUBSCRIPTION_PLAN_ENDPOINTS.list);
};

/* ---------------------------------------------
   Create subscription plan
--------------------------------------------- */

export const createSubscriptionPlan = (
  payload: CreateSubscriptionPlanPayload
) => {
  return apiClient.post<
    SubscriptionPlanApiResponse<SubscriptionPlan>
  >(SUBSCRIPTION_PLAN_ENDPOINTS.create, payload);
};

/* ---------------------------------------------
   Update subscription plan
--------------------------------------------- */

export const updateSubscriptionPlan = (
  planId: string,
  payload: UpdateSubscriptionPlanPayload
) => {
  if (!planId.trim()) {
    throw new Error("A valid subscription plan ID is required.");
  }

  return apiClient.patch<
    SubscriptionPlanApiResponse<SubscriptionPlan>
  >(SUBSCRIPTION_PLAN_ENDPOINTS.update(planId), payload);
};

/* ---------------------------------------------
   Delete subscription plan
--------------------------------------------- */

export const deleteSubscriptionPlan = (planId: string) => {
  if (!planId.trim()) {
    throw new Error("A valid subscription plan ID is required.");
  }

  return apiClient.delete<
    SubscriptionPlanApiResponse<null>
  >(SUBSCRIPTION_PLAN_ENDPOINTS.delete(planId));
};
