


import { Lock, ShieldCheck } from "lucide-react";

export default function SecurePaymentNotice() {
  return (
    <div className="mt-5 rounded-2xl bg-emerald-50 p-4">
      <div className="flex gap-3">
        <ShieldCheck className="h-5 w-5 text-emerald-600" />

        <div>
          <p className="font-semibold text-emerald-800">
            Secure Payment
          </p>

          <p className="text-sm text-emerald-700">
            Your payment is processed securely through Paystack.
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
        <Lock className="h-3.5 w-3.5" />
        SSL encrypted checkout
      </div>
    </div>
  );
}