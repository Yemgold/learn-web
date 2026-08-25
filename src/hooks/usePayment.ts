


import { useMutation } from "@tanstack/react-query";

import { paymentService } from "@/services";

export function useInitializePayment() {
  return useMutation({
    mutationFn: paymentService.initialize,
  });
}

export function useVerifyPayment() {
  return useMutation({
    mutationFn: paymentService.verify,
  });
}