


import { useMutation, useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/constants";
import { questionService } from "@/services";

export function useQuestions() {
  return useQuery({
    queryKey: QUERY_KEYS.QUESTIONS,
    queryFn: questionService.getQuestions,
  });
}

export function useQuestion(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.QUESTIONS, id],
    queryFn: () => questionService.getQuestion(id),
    enabled: !!id,
  });
}

export function useCreateQuestion() {
  return useMutation({
    mutationFn: questionService.createQuestion,
  });
}

export function useUpdateQuestion() {
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof questionService.updateQuestion>[1];
    }) => questionService.updateQuestion(id, data),
  });
}

export function useDeleteQuestion() {
  return useMutation({
    mutationFn: questionService.deleteQuestion,
  });
}