



import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { QUERY_KEYS } from "@/constants";
import { teamService } from "@/services";

export function useTeams() {
  return useQuery({
    queryKey: QUERY_KEYS.TEAMS,
    queryFn: teamService.getTeams,
  });
}

export function useTeam(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.TEAM, id],
    queryFn: () => teamService.getTeam(id),
    enabled: !!id,
  });
}

export function useCreateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: teamService.createTeam,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.TEAMS,
      });
    },
  });
}

export function useUpdateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof teamService.updateTeam>[1];
    }) => teamService.updateTeam(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.TEAMS,
      });

      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.TEAM, variables.id],
      });
    },
  });
}

export function useDeleteTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: teamService.deleteTeam,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.TEAMS,
      });
    },
  });
}