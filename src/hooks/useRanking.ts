



import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/constants";
import { rankingService } from "@/services";

export function useRankings() {
  return useQuery({
    queryKey: QUERY_KEYS.RANKINGS,
    queryFn: rankingService.getRankings,
  });
}