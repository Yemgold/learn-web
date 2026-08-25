
// ask if needed..........useQueryClient,


import {
  useMutation,
  useQuery,
  
} from "@tanstack/react-query";

import { QUERY_KEYS } from "@/constants";
import { authService } from "@/services";

export function useCurrentUser() {
  return useQuery({
    queryKey: QUERY_KEYS.AUTH,
    queryFn: authService.me,
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: authService.login,
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: authService.register,
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: authService.logout,
  });
}

export function useRefreshToken() {
  return useMutation({
    mutationFn: authService.refresh,
  });
}