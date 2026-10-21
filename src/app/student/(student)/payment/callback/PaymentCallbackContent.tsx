








// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";
// import {
//   ArrowLeft,
//   CheckCircle2,
//   Clock3,
//   Loader2,
//   Wallet,
// } from "lucide-react";

// export default function PaymentCallbackContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const hasProcessed = useRef(false);
//   const queryString = searchParams.toString();

//   const [reference, setReference] = useState("");
//   const [isRedirecting, setIsRedirecting] = useState(false);

//   useEffect(() => {
//     if (hasProcessed.current) return;

//     hasProcessed.current = true;

//     const params = new URLSearchParams(queryString);

//     const paymentReference =
//       params.get("paymentReference") ||
//       params.get("transactionReference") ||
//       params.get("transaction_reference") ||
//       params.get("reference") ||
//       params.get("trxref") ||
//       "";

//     setReference(paymentReference);

  
//     console.info(
//       "[Payment Callback] Returned from payment provider.",
//       {
//         hasReference: Boolean(paymentReference),
//       },
//     );
//   }, [queryString]);

//   const handleReturnToWallet = () => {
//     setIsRedirecting(true);
//     router.push("/student/wallet");
//   };

//   return (
//     <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-10">
//       <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
//         <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
//           <Clock3 className="h-9 w-9 text-amber-600" />
//         </div>

//         <h1 className="text-2xl font-bold text-slate-900">
//           Payment Confirmation Pending
//         </h1>

//         <p className="mt-3 text-sm leading-6 text-slate-600">
//           You have returned from the payment process. Your
//           wallet has not yet been confirmed as credited.
//           Please check your wallet balance and transaction
//           history before trying to fund it again.
//         </p>

//         {reference && (
//           <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3 text-left">
//             <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
//               Payment Reference
//             </p>

//             <p className="mt-1 break-all text-sm font-medium text-slate-800">
//               {reference}
//             </p>
//           </div>
//         )}

//         <div className="mt-6 rounded-xl bg-blue-50 p-4 text-left">
//           <div className="flex items-start gap-3">
//             <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

//             <div>
//               <p className="text-sm font-semibold text-blue-900">
//                 What should you do?
//               </p>

//               <p className="mt-1 text-sm leading-6 text-blue-800">
//                 Open your wallet and check your available
//                 balance and recent transactions. If your
//                 balance has not changed, allow time for
//                 confirmation before contacting support.
//               </p>
//             </div>
//           </div>
//         </div>

//         <button
//           type="button"
//           onClick={handleReturnToWallet}
//           disabled={isRedirecting}
//           className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
//         >
//           {isRedirecting ? (
//             <>
//               <Loader2 className="h-5 w-5 animate-spin" />
//               Opening Wallet...
//             </>
//           ) : (
//             <>
//               <Wallet className="h-5 w-5" />
//               Return to Wallet
//             </>
//           )}
//         </button>

//         <Link
//           href="/student"
//           className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
//         >
//           <ArrowLeft className="h-4 w-4" />
//           Back to Dashboard
//         </Link>

//         <p className="mt-5 text-xs leading-5 text-slate-400">
//           This page does not independently verify or confirm
//           payments. Your wallet balance and transaction
//           records depend on your backend.
//         </p>
//       </div>
//     </main>
//   );
// }














"use client";

import { useEffect, useRef } from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { useVerifyPayment } from "@/hooks/payment/useVerifyPayment";

export default function PaymentCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { mutate: verifyPayment, isPending } =
    useVerifyPayment();

  const hasVerified = useRef(false);
  const queryString = searchParams.toString();

  useEffect(() => {
    const params = new URLSearchParams(queryString);

    console.log("========== PAYMENT CALLBACK DEBUG ==========");
    console.log("Callback URL:", window.location.href);
    console.log(
      "Callback query parameters:",
      Object.fromEntries(params.entries()),
    );

    const reference =
      params.get("paymentReference") ||
      params.get("transactionReference") ||
      params.get("transaction_reference") ||
      params.get("reference") ||
      params.get("trxref");

    console.log(
      "Detected payment reference:",
      reference || "(none)",
    );

    if (!reference) {
      console.error(
        "No recognized payment reference was returned. " +
          "Check the Monnify redirect configuration and backend response.",
      );

      router.replace(
        "/student/payment?error=missing_reference",
      );

      return;
    }

    if (hasVerified.current) {
      return;
    }

    hasVerified.current = true;

    verifyPayment(
      { reference },
      {
        onSuccess: (response) => {
          console.log(
            "Payment verification response:",
            response,
          );

          if (
            response.success &&
            response.data?.paid === true
          ) {
            router.replace(
              "/student/payment/success?reference=" +
                encodeURIComponent(reference),
            );
            return;
          }

          router.replace(
            "/student/payment?error=verification_failed",
          );
        },
        onError: (error) => {
          console.error(
            "Payment verification request failed:",
            error,
          );

          router.replace(
            "/student/payment?error=verification_failed",
          );
        },
      },
    );
  }, [queryString, router, verifyPayment]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

        <h1 className="text-2xl font-bold text-slate-900">
          {isPending
            ? "Verifying Payment..."
            : "Checking Payment..."}
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Please wait while we check your transaction.
          Do not close this page.
        </p>
      </div>
    </main>
  );
}
