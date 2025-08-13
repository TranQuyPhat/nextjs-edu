// "use client";
// import { useQuery, useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
// import { api } from "../../lib/api";
// import type { Page, Quiz } from "@/types/quiz.type";

// export const quizKeys = {
//     all: ["quizzes"] as const,
//     list: (params: Record<string, unknown>) => [...quizKeys.all, "list", params] as const,
//     detail: (id: number | string) => [...quizKeys.all, "detail", id] as const,
// };

// export type ListParams = {
//     page?: number;   // 1-based
//     size?: number;
//     q?: string;      // keyword
//     classId?: number;
//     sort?: string;   // ví dụ: createdAt,desc
// };

// export function useQuizzes(params: ListParams) {
//     const search = new URLSearchParams();
//     if (params.page) search.set("page", String(params.page));
//     if (params.size) search.set("size", String(params.size));
//     if (params.q) search.set("q", params.q);
//     if (params.classId) search.set("classId", String(params.classId));
//     if (params.sort) search.set("sort", params.sort);

//     return useQuery({
//         queryKey: quizKeys.list(params),
//         queryFn: () => api.get<Page<Quiz>>(`/api/quizzes?${search.toString()}`),
//         placeholderData: keepPreviousData,   // UI mượt khi đổi trang/filters
//         staleTime: 60_000,
//     });
// }


// export function useQuiz(id: number | string) {
//     return useQuery({
//         queryKey: quizKeys.detail(id),
//         queryFn: () => api.get<Quiz>(`/api/quizzes/${id}`),
//         staleTime: 60_000,
//     });
// }