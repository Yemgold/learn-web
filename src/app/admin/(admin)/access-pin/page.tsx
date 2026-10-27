



"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clipboard,
  Download,
  KeyRound,
  Loader2,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  Wallet,
  X,
} from "lucide-react";

import { axiosInstance } from "@/lib/api/axios";

/**
 * IMPORTANT:
 * Replace these two paths with the actual routes registered
 * in your backend.
 */
const GENERATE_PINS_ENDPOINT = "/subscription-pins/generate";
const PLANS_ENDPOINT = "/subscription-plans/get-all-plans";

const MAX_QUANTITY = 1000;

interface SubscriptionPlan {
  _id?: string;
  id?: string;
  planId?: string;
  name?: string;
  title?: string;
  planName?: string;
  amount?: number;
  price?: number;
  amountInKobo?: number;
  amountPerPin?: number;
  duration?: string;
  isActive?: boolean;
}

interface PinBatch {
  batchId: string;
  planId: string;
  quantity: number;
  amountPerPin: number;
  pins: string[];
  planName?: string;
  createdAt: string;
}

interface GenerateResponse {
  success?: boolean;
  message?: string;
  data?: unknown;
}

function unwrapResponse(value: unknown): unknown {
  let current = value;

  for (let i = 0; i < 5; i += 1) {
    if (!current || typeof current !== "object") break;

    const obj = current as Record<string, unknown>;

    if (Array.isArray(obj.pins)) return obj;
    if (!("data" in obj)) break;

    current = obj.data;
  }

  return current;
}

function getPlanId(plan: SubscriptionPlan): string {
  return plan._id || plan.id || plan.planId || "";
}

function getPlanName(plan: SubscriptionPlan): string {
  return (
    plan.name ||
    plan.title ||
    plan.planName ||
    "Unnamed subscription plan"
  );
}

function getPlanAmount(plan: SubscriptionPlan): number {
  const value =
    plan.amountPerPin ??
    plan.amountInKobo ??
    plan.amount ??
    plan.price ??
    0;

  return Number(value) || 0;
}

function formatNaira(amountInKobo: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(amountInKobo / 100);
}

