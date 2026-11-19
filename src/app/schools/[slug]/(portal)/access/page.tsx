



"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Copy,
  KeyRound,
  Plus,
  RefreshCw,
  ShieldCheck,
  ShieldOff,
} from "lucide-react";

import {
  activateSchoolAccessPin,
  deactivateSchoolAccessPin,
  generateSchoolAccessPin,
  getSchoolAccess,
  getSchoolAccessPins,
  type AccessPin,
  type SchoolAccess,
} from "@/lib/schools/portal/services/access.service";

import Card, {
  CardContent,
  CardHeader,
} from "@/components/schools/ui/Card";

import Button from "@/components/schools/ui/Button";
import LoadingState from "@/components/schools/shared/LoadingState";

const defaultAccess: SchoolAccess = {
  mode: "STUDENT_PIN",
  isActive: false,
  requiresPin: true,
  requiresSubscription: false,
  message: "",
};

export default function SchoolAccessPage() {
  const [access, setAccess] = useState(defaultAccess);
  const [pins, setPins] = useState<AccessPin[]>([]);
  const [usageLimit, setUsageLimit] = useState("100");
  const [validityDays, setValidityDays] = useState("30");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadAccess = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [accessResult, pinResult] = await Promise.all([
        getSchoolAccess(),
        getSchoolAccessPins(),
      ]);

      setAccess(accessResult);
      setPins(pinResult);
    } catch (err) {
      console.error("Failed to load school access:", err);
      setError("Unable to load school access information.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAccess();
  }, [loadAccess]);

  async function handleGeneratePin() {
    const limit = Number(usageLimit);
    const days = Number(validityDays);

    if (!Number.isInteger(limit) || limit < 1) {
      setError("Enter a valid PIN usage limit.");
      return;
    }

    if (!Number.isInteger(days) || days < 1) {
      setError("Enter a valid PIN validity period.");
      return;
    }

    try {
      setGenerating(true);
      setError("");
      setMessage("");

      const result = await generateSchoolAccessPin({
        usageLimit: limit,
        validityDays: days,
      });

      if (result) {
        setPins((current) => [result, ...current]);
        setMessage("Access PIN generated successfully.");
      } else {
        await loadAccess();
        setMessage("PIN generation request completed.");
      }
    } catch (err) {
      console.error("Failed to generate access PIN:", err);
      setError("Unable to generate an access PIN.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleTogglePin(pin: AccessPin) {
    try {
      setError("");

      if (pin.isActive) {
        await deactivateSchoolAccessPin(pin.id);
      } else {
        await activateSchoolAccessPin(pin.id);
      }

      setPins((current) =>
        current.map((item) =>
          item.id === pin.id
            ? { ...item, isActive: !item.isActive }
            : item
        )
      );
    } catch (err) {
      console.error("Failed to update access PIN:", err);
      setError("Unable to update this PIN.");
    }
  }

  async function copyPin(pin: string) {
    try {
      await navigator.clipboard.writeText(pin);
      setMessage("PIN copied to clipboard.");
    } catch {
      setError("Unable to copy PIN. Please copy it manually.");
    }
  }

  if (loading) {
    return <LoadingState message="Loading school access..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            School Access
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage how students access your school learning portal.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadAccess}
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

      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {message}
        </div>
      )}

      <Card>
        <CardContent className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <ShieldCheck size={24} />
            </div>

            <div>
              <h2 className="font-semibold text-gray-900">
                Current Access Mode
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {access.mode === "STUDENT_PIN"
                  ? "Students access the portal using school-issued PINs."
                  : "Student access is managed through your school subscription."}
              </p>
              {access.message && (
                <p className="mt-2 text-sm text-gray-600">
                  {access.message}
                </p>
              )}
            </div>
          </div>

          <span
            className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
              access.isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {access.isActive ? "Active" : "Inactive"}
          </span>
        </CardContent>
      </Card>

      {access.mode === "STUDENT_PIN" && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Plus size={19} className="text-blue-600" />
                <h2 className="font-semibold text-gray-900">
                  Generate Access PIN
                </h2>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={usageLimit}
                    onChange={(event) => setUsageLimit(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Validity (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={validityDays}
                    onChange={(event) => setValidityDays(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    fullWidth
                    onClick={handleGeneratePin}
                    isLoading={generating}
                    leftIcon={<KeyRound size={16} />}
                  >
                    Generate PIN
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="font-semibold text-gray-900">
                Access PIN History
              </h2>
            </CardHeader>

            <CardContent>
              {pins.length === 0 ? (
                <div className="py-10 text-center">
                  <KeyRound className="mx-auto text-gray-400" size={32} />
                  <p className="mt-3 text-sm text-gray-500">
                    No access PINs have been generated yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pins.map((pin) => (
                    <div
                      key={pin.id}
                      className="flex flex-col justify-between gap-4 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-mono text-lg font-bold tracking-wider text-gray-900">
                            {pin.pin}
                          </p>
                          <button
                            onClick={() => copyPin(pin.pin)}
                            className="text-gray-500 hover:text-blue-600"
                            aria-label="Copy PIN"
                          >
                            <Copy size={16} />
                          </button>
                        </div>

                        <p className="mt-1 text-xs text-gray-500">
                          Used {pin.usageCount} of {pin.usageLimit} times
                        </p>

                        {pin.expiresAt && (
                          <p className="mt-1 text-xs text-gray-500">
                            Expires:{" "}
                            {new Date(pin.expiresAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            pin.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {pin.isActive ? "Active" : "Inactive"}
                        </span>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTogglePin(pin)}
                          leftIcon={
                            pin.isActive ? (
                              <ShieldOff size={15} />
                            ) : (
                              <ShieldCheck size={15} />
                            )
                          }
                        >
                          {pin.isActive ? "Deactivate" : "Activate"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
