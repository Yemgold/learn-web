



"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clipboard,
  Copy,
  Download,
  KeyRound,
  Loader2,
  PackageCheck,
  ShieldCheck,
  X,
} from "lucide-react";

import { axiosInstance } from "@/lib/api/axios";

// IMPORTANT: Confirm this route against your backend.
const GENERATE_PINS_ENDPOINT = "/subscription-pins/generate";

// From the sample PIN-generation response you supplied.
const SECONDARY_PLAN_ID = "6a7b0abcafa6aaf987e9ca3b";

const PLAN_NAME = "Secondary School";
const AMOUNT_PER_PIN_NAIRA = 3000;
const AMOUNT_PER_PIN_KOBO = 300000;
const MAX_QUANTITY = 1000;

interface PinBatch {
  batchId: string;
  planId: string;
  quantity: number;
  amountPerPin: number;
  pins: string[];
  createdAt: string;
}

interface ApiResponse {
  success?: boolean;
  message?: string;
  data?: unknown;
}

function unwrapResponse(value: unknown): unknown {
  let current = value;

  for (let i = 0; i < 6; i += 1) {
    if (!current || typeof current !== "object") {
      break;
    }

    const obj = current as Record<string, unknown>;

    if (Array.isArray(obj.pins)) {
      return obj;
    }

    if (!("data" in obj)) {
      break;
    }

    current = obj.data;
  }

  return current;
}

function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(amount);
}