function escapeCsv(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function downloadCsv(batch: PinBatch) {
  const rows = [
    ["PIN", "Plan", "Plan ID", "Batch ID", "Amount per PIN"],
    ...batch.pins.map((pin) => [
      pin,
      batch.planName || "",
      batch.planId,
      batch.batchId,
      formatNaira(batch.amountPerPin),
    ]),
  ];

  const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\r\n");
  const blob = new Blob(["\uFEFF", csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `subscription-pins-${batch.batchId}.csv`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

export default function AdminAccessPinPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [quantity, setQuantity] = useState("5");

  const [batches, setBatches] = useState<PinBatch[]>([]);
  const [activeBatch, setActiveBatch] = useState<PinBatch | null>(null);

  const [loadingPlans, setLoadingPlans] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const selectedPlan = useMemo(
    () => plans.find((plan) => getPlanId(plan) === selectedPlanId),
    [plans, selectedPlanId],
  );

  const amountPerPin = selectedPlan ? getPlanAmount(selectedPlan) : 0;

  const parsedQuantity = Number(quantity);

  const validQuantity =
    Number.isInteger(parsedQuantity) &&
    parsedQuantity >= 1 &&
    parsedQuantity <= MAX_QUANTITY;

  const totalAmount = amountPerPin * parsedQuantity;

  const loadPlans = useCallback(async () => {
    setLoadingPlans(true);
    setError("");

    try {
      const response = await axiosInstance.get(PLANS_ENDPOINT);
      const payload = response.data;

      let rawPlans: unknown = payload;

      for (let i = 0; i < 5; i += 1) {
        if (Array.isArray(rawPlans)) break;

        if (!rawPlans || typeof rawPlans !== "object") break;

        const obj = rawPlans as Record<string, unknown>;

        if (Array.isArray(obj.plans)) {
          rawPlans = obj.plans;
          break;
        }

        if (Array.isArray(obj.items)) {
          rawPlans = obj.items;
          break;
        }

        if (Array.isArray(obj.results)) {
          rawPlans = obj.results;
          break;
        }

        if (!("data" in obj)) break;

        rawPlans = obj.data;
      }

      if (!Array.isArray(rawPlans)) {
        throw new Error(
          "The plans endpoint did not return a list of subscription plans.",
        );
      }

      const loadedPlans = rawPlans as SubscriptionPlan[];

      setPlans(loadedPlans);

      setSelectedPlanId((current) => {
        if (current && loadedPlans.some((p) => getPlanId(p) === current)) {
          return current;
        }

        const firstActive =
          loadedPlans.find(
            (p) => p.isActive !== false && getPlanId(p),
          ) || loadedPlans.find((p) => getPlanId(p));

        return firstActive ? getPlanId(firstActive) : "";
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load subscription plans.";

      setError(message);
    } finally {
      setLoadingPlans(false);
    }
  }, []);

  useEffect(() => {
    void loadPlans();
  }, [loadPlans]);

  async function handleGeneratePins(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccessMessage("");
    setCopied(false);

    if (!selectedPlanId) {
      setError("Select a subscription plan first.");
      return;
    }

    if (!validQuantity) {
      setError(`Enter a quantity between 1 and ${MAX_QUANTITY}.`);
      return;
    }

    setGenerating(true);

    try {
      /**
       * Confirm the expected request body with your backend.
       * This assumes the backend accepts planId and quantity.
       */
      const response = await axiosInstance.post<GenerateResponse>(
        GENERATE_PINS_ENDPOINT,
        {
          planId: selectedPlanId,
          quantity: parsedQuantity,
        },
      );

      const root = response.data as Record<string, unknown>;

      if (root.success === false) {
        throw new Error(
          typeof root.message === "string"
            ? root.message
            : "PIN generation failed.",
        );
      }

      const result = unwrapResponse(response.data);

      if (!result || typeof result !== "object") {
        throw new Error("The server returned an invalid PIN batch.");
      }

      const data = result as Record<string, unknown>;

      if (!Array.isArray(data.pins)) {
        throw new Error(
          "No PINs were found in the response. Check the API response format.",
        );
      }

      const pins = data.pins.map(String);

      if (pins.length === 0) {
        throw new Error("The server generated no PINs.");
      }

      const batch: PinBatch = {
        batchId: String(data.batchId || ""),
        planId: String(data.planId || selectedPlanId),
        quantity: Number(data.quantity ?? pins.length),
        amountPerPin: Number(data.amountPerPin ?? amountPerPin),
        pins,
        planName: selectedPlan ? getPlanName(selectedPlan) : "",
        createdAt: new Date().toISOString(),
      };

      if (!batch.batchId) {
        throw new Error(
          "PINs were returned, but the batch ID is missing from the response.",
        );
      }

      setActiveBatch(batch);
      setBatches((previous) => [batch, ...previous]);

      setSuccessMessage(
        `Successfully generated ${pins.length} subscription PIN${pins.length === 1 ? "" : "s"}.`,
      );
    } catch (err: unknown) {
      const axiosError = err as {
        response?: {
          data?: {
            message?: string;
            error?: string;
          };
        };
        message?: string;
      };

      setError(
        axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          axiosError.message ||
          "Unable to generate subscription PINs.",
      );
    } finally {
      setGenerating(false);
    }
  }

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(
        "Clipboard access failed. Select and copy the PINs manually.",
      );
    }
  }

  function copyBatch(batch: PinBatch) {
    void copyText(batch.pins.join("\n"));
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-indigo-600 p-3 text-white shadow-lg shadow-indigo-600/20">
              <KeyRound className="h-7 w-7" />
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
                Administration
              </p>
              <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
                Subscription Access PINs
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                Generate subscription PINs, copy them for distribution,
                and download PIN batches for your agents.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void loadPlans()}
            disabled={loadingPlans}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold transition hover:bg-slate-100 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            <RefreshCw
              className={`h-4 w-4 ${loadingPlans ? "animate-spin" : ""}`}
            />
            Refresh plans
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div className="min-w-0 flex-1">{error}</div>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200"
          >
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            {successMessage}
          </div>
        )}

        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Plans available
              </p>
              <ShieldCheck className="h-5 w-5 text-indigo-500" />
            </div>
            <p className="mt-3 text-3xl font-black">
              {loadingPlans ? "—" : plans.length}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Loaded from your subscription API
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Batches this session
              </p>
              <PackageCheck className="h-5 w-5 text-emerald-500" />
            </div>
            <p className="mt-3 text-3xl font-black">{batches.length}</p>
            <p className="mt-1 text-xs text-slate-500">
              Generated since this page was opened
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                PINs generated
              </p>
              <KeyRound className="h-5 w-5 text-amber-500" />
            </div>
            <p className="mt-3 text-3xl font-black">
              {batches.reduce((sum, batch) => sum + batch.pins.length, 0)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Across batches in this session
            </p>
          </div>
        </div>

        {/* Generate form */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-800 sm:px-7">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold">
                  Generate a new batch
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Choose the subscription and number of PINs to generate.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleGeneratePins} className="space-y-6 p-5 sm:p-7">
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <label
                  htmlFor="subscription-plan"
                  className="mb-2 block text-sm font-bold"
                >
                  Subscription plan
                </label>

                <select
                  id="subscription-plan"
                  value={selectedPlanId}
                  onChange={(event) => setSelectedPlanId(event.target.value)}
                  disabled={loadingPlans || plans.length === 0 || generating}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950"
                >
                  <option value="">
                    {loadingPlans
                      ? "Loading subscription plans..."
                      : plans.length === 0
                        ? "No plans available"
                        : "Select a subscription plan"}
                  </option>

                  {plans.map((plan) => {
                    const id = getPlanId(plan);

                    if (!id) return null;

                    return (
                      <option
                        key={id}
                        value={id}
                        disabled={plan.isActive === false}
                      >
                        {getPlanName(plan)}
                        {plan.isActive === false ? " (Inactive)" : ""}
                      </option>
                    );
                  })}
                </select>

                {selectedPlan && (
                  <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm dark:bg-slate-950">
                    <span className="text-slate-500">Price per PIN</span>
                    <span className="font-extrabold">
                      {formatNaira(amountPerPin)}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="pin-quantity"
                  className="mb-2 block text-sm font-bold"
                >
                  Number of PINs
                </label>

                <input
                  id="pin-quantity"
                  type="number"
                  min={1}
                  max={MAX_QUANTITY}
                  step={1}
                  required
                  value={quantity}
                  disabled={generating}
                  onChange={(event) => setQuantity(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950"
                  placeholder="Enter quantity"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Minimum 1 PIN; maximum {MAX_QUANTITY} PINs per batch.
                </p>
              </div>
            </div>

            {/* Price summary */}
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5 dark:border-indigo-900/60 dark:bg-indigo-950/30">
              <div className="flex items-center gap-2 text-sm font-bold text-indigo-700 dark:text-indigo-300">
                <Wallet className="h-4 w-4" />
                Batch cost estimate
              </div>

              <div className="mt-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {validQuantity ? parsedQuantity : 0} PINs ×{" "}
                    {formatNaira(amountPerPin)}
                  </p>
                  <p className="mt-1 text-3xl font-black tracking-tight">
                    {validQuantity && amountPerPin > 0
                      ? formatNaira(totalAmount)
                      : "—"}
                  </p>
                </div>

                <p className="max-w-xs text-xs leading-5 text-slate-500 dark:text-slate-400">
                  This is an estimate based on the selected plan. The
                  backend determines the actual PIN price and generation
                  result.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={
                generating ||
                loadingPlans ||
                !selectedPlanId ||
                !validQuantity
              }
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-4 text-sm font-extrabold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-64"
            >
              {generating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating PINs...
                </>
              ) : (
                <>
                  <KeyRound className="h-5 w-5" />
                  Generate subscription PINs
                </>
              )}
            </button>
          </form>
        </section>

        {/* Active batch */}
        {activeBatch && (
          <section className="overflow-hidden rounded-3xl border border-emerald-200 bg-white shadow-sm dark:border-emerald-900 dark:bg-slate-900">
            <div className="flex flex-col justify-between gap-4 border-b border-emerald-100 bg-emerald-50/70 p-5 dark:border-emerald-900 dark:bg-emerald-950/20 sm:flex-row sm:items-center sm:px-7">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold">
                    Generated PIN batch
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {activeBatch.pins.length} PINs are ready to copy or
                    download.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => copyBatch(activeBatch)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Clipboard className="h-4 w-4" />
                  )}
                  Copy all PINs
                </button>

                <button
                  type="button"
                  onClick={() => downloadCsv(activeBatch)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
                >
                  <Download className="h-4 w-4" />
                  Download CSV
                </button>
              </div>
            </div>

            <div className="grid gap-4 border-b border-slate-100 p-5 dark:border-slate-800 sm:grid-cols-2 lg:grid-cols-4 sm:px-7">
              {[
                {
                  label: "Batch ID",
                  value: activeBatch.batchId,
                },
                {
                  label: "Plan ID",
                  value: activeBatch.planId,
                },
                {
                  label: "Quantity",
                  value: String(activeBatch.quantity),
                },
                {
                  label: "Amount per PIN",
                  value: formatNaira(activeBatch.amountPerPin),
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="min-w-0 rounded-xl bg-slate-50 p-4 dark:bg-slate-950"
                >
                  <p className="text-xs font-semibold text-slate-500">
                    {item.label}
                  </p>
                  <p
                    className="mt-2 break-all text-sm font-bold"
                    title={item.value}
                  >
                    {item.value}
                  </p>
                  {item.label !== "Quantity" &&
                    item.label !== "Amount per PIN" && (
                      <button
                        type="button"
                        onClick={() => void copyText(item.value)}
                        className="mt-2 text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400"
                      >
                        Copy value
                      </button>
                    )}
                </div>
              ))}
            </div>

            <div className="p-5 sm:p-7">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-extrabold">Generated PINs</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Keep these codes secure and distribute them only to
                    authorized buyers.
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                  {activeBatch.pins.length} PINs
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {activeBatch.pins.map((pin, index) => (
                  <div
                    key={`${activeBatch.batchId}-${pin}-${index}`}
                    className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-indigo-300 dark:border-slate-800 dark:hover:border-indigo-700"
                  >
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500">
                        PIN {String(index + 1).padStart(2, "0")}
                      </p>
                      <p className="mt-1 break-all font-mono text-base font-extrabold tracking-wide">
                        {pin}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => void copyText(pin)}
                      title="Copy PIN"
                      aria-label={`Copy PIN ${index + 1}`}
                      className="shrink-0 rounded-lg border border-slate-200 p-2.5 transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      <Clipboard className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Session batch history */}
        {batches.length > 1 && (
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
            <h2 className="text-lg font-extrabold">Recent batches</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Switch between PIN batches generated during this session.
            </p>

            <div className="mt-5 space-y-3">
              {batches.map((batch) => (
                <div
                  key={batch.batchId}
                  className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0">
                    <p className="break-all text-sm font-bold">
                      {batch.planName || batch.planId}
                    </p>
                    <p className="mt-1 break-all font-mono text-xs text-slate-500">
                      {batch.batchId}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {batch.pins.length} PINs ·{" "}
                      {formatNaira(batch.amountPerPin)} per PIN
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveBatch(batch);
                        setCopied(false);
                        setError("");
                      }}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      View PINs
                    </button>
                    <button
                      type="button"
                      onClick={() => copyBatch(batch)}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      Copy
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadCsv(batch)}
                      className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <p className="pb-4 text-center text-xs leading-5 text-slate-500">
          PIN batches shown here are kept in page memory only. Reloading
          the page clears this session history. Use a backend batch-history
          endpoint if you need persistent records.
        </p>
      </div>
    </main>
  );
}

