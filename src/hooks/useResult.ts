


import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/constants";
import { resultService } from "@/services";

export function useResults() {
  return useQuery({
    queryKey: QUERY_KEYS.RESULTS,
    queryFn: resultService.getResults,
  });
}

export function useResult(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.RESULTS, id],
    queryFn: () => resultService.getResult(id),
    enabled: !!id,
  });
}