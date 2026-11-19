






"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";

import {
  Check,
  CreditCard,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  Edit3,
  GraduationCap,
  Layers3,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Users,
  X,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

import Button from "@/components/schools/ui/Button";
import Card, {
  CardContent,
  CardHeader,
} from "@/components/schools/ui/Card";

import StatusBadge from "@/components/schools/shared/StatusBadge";
import EmptyState from "@/components/schools/shared/EmptyState";
import LoadingState from "@/components/schools/shared/LoadingState";

import {
  getSubscriptionPlans,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
} from "@/lib/schools/management/services/subscription-plan.service";


/* ---------------------------------------------
   Types
--------------------------------------------- */

interface SubscriptionPlan {
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

interface SubscriptionPlanPayload {
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  maxStudents: number;
  maxStaff: number;
  maxStorage: number;
  features: string[];
  isActive: boolean;
  isPopular: boolean;
}

type PlanFilter = "ALL" | "ACTIVE" | "INACTIVE";

const EMPTY_FORM: SubscriptionPlanPayload = {
  name: "",
  description: "",
  monthlyPrice: 0,
  yearlyPrice: 0,
  currency: "NGN",
  maxStudents: 100,
  maxStaff: 5,
  maxStorage: 5,
  features: [],
  isActive: true,
  isPopular: false,
};

const CURRENCY_OPTIONS = [
  { label: "Nigerian Naira (₦)", value: "NGN" },
  { label: "US Dollar ($)", value: "USD" },
  { label: "British Pound (£)", value: "GBP" },
];

const FEATURE_OPTIONS = [
  "Student management",
  "Staff management",
  "Class management",
  "Attendance tracking",
  "Examination management",
  "Online CBT examinations",
  "Results and report cards",
  "School fees management",
  "Payment records",
  "Parent portal",
  "Student portal",
  "Teacher portal",
  "School announcements",
  "Performance analytics",
  "Question bank access",
  "Custom school branding",
  "Priority support",
];

/* ---------------------------------------------
   Helpers
--------------------------------------------- */

function getId(plan: SubscriptionPlan): string {
  return plan._id || plan.id || "";
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

function unwrapResponse<T>(response: unknown): T | null {
  if (!response || typeof response !== "object") {
    return null;
  }

  const outer = response as {
    data?: unknown;
    success?: boolean;
    message?: string;
  };

  const body = outer.data ?? response;

  if (body && typeof body === "object" && "data" in body) {
    const envelope = body as {
      success?: boolean;
      message?: string;
      data?: T;
    };

    if (envelope.success === false) {
      throw new Error(envelope.message || "The request was unsuccessful.");
    }

    return envelope.data ?? null;
  }

  return body as T;
}

function formatPrice(
  amount: number,
  currency = "NGN"
): string {
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

function formatDate(value?: string): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* ---------------------------------------------
   Main page
--------------------------------------------- */

export default function SchoolSubscriptionPlansPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<PlanFilter>("ALL");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] =
    useState<SubscriptionPlan | null>(null);

  const [form, setForm] =
    useState<SubscriptionPlanPayload>(EMPTY_FORM);

  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [planToDelete, setPlanToDelete] =
    useState<SubscriptionPlan | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  const [planToToggle, setPlanToToggle] =
    useState<SubscriptionPlan | null>(null);

  const [isToggling, setIsToggling] = useState(false);

  /* ---------------------------------------------
     Load plans
  --------------------------------------------- */

  const loadPlans = useCallback(async (refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setError("");

      const response = await getSubscriptionPlans();
      const data = unwrapResponse<unknown>(response);

      if (Array.isArray(data)) {
        setPlans(data as SubscriptionPlan[]);
      } else if (data && typeof data === "object") {
        const result = data as {
          plans?: SubscriptionPlan[];
          subscriptionPlans?: SubscriptionPlan[];
          records?: SubscriptionPlan[];
          data?: SubscriptionPlan[];
        };

        setPlans(
          result.plans ||
            result.subscriptionPlans ||
            result.records ||
            result.data ||
            []
        );
      } else {
        setPlans([]);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadPlans();
  }, [loadPlans]);

  /* ---------------------------------------------
     Statistics
  --------------------------------------------- */

  const statistics = useMemo(() => {
    const active = plans.filter((plan) => plan.isActive).length;
    const inactive = plans.length - active;
    const popular = plans.filter((plan) => plan.isPopular).length;

    return {
      total: plans.length,
      active,
      inactive,
      popular,
    };
  }, [plans]);

  /* ---------------------------------------------
     Search and filters
  --------------------------------------------- */

  const filteredPlans = useMemo(() => {
    const query = search.trim().toLowerCase();

    return plans.filter((plan) => {
      const matchesSearch =
        !query ||
        plan.name.toLowerCase().includes(query) ||
        (plan.description || "").toLowerCase().includes(query);

      const matchesFilter =
        filter === "ALL" ||
        (filter === "ACTIVE" && plan.isActive) ||
        (filter === "INACTIVE" && !plan.isActive);

      return matchesSearch && matchesFilter;
    });
  }, [plans, search, filter]);

  /* ---------------------------------------------
     Form helpers
  --------------------------------------------- */

  const updateForm = <K extends keyof SubscriptionPlanPayload>(
    field: K,
    value: SubscriptionPlanPayload[K]
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const openCreateModal = () => {
    setEditingPlan(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setIsFormOpen(true);
  };

  const openEditModal = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);

    setForm({
      name: plan.name || "",
      description: plan.description || "",
      monthlyPrice: Number(plan.monthlyPrice) || 0,
      yearlyPrice: Number(plan.yearlyPrice) || 0,
      currency: plan.currency || "NGN",
      maxStudents: Number(plan.maxStudents) || 0,
      maxStaff: Number(plan.maxStaff) || 0,
      maxStorage: Number(plan.maxStorage) || 0,
      features: Array.isArray(plan.features) ? plan.features : [],
      isActive: Boolean(plan.isActive),
      isPopular: Boolean(plan.isPopular),
    });

    setFormError("");
    setIsFormOpen(true);
  };

  const toggleFeature = (feature: string) => {
    const exists = form.features.includes(feature);

    updateForm(
      "features",
      exists
        ? form.features.filter((item) => item !== feature)
        : [...form.features, feature]
    );
  };

  /* ---------------------------------------------
     Save plan
  --------------------------------------------- */

  const handleSavePlan = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setFormError("");

    if (!form.name.trim()) {
      setFormError("Please enter a subscription plan name.");
      return;
    }

    if (form.monthlyPrice < 0 || form.yearlyPrice < 0) {
      setFormError("Prices cannot be negative.");
      return;
    }

    if (
      form.monthlyPrice === 0 &&
      form.yearlyPrice === 0
    ) {
      setFormError("Enter at least one subscription price.");
      return;
    }

    if (form.maxStudents < 0 || form.maxStaff < 0 || form.maxStorage < 0) {
      setFormError("Plan limits cannot be negative.");
      return;
    }

    try {
      setIsSaving(true);

      const payload: SubscriptionPlanPayload = {
        ...form,
        name: form.name.trim(),
        description: form.description.trim(),
        features: form.features,
      };

      if (editingPlan) {
        const planId = getId(editingPlan);

        if (!planId) {
          throw new Error("This subscription plan has no valid ID.");
        }

        const response = await updateSubscriptionPlan(
          planId,
          payload
        );

        unwrapResponse<unknown>(response);

        setSuccessMessage("Subscription plan updated successfully.");
      } else {
        const response = await createSubscriptionPlan(payload);

        unwrapResponse<unknown>(response);

        setSuccessMessage("Subscription plan created successfully.");
      }

      setIsFormOpen(false);
      setEditingPlan(null);
      setForm(EMPTY_FORM);

      await loadPlans(true);
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  /* ---------------------------------------------
     Delete plan
  --------------------------------------------- */

  const handleDeletePlan = async () => {
    if (!planToDelete) return;

    const planId = getId(planToDelete);

    if (!planId) {
      setError("This subscription plan has no valid ID.");
      return;
    }

    try {
      setIsDeleting(true);
      setError("");

      const response = await deleteSubscriptionPlan(planId);

      unwrapResponse<unknown>(response);

      setPlanToDelete(null);
      setSuccessMessage("Subscription plan deleted successfully.");

      await loadPlans(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  /* ---------------------------------------------
     Toggle
  --------------------------------------------- */

  const handleToggleStatus = async () => {
    if (!planToToggle) return;

    const planId = getId(planToToggle);

    if (!planId) {
      setError("This subscription plan has no valid ID.");
      return;
    }

    try {
      setIsToggling(true);
      setError("");

      const response = await updateSubscriptionPlan(planId, {
        isActive: !planToToggle.isActive,
      });

      unwrapResponse<unknown>(response);

      setPlanToToggle(null);

      setSuccessMessage(
        planToToggle.isActive
          ? "Subscription plan deactivated."
          : "Subscription plan activated."
      );

      await loadPlans(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <Layers3 size={16} />
            <span>School Management</span>
            <span>/</span>
            <span className="text-gray-800">
              Subscription Plans
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Subscription Plans
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Create and manage the subscription packages available to schools.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => void loadPlans(true)}
            disabled={isRefreshing}
            leftIcon={
              isRefreshing ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <RefreshCw size={16} />
              )
            }
          >
            Refresh
          </Button>

          <Button
            type="button"
            onClick={openCreateModal}
            leftIcon={<Plus size={17} />}
          >
            Create plan
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <AlertMessage
          type="success"
          message={successMessage}
          onClose={() => setSuccessMessage("")}
        />
      )}

      {error && (
        <AlertMessage
          type="error"
          message={error}
          onClose={() => setError("")}
        />
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total plans"
          value={statistics.total}
          icon={<Layers3 size={20} />}
          color="blue"
        />

        <StatCard
          label="Active plans"
          value={statistics.active}
          icon={<CheckCircle2 size={20} />}
          color="green"
        />

        <StatCard
          label="Inactive plans"
          value={statistics.inactive}
          icon={<Clock size={20} />}
          color="amber"
        />

        <StatCard
          label="Popular plans"
          value={statistics.popular}
          icon={<ShieldCheck size={20} />}
          color="purple"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.currentTarget.value)
                }
                placeholder="Search subscription plans..."
                className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <select
              value={filter}
              onChange={(event) =>
                setFilter(event.currentTarget.value as PlanFilter)
              }
              className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 md:w-48"
            >
              <option value="ALL">All plans</option>
              <option value="ACTIVE">Active plans</option>
              <option value="INACTIVE">Inactive plans</option>
            </select>
          </div>

          <p className="mt-3 text-xs text-gray-500">
            Showing {filteredPlans.length} of {plans.length} subscription plans
          </p>
        </CardContent>
      </Card>

      {/* Plans */}
      {isLoading ? (
        <Card>
          <CardContent className="p-8">
            <LoadingState />
          </CardContent>
        </Card>
      ) : error && plans.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle
              size={32}
              className="mx-auto mb-3 text-red-400"
            />
            <p className="font-semibold text-gray-800">
              Unable to load subscription plans
            </p>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <div className="mt-4">
              <Button
                type="button"
                onClick={() => void loadPlans(true)}
              >
                Try again
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : filteredPlans.length === 0 ? (
        <Card>
          <CardContent className="p-8">
            
            <EmptyState
  icon={<CreditCard size={32} />}
  title="No subscription plans found"
  description={
    plans.length === 0
      ? "No subscription plans have been created yet."
      : "Try changing your search or filter settings."
  }
/>

            {plans.length === 0 && (
              <div className="mt-4 flex justify-center">
                <Button
                  type="button"
                  onClick={openCreateModal}
                  leftIcon={<Plus size={16} />}
                >
                  Create first plan
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop table */}
          <Card>
            <CardHeader>
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Available subscription plans
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Manage pricing, features and school access limits.
                </p>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[950px] text-left">
                  <thead>
                    <tr className="border-y border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      <th className="px-5 py-4">Plan</th>
                      <th className="px-5 py-4">Monthly</th>
                      <th className="px-5 py-4">Yearly</th>
                      <th className="px-5 py-4">Limits</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredPlans.map((plan) => (
                      <tr
                        key={getId(plan)}
                        className="transition hover:bg-gray-50/70"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900">
                              {plan.name}
                            </p>

                            {plan.isPopular && (
                              <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                                POPULAR
                              </span>
                            )}
                          </div>

                          <p className="mt-1 max-w-xs truncate text-xs text-gray-500">
                            {plan.description || "No description"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-900">
                            {formatPrice(
                              plan.monthlyPrice,
                              plan.currency
                            )}
                          </p>
                          <p className="text-xs text-gray-400">per month</p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-900">
                            {formatPrice(
                              plan.yearlyPrice,
                              plan.currency
                            )}
                          </p>
                          <p className="text-xs text-gray-400">per year</p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm text-gray-700">
                            {plan.maxStudents?.toLocaleString() ?? "—"} students
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            {plan.maxStaff?.toLocaleString() ?? "—"} staff
                            {" · "}
                            {plan.maxStorage ?? "—"} GB
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge
                            status={plan.isActive ? "active" : "inactive"}
                          />
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <ActionButton
                              label="Edit plan"
                              onClick={() => openEditModal(plan)}
                            >
                              <Edit3 size={16} />
                            </ActionButton>

                            <ActionButton
                              label={
                                plan.isActive
                                  ? "Deactivate plan"
                                  : "Activate plan"
                              }
                              onClick={() => setPlanToToggle(plan)}
                            >
                              {plan.isActive ? (
                                <ToggleRight size={18} />
                              ) : (
                                <ToggleLeft size={18} />
                              )}
                            </ActionButton>

                            <ActionButton
                              label="Delete plan"
                              danger
                              onClick={() => setPlanToDelete(plan)}
                            >
                              <Trash2 size={16} />
                            </ActionButton>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile plan cards */}
              <div className="grid grid-cols-1 gap-4 p-4 lg:hidden">
                {filteredPlans.map((plan) => (
                  <div
                    key={getId(plan)}
                    className="rounded-xl border border-gray-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-gray-900">
                            {plan.name}
                          </h3>

                          {plan.isPopular && (
                            <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                              POPULAR
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-xs text-gray-500">
                          {plan.description || "No description"}
                        </p>
                      </div>

                      <StatusBadge
                        status={plan.isActive ? "active" : "inactive"}
                      />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-xs text-gray-500">Monthly</p>
                        <p className="mt-1 font-bold text-gray-900">
                          {formatPrice(
                            plan.monthlyPrice,
                            plan.currency
                          )}
                        </p>
                      </div>

                      <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-xs text-gray-500">Yearly</p>
                        <p className="mt-1 font-bold text-gray-900">
                          {formatPrice(
                            plan.yearlyPrice,
                            plan.currency
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
                      <span>
                        {plan.maxStudents?.toLocaleString() ?? "—"} students
                      </span>
                      <span>·</span>
                      <span>{plan.maxStaff ?? "—"} staff</span>
                      <span>·</span>
                      <span>{plan.maxStorage ?? "—"} GB storage</span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-3">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => openEditModal(plan)}
                        leftIcon={<Edit3 size={14} />}
                      >
                        Edit
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setPlanToToggle(plan)}
                      >
                        {plan.isActive ? "Deactivate" : "Activate"}
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        variant="danger"
                        onClick={() => setPlanToDelete(plan)}
                        leftIcon={<Trash2 size={14} />}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Create / Edit modal */}
      {isFormOpen && (
        <ModalShell
          title={editingPlan ? "Edit subscription plan" : "Create subscription plan"}
          onClose={() => {
            if (!isSaving) {
              setIsFormOpen(false);
              setFormError("");
            }
          }}
          wide
        >
          <form onSubmit={handleSavePlan} className="space-y-6">
            {formError && (
              <AlertMessage
                type="error"
                message={formError}
                onClose={() => setFormError("")}
              />
            )}

            {/* Basic information */}
            <section>
              <SectionHeading
                title="Basic information"
                description="Set the name and description of this plan."
              />

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Plan name" required>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                      updateForm("name", event.currentTarget.value)
                    }
                    placeholder="e.g. Premium"
                    required
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Currency">
                  <select
                    value={form.currency}
                    onChange={(event) =>
                      updateForm("currency", event.currentTarget.value)
                    }
                    className={inputClass}
                  >
                    {CURRENCY_OPTIONS.map((currency) => (
                      <option
                        key={currency.value}
                        value={currency.value}
                      >
                        {currency.label}
                      </option>
                    ))}
                  </select>
                </FormField>

                <div className="sm:col-span-2">
                  <FormField label="Description">
                    <textarea
                      value={form.description}
                      onChange={(event) =>
                        updateForm("description", event.currentTarget.value)
                      }
                      rows={3}
                      placeholder="Describe what schools get with this plan..."
                      className={inputClass}
                    />
                  </FormField>
                </div>
              </div>
            </section>

            {/* Pricing */}
            <section>
              <SectionHeading
                title="Subscription pricing"
                description="Set the monthly and yearly subscription prices."
              />

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Monthly price" required>
                  <NumberInput
                    value={form.monthlyPrice}
                    onChange={(value) => updateForm("monthlyPrice", value)}
                    min={0}
                    placeholder="Monthly amount"
                  />
                </FormField>

                <FormField label="Yearly price" required>
                  <NumberInput
                    value={form.yearlyPrice}
                    onChange={(value) => updateForm("yearlyPrice", value)}
                    min={0}
                    placeholder="Yearly amount"
                  />
                </FormField>
              </div>
            </section>

            {/* Limits */}
            <section>
              <SectionHeading
                title="Plan limits"
                description="Define the maximum resources available to a school."
              />

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <FormField label="Maximum students">
                  <NumberInput
                    value={form.maxStudents}
                    onChange={(value) => updateForm("maxStudents", value)}
                    min={0}
                  />
                </FormField>

                <FormField label="Maximum staff">
                  <NumberInput
                    value={form.maxStaff}
                    onChange={(value) => updateForm("maxStaff", value)}
                    min={0}
                  />
                </FormField>

                <FormField label="Storage (GB)">
                  <NumberInput
                    value={form.maxStorage}
                    onChange={(value) => updateForm("maxStorage", value)}
                    min={0}
                  />
                </FormField>
              </div>

              <p className="mt-2 text-xs text-gray-400">
                Confirm with your backend whether zero means unlimited or no access.
              </p>
            </section>

            {/* Features */}
            <section>
              <SectionHeading
                title="Included features"
                description="Choose the features available to schools on this plan."
              />

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {FEATURE_OPTIONS.map((feature) => {
                  const checked = form.features.includes(feature);

                  return (
                    <label
                      key={feature}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition ${
                        checked
                          ? "border-blue-200 bg-blue-50 text-blue-800"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleFeature(feature)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />

                      <span>{feature}</span>

                      {checked && (
                        <Check
                          size={15}
                          className="ml-auto text-blue-600"
                        />
                      )}
                    </label>
                  );
                })}
              </div>

              <p className="mt-2 text-xs text-gray-500">
                {form.features.length} features selected
              </p>
            </section>

            {/* Visibility */}
            <section>
              <SectionHeading
                title="Plan settings"
                description="Control availability and plan highlighting."
              />

              <div className="mt-4 space-y-3">
                <ToggleField
                  checked={form.isActive}
                  onChange={(value) => updateForm("isActive", value)}
                  label="Active plan"
                  description="Schools can select this plan when subscribing."
                />

                <ToggleField
                  checked={form.isPopular}
                  onChange={(value) => updateForm("isPopular", value)}
                  label="Mark as popular"
                  description="Highlight this plan as a recommended option."
                />
              </div>
            </section>

            <div className="flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={isSaving}
                onClick={() => setIsFormOpen(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSaving}
                isLoading={isSaving}
                loadingText="Saving..."
                leftIcon={!isSaving ? <Check size={16} /> : undefined}
              >
                {editingPlan ? "Save changes" : "Create plan"}
              </Button>
            </div>
          </form>
        </ModalShell>
      )}

      {/* Delete confirmation */}
      {planToDelete && (
        <ModalShell
          title="Delete subscription plan"
          onClose={() => {
            if (!isDeleting) setPlanToDelete(null);
          }}
        >
          <div className="space-y-4">
            <div className="rounded-xl border border-red-100 bg-red-50 p-4">
              <div className="flex gap-3">
                <Trash2
                  size={22}
                  className="shrink-0 text-red-600"
                />

                <div>
                  <p className="font-semibold text-red-900">
                    Delete {planToDelete.name}?
                  </p>
                  <p className="mt-1 text-sm text-red-700">
                    This will remove the subscription plan. Check your
                    backend rules before deleting plans already assigned
                    to schools.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={isDeleting}
                onClick={() => setPlanToDelete(null)}
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="danger"
                isLoading={isDeleting}
                loadingText="Deleting..."
                onClick={handleDeletePlan}
              >
                Delete plan
              </Button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* Activate / deactivate confirmation */}
      {planToToggle && (
        <ModalShell
          title={
            planToToggle.isActive
              ? "Deactivate subscription plan"
              : "Activate subscription plan"
          }
          onClose={() => {
            if (!isToggling) setPlanToToggle(null);
          }}
        >
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="font-semibold text-gray-900">
                {planToToggle.name}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {planToToggle.isActive
                  ? "Schools may no longer be able to select this plan for new subscriptions."
                  : "This plan will become available for schools to select, subject to your backend rules."}
              </p>
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={isToggling}
                onClick={() => setPlanToToggle(null)}
              >
                Cancel
              </Button>

              <Button
                type="button"
                isLoading={isToggling}
                loadingText="Updating..."
                onClick={handleToggleStatus}
              >
                {planToToggle.isActive ? "Deactivate plan" : "Activate plan"}
              </Button>
            </div>
          </div>
        </ModalShell>
      )}
    </div>
  );
}

/* ---------------------------------------------
   Shared styles
--------------------------------------------- */

const inputClass =
  "h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: ReactNode;
  color: "blue" | "green" | "amber" | "purple";
}) {
  const styles = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${styles[color]}`}
        >
          {icon}
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-gray-900">
            {value.toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function NumberInput({
  value,
  onChange,
  min = 0,
  placeholder,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  placeholder?: string;
}) {
  return (
    <input
      type="number"
      min={min}
      value={value}
      placeholder={placeholder}
      onChange={(event) =>
        onChange(Math.max(min, Number(event.currentTarget.value) || 0))
      }
      className={inputClass}
    />
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-xs text-gray-500">{description}</p>
    </div>
  );
}

function ToggleField({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-gray-200 p-3">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      </div>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.currentTarget.checked)}
        className="h-4 w-4 shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
    </label>
  );
}

function ActionButton({
  children,
  label,
  onClick,
  danger = false,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`rounded-lg border p-2 transition ${
        danger
          ? "border-red-100 text-red-500 hover:bg-red-50"
          : "border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      {children}
    </button>
  );
}

function AlertMessage({
  type,
  message,
  onClose,
}: {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}) {
  const isSuccess = type === "success";

  return (
    <div
      className={`flex items-start justify-between gap-3 rounded-xl border p-3 text-sm ${
        isSuccess
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      <div className="flex items-start gap-2">
        {isSuccess ? (
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
        ) : (
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
        )}
        <span>{message}</span>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss notification"
      >
        <X size={17} />
      </button>
    </div>
  );
}

function ModalShell({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`max-h-[92vh] w-full overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6 ${
          wide ? "max-w-3xl" : "max-w-lg"
        }`}
      >
        <div className="mb-6 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close modal"
          >
            <X size={19} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
