



// import { api } from "./axios";
// import type { CreatePaymentIntentResponse } from "@/types/payment";

// export type SecondaryPaymentPlan = "SECONDARY";

// export async function createSecondaryPaymentIntent(
//   plan: SecondaryPaymentPlan,
// ) {
//   const response =
//     await api.post<CreatePaymentIntentResponse>(
//       `/payments/create-payment-intent/paystack/${encodeURIComponent(plan)}`,
//     );

//   return response.data;
// }




import { api } from "./axios";
import type { CreatePaymentIntentResponse } from "@/types/payment";

export async function createSecondaryPaymentIntent() {
  const response =
    await api.post<CreatePaymentIntentResponse>(
      "/payments/create-payment-intent/paystack/SECONDARY",
    );

  return response.data;
}





