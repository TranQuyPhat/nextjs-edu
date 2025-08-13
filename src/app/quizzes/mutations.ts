// "use client";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { api } from "../../lib/api";
// import { quizKeys, ListParams } from "./queries";
// import type { Quiz } from "@/types/quiz.type";

// export function useCreateQuiz(listParams?: ListParams) {
//     const qc = useQueryClient();
//     return useMutation({
//         mutationFn: (payload: Partial<Quiz>) => api.post<Quiz>("/api/quizzes", payload),
//         onSuccess: (created) => {
//             // invalidate list hiện tại
//             if (listParams) qc.invalidateQueries({ queryKey: quizKeys.list(listParams) });
//             // seed cache detail
//             qc.setQueryData(quizKeys.detail(created.id), created);
//         },
//     });
// }

// export function useUpdateQuiz(id: number | string, listParams?: ListParams) {
//     const qc = useQueryClient();
//     return useMutation({
//         mutationFn: (payload: Partial<Quiz>) => api.patch<Quiz>(`/api/quizzes/${id}`, payload),
//         onMutate: async (payload) => {
//             // Optimistic update cho detail
//             await qc.cancelQueries({ queryKey: quizKeys.detail(id) });
//             const prev = qc.getQueryData<Quiz>(quizKeys.detail(id));
//             if (prev) {
//                 qc.setQueryData<Quiz>(quizKeys.detail(id), { ...prev, ...payload } as Quiz);
//             }
//             return { prev };
//         },
//         onError: (_e, _payload, ctx) => {
//             if (ctx?.prev) qc.setQueryData(quizKeys.detail(id), ctx.prev);
//         },
//         onSuccess: (updated) => {
//             qc.setQueryData(quizKeys.detail(id), updated);
//             if (listParams) qc.invalidateQueries({ queryKey: quizKeys.list(listParams) });
//         },
//     });
// }

// export function useDeleteQuiz(listParams?: ListParams) {
//     const qc = useQueryClient();
//     return useMutation({
//         mutationFn: (id: number | string) => api.delete(`/api/quizzes/${id}`),
//         onSuccess: () => {
//             if (listParams) qc.invalidateQueries({ queryKey: quizKeys.list(listParams) });
//         },
//     });
// }