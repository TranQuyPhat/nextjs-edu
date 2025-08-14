import { useQuery } from "@tanstack/react-query";

export function useQuizQuestionsPage(
  quizId: number,
  page: number,
  size: number
) {
  return useQuery({
    queryKey: ["quiz", quizId, "questions", page, size],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:8080/api/quizzes/${quizId}/questions?page=${page}&size=${size}`,
        {
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    keepPreviousData: true,
  });
}
