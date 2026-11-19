





"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  CreditCard,
  RefreshCw,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import {
  getSchoolSubscription,
  getSchoolSubscriptionPayments,
  type SchoolSubscription,
  type SchoolSubscriptionPayment,
} from "@/lib/schools/portal/services/subscription.service"; 

import Card, {
  CardContent,
  CardHeader,
} from "@/components/schools/ui/Card";

import Button from "@/components/schools/ui/Button";
import LoadingState from "@/components/schools/shared/LoadingState";

const initialSubscription: SchoolSubscription = {
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

function formatDate(value: string | null): string {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString();
}

function formatAmount(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency || "NGN",
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

export default function SchoolSubscriptionPage() {
  const [subscription, setSubscription] =
    useState<SchoolSubscription>(initialSubscription);

  const [payments, setPayments] = useState<
    SchoolSubscriptionPayment[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSubscription = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [subscriptionResult, paymentResult] = await Promise.all([
        getSchoolSubscription(),
        getSchoolSubscriptionPayments(),
      ]);

      setSubscription(subscriptionResult);
      setPayments(paymentResult);
    } catch (err) {
      console.error("Failed to load subscription:", err);
      setError("Unable to load subscription information.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSubscription();
  }, [loadSubscription]);

  if (loading) {
    return <LoadingState message="Loading subscription..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            School Subscription
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View your school's current plan and payment history.
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={loadSubscription}
          leftIcon={<RefreshCw size={16} />}
        >
          Refresh
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-blue-600" />
                <span className="text-sm font-medium text-gray-500">
                  Current Plan
                </span>
              </div>

              <h2 className="mt-3 text-2xl font-bold text-gray-900">
                {subscription.planName}
              </h2>

              <p className="mt-1 text-sm capitalize text-gray-500">
                {subscription.billingCycle || "Billing cycle not specified"}
              </p>
            </div>

            <div className="sm:text-right">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                  subscription.status.toLowerCase() === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {subscription.status}
              </span>

              <p className="mt-3 text-2xl font-bold text-gray-900">
                {formatAmount(
                  subscription.amount,
                  subscription.currency
                )}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 border-t border-gray-100 pt-5 sm:grid-cols-3">
            <div>
              <p className="text-xs text-gray-500">Start Date</p>
              <p className="mt-1 font-medium text-gray-900">
                {formatDate(subscription.startDate)}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">End Date</p>
              <p className="mt-1 font-medium text-gray-900">
                {formatDate(subscription.endDate)}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Next Billing Date</p>
              <p className="mt-1 font-medium text-gray-900">
                {formatDate(subscription.nextBillingDate)}
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2 text-sm text-gray-600">
            <CalendarDays size={17} />
            Auto-renewal: {subscription.autoRenew ? "Enabled" : "Disabled"}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Wallet size={19} className="text-blue-600" />
            <h2 className="font-semibold text-gray-900">
              Payment History
            </h2>
          </div>
        </CardHeader>

        <CardContent>
          {payments.length === 0 ? (
            <div className="py-10 text-center">
              <CreditCard
                size={32}
                className="mx-auto text-gray-400"
              />
              <p className="mt-3 text-sm text-gray-500">
                No subscription payments found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs text-gray-500">
                    <th className="px-3 py-3 font-medium">Reference</th>
                    <th className="px-3 py-3 font-medium">Amount</th>
                    <th className="px-3 py-3 font-medium">Method</th>
                    <th className="px-3 py-3 font-medium">Date</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-3 py-4 font-medium text-gray-900">
                        {payment.reference || payment.id}
                      </td>
                      <td className="px-3 py-4 text-gray-700">
                        {formatAmount(payment.amount, payment.currency)}
                      </td>
                      <td className="px-3 py-4 capitalize text-gray-600">
                        {payment.paymentMethod || "—"}
                      </td>
                      <td className="px-3 py-4 text-gray-600">
                        {formatDate(payment.paidAt ?? payment.createdAt)}
                      </td>
                      <td className="px-3 py-4">
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-700">
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
