


import { useMutation, useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/constants";
import { competitionService } from "@/services";

export function useCompetitions() {
  return useQuery({
    queryKey: QUERY_KEYS.COMPETITIONS,
    queryFn: competitionService.getCompetitions,
  });
}

export function useCompetition(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.COMPETITION, id],
    queryFn: () => competitionService.getCompetition(id),
    enabled: !!id,
  });
}

export function useCreateCompetition() {
  return useMutation({
    mutationFn: competitionService.createCompetition,
  });
}

export function useUpdateCompetition() {
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof competitionService.updateCompetition>[1];
    }) => competitionService.updateCompetition(id, data),
  });
}

export function useDeleteCompetition() {
  return useMutation({
    mutationFn: competitionService.deleteCompetition,
  });
}