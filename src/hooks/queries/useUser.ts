

import { useMutation, useQuery,} from "@tanstack/react-query";

import { QUERY_KEYS } from "@/constants";
import { userService } from "@/services";

export function useProfile() {
    

  return useQuery({
    queryKey: QUERY_KEYS.PROFILE,
    queryFn: userService.getProfile,
  });
}

export function useUsers() {
  return useQuery({
    queryKey: QUERY_KEYS.USER,
    queryFn: userService.getUsers,
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.USER, id],
    queryFn: () => userService.getUser(id),
    enabled: !!id,
  });
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: userService.updateProfile,
  });
}