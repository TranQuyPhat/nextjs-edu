import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/api-client";

export function useQuizQuestionsPage(
  quizId: number,
  page: number,
  size: number
) {
  return useQuery({
    queryKey: ["quiz", quizId, "questions", page, size],
    queryFn: () =>
      apiClient(`/api/quizzes/${quizId}/questions?page=${page}&size=${size}`),
    keepPreviousData: true,
  });
}
export function useQuizById(quizId: number) {
  return useQuery({
    queryKey: ["quiz", quizId],
    queryFn: () => apiClient(`/api/quizzes/${quizId}`),
  });
}