function escapeCsv(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function downloadBatchCsv(batch: PinBatch) {
  const rows = [
    ["PIN", "Subscription Plan", "Plan ID", "Batch ID", "Price"],
    ...batch.pins.map((pin) => [
      pin,
      PLAN_NAME,
      batch.planId,
      batch.batchId,
      formatNaira(batch.amountPerPin / 100),
    ]),
  ];

  const csv = rows
    .map((row) => row.map(escapeCsv).join(","))
    .join("\r\n");

  const blob = new Blob(["\uFEFF", csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `secondary-school-pins-${batch.batchId}.csv`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

export default function AdminAccessPinPage() {
  const [quantity, setQuantity] = useState("5");
  const [generating, setGenerating] = useState(false);
  const [copiedBatchId, setCopiedBatchId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [batches, setBatches] = useState<PinBatch[]>([]);
  const [activeBatch, setActiveBatch] = useState<PinBatch | null>(null);

  const parsedQuantity = Number(quantity);

  const validQuantity =
    Number.isInteger(parsedQuantity) &&
    parsedQuantity >= 1 &&
    parsedQuantity <= MAX_QUANTITY;

  const totalAmount = useMemo(
    () => (validQuantity ? parsedQuantity * AMOUNT_PER_PIN_NAIRA : 0),
    [parsedQuantity, validQuantity],
  );

  async function handleGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setCopiedBatchId("");

    if (!validQuantity) {
      setError(`Enter a quantity between 1 and ${MAX_QUANTITY}.`);
      return;
    }

    setGenerating(true);

    try {
      const response = await axiosInstance.post<ApiResponse>(
        GENERATE_PINS_ENDPOINT,
        {
          planId: SECONDARY_PLAN_ID,
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
        throw new Error("The server returned an invalid response.");
      }

      const data = result as Record<string, unknown>;

      if (!Array.isArray(data.pins)) {
        throw new Error(
          "The response contains no PIN list. Check the backend response.",
        );
      }

      const pins = data.pins.map(String);

      if (pins.length === 0) {
        throw new Error("The server did not generate any PINs.");
      }

      const batchId = String(data.batchId ?? "");

      if (!batchId) {
        throw new Error(
          "PINs were returned, but the batch ID is missing. Check the backend response.",
        );
      }

      const batch: PinBatch = {
        batchId,
        planId: String(data.planId ?? SECONDARY_PLAN_ID),
        quantity: Number(data.quantity ?? pins.length),
        amountPerPin: Number(data.amountPerPin ?? AMOUNT_PER_PIN_KOBO),
        pins,
        createdAt: new Date().toISOString(),
      };

      setActiveBatch(batch);
      setBatches((previous) => [batch, ...previous]);

      setSuccess(
        `Successfully generated ${pins.length} Secondary School PIN${pins.length === 1 ? "" : "s"}.`,
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
          "Unable to generate PINs. Please try again.",
      );
    } finally {
      setGenerating(false);
    }
  }

  async function copyText(text: string, batchId: string) {
    setError("");

    try {
      await navigator.clipboard.writeText(text);
      setCopiedBatchId(batchId);
      window.setTimeout(() => {
        setCopiedBatchId((current) =>
          current === batchId ? "" : current,
        );
      }, 2500);
    } catch {
      setError(
        "Unable to copy automatically. Select the PINs and copy them manually.",
      );
    }
  }

  function copyBatch(batch: PinBatch) {
    void copyText(batch.pins.join("\n"), batch.batchId);
  }

  function copySinglePin(pin: string, batchId: string) {
    void copyText(pin, batchId);
  }

  const totalPinsGenerated = batches.reduce(
    (sum, batch) => sum + batch.pins.length,
    0,
  );

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">
        <header className="flex items-start gap-4">
          <div className="rounded-2xl bg-indigo-600 p-3 text-white shadow-lg">
            <KeyRound className="h-7 w-7" />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
              Administration
            </p>
            <h1 className="mt-1 text-2xl font-black sm:text-3xl">
              Subscription Access PINs
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Generate, copy, and download Secondary School subscription
              PINs for distribution to students and agents.
            </p>
          </div>
        </header>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="flex-1 break-words">{error}</p>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {success && (
          <div
            role="status"
            className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200"
          >
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            {success}
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <ShieldCheck className="h-6 w-6 text-indigo-500" />
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Available subscription
            </p>
            <p className="mt-1 text-xl font-black">{PLAN_NAME}</p>
            <p className="mt-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              {formatNaira(AMOUNT_PER_PIN_NAIRA)} per PIN
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <PackageCheck className="h-6 w-6 text-emerald-500" />
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Batches this session
            </p>
            <p className="mt-1 text-3xl font-black">{batches.length}</p>
            <p className="mt-1 text-xs text-slate-500">
              Since this page was opened
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <KeyRound className="h-6 w-6 text-amber-500" />
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              PINs generated this session
            </p>
            <p className="mt-1 text-3xl font-black">{totalPinsGenerated}</p>
            <p className="mt-1 text-xs text-slate-500">
              Across all generated batches
            </p>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 p-5 dark:border-slate-800 sm:p-7">
            <h2 className="text-xl font-black">Generate PINs</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Create access PINs for the Secondary School subscription.
            </p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-6 p-5 sm:p-7">
            <div>
              <label className="mb-2 block text-sm font-bold">
                Subscription plan
              </label>
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-900 dark:bg-indigo-950/30">
                <div>
                  <p className="font-extrabold">{PLAN_NAME}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Fixed subscription plan
                  </p>
                </div>
                <p className="shrink-0 text-lg font-black text-indigo-700 dark:text-indigo-300">
                  {formatNaira(AMOUNT_PER_PIN_NAIRA)}
                </p>
              </div>
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
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                disabled={generating}
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-semibold outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950"
              />
              <p className="mt-2 text-xs text-slate-500">
                You can generate up to {MAX_QUANTITY} PINs per batch.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-100 p-5 dark:bg-slate-800/70">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Estimated total value
                </span>
                <span className="text-2xl font-black">
                  {formatNaira(totalAmount)}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {validQuantity
                  ? `${parsedQuantity} PIN${parsedQuantity === 1 ? "" : "s"} × ${formatNaira(AMOUNT_PER_PIN_NAIRA)}`
                  : `Enter a quantity between 1 and ${MAX_QUANTITY}.`}
              </p>
            </div>

            <button
              type="submit"
              disabled={generating || !validQuantity}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-4 font-extrabold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {generating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating PINs...
                </>
              ) : (
                <>
                  <KeyRound className="h-5 w-5" />
                  Generate {validQuantity ? parsedQuantity : ""} PINs
                </>
              )}
            </button>
          </form>
        </section>

        {activeBatch && (
          <section className="overflow-hidden rounded-3xl border border-emerald-200 bg-white shadow-sm dark:border-emerald-900 dark:bg-slate-900">
            <div className="flex flex-col justify-between gap-4 border-b border-emerald-100 p-5 dark:border-emerald-900 sm:flex-row sm:items-center sm:p-7">
              <div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <h2 className="text-xl font-black">Generated PINs</h2>
                </div>
                <p className="mt-2 break-all text-xs text-slate-500">
                  Batch ID: {activeBatch.batchId}
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {activeBatch.pins.length} PINs · {PLAN_NAME} ·{" "}
                  {formatNaira(activeBatch.amountPerPin / 100)} each
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => copyBatch(activeBatch)}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  {copiedBatchId === activeBatch.batchId ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copiedBatchId === activeBatch.batchId
                    ? "Copied"
                    : "Copy all"}
                </button>

                <button
                  type="button"
                  onClick={() => downloadBatchCsv(activeBatch)}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700"
                >
                  <Download className="h-4 w-4" />
                  Download CSV
                </button>
              </div>
            </div>

            <div className="max-h-[520px] overflow-auto p-4 sm:p-6">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {activeBatch.pins.map((pin, index) => (
                  <div
                    key={`${activeBatch.batchId}-${pin}-${index}`}
                    className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-800"
                  >
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500">
                        PIN {index + 1}
                      </p>
                      <p className="mt-1 break-all font-mono text-base font-extrabold tracking-wide">
                        {pin}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        copySinglePin(pin, `${activeBatch.batchId}-${index}`)
                      }
                      aria-label={`Copy PIN ${index + 1}`}
                      title="Copy PIN"
                      className="shrink-0 rounded-lg border border-slate-200 p-2 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      {copiedBatchId === `${activeBatch.batchId}-${index}` ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Clipboard className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {batches.length > 1 && (
          <section className="space-y-4">
            <h2 className="text-xl font-black">Recent batches</h2>

            <div className="space-y-3">
              {batches.slice(1).map((batch) => (
                <div
                  key={batch.batchId}
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0">
                    <p className="font-bold">
                      {batch.quantity} Secondary School PINs
                    </p>
                    <p className="mt-1 break-all text-xs text-slate-500">
                      Batch: {batch.batchId}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {new Date(batch.createdAt).toLocaleString("en-NG")}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => copyBatch(batch)}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      Copy
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadBatchCsv(batch)}
                      className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-bold text-white hover:bg-emerald-700"
                    >
                      Download
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveBatch(batch)}
                      className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-bold text-white hover:bg-indigo-700"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <p className="pb-4 text-center text-xs leading-5 text-slate-500">
          Batch history on this page is stored in memory only and will clear
          when the page is refreshed. PIN generation is performed by your
          backend.
        </p>
      </div>
    </main>
  );
}
