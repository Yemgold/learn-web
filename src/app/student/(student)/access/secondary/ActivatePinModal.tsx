


"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
  X,
  XCircle,
} from "lucide-react";

interface ActivatePinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivate?: (pin: string) => Promise<void>;
  onSuccess?: () => void;
}

export default function ActivatePinModal({
  isOpen,
  onClose,
  onActivate,
  onSuccess,
}: ActivatePinModalProps) {
  const [pin, setPin] = useState("");
  const [isActivating, setIsActivating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setPin("");
      setError("");
      setSuccess(false);
      setIsActivating(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !isActivating) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, isActivating, onClose]);

  if (!isOpen) return null;

  const handleActivate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const normalizedPin = pin.trim().replace(/\s+/g, "");

    if (!normalizedPin) {
      setError("Please enter your activation PIN.");
      return;
    }

    if (normalizedPin.length < 4) {
      setError("Please enter a valid activation PIN.");
      return;
    }

    if (!onActivate) {
      setError(
        "PIN activation is not connected yet. Please try again when the service is available.",
      );
      return;
    }

    try {
      setIsActivating(true);

      await onActivate(normalizedPin);

      setSuccess(true);
      setPin("");
      onSuccess?.();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "PIN activation failed. Please check your PIN and try again.";

      setError(message);
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isActivating) {
          onClose();
        }
      }}
      role="presentation"
    >
      <section
        aria-labelledby="activate-pin-title"
        aria-modal="true"
        className="relative my-auto w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0c1425] text-white shadow-2xl shadow-black/50"
        role="dialog"
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500" />

        <button
          type="button"
          onClick={onClose}
          disabled={isActivating}
          aria-label="Close PIN activation modal"
          className="absolute right-4 top-4 z-10 rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 sm:p-8">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
            {success ? (
              <CheckCircle2 className="h-7 w-7 text-emerald-400" />
            ) : (
              <KeyRound className="h-7 w-7 text-cyan-300" />
            )}
          </div>

          {success ? (
            <>
              <h2
                id="activate-pin-title"
                className="text-2xl font-black tracking-tight"
              >
                PIN submitted successfully!
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Your PIN was submitted successfully. Your account access should
                now be verified by the connected activation service.
              </p>

              <button
                type="button"
                onClick={onClose}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3.5 font-bold text-slate-950 transition hover:bg-cyan-400"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                Secondary Plan
              </p>

              <h2
                id="activate-pin-title"
                className="text-2xl font-black tracking-tight sm:text-3xl"
              >
                Activate with PIN
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Enter the activation PIN you received from your Learnyfi agent
                to activate your Secondary Plan.
              </p>

              <form onSubmit={handleActivate} className="mt-7 space-y-5">
                <div>
                  <label
                    htmlFor="secondary-activation-pin"
                    className="mb-2 block text-sm font-semibold text-slate-200"
                  >
                    Activation PIN
                  </label>

                  <div className="relative">
                    <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                    <input
                      id="secondary-activation-pin"
                      type="text"
                      value={pin}
                      onChange={(event) => {
                        setPin(event.target.value);
                        if (error) setError("");
                      }}
                      placeholder="Enter your PIN"
                      autoComplete="off"
                      autoCapitalize="characters"
                      spellCheck={false}
                      disabled={isActivating}
                      aria-invalid={Boolean(error)}
                      aria-describedby={
                        error ? "activation-pin-error" : "activation-pin-help"
                      }
                      className="w-full rounded-xl border border-white/10 bg-[#080d1a] py-4 pl-12 pr-4 text-base font-bold tracking-widest text-white outline-none transition placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/10 disabled:opacity-60"
                    />
                  </div>

                  {error ? (
                    <p
                      id="activation-pin-error"
                      role="alert"
                      className="mt-3 flex items-start gap-2 text-sm leading-5 text-red-300"
                    >
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      {error}
                    </p>
                  ) : (
                    <p
                      id="activation-pin-help"
                      className="mt-2 text-xs leading-5 text-slate-500"
                    >
                      Enter the PIN exactly as provided by your agent.
                    </p>
                  )}
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-emerald-400/10 bg-emerald-400/5 p-3.5">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                  <p className="text-xs leading-5 text-slate-400">
                    Your PIN will be checked by Learnyfi when the activation
                    endpoint is connected. Never share your PIN publicly.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isActivating || !pin.trim()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-4 font-extrabold text-slate-950 shadow-lg shadow-cyan-950/20 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isActivating ? (
                    <>
                      <LoaderCircle className="h-5 w-5 animate-spin" />
                      Activating...
                    </>
                  ) : (
                    <>
                      <LockKeyhole className="h-5 w-5" />
                      Activate PIN
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
