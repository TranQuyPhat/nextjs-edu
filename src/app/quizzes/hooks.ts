import {
    useMutation,
    useQuery,
    useQueryClient,
    keepPreviousData,
} from "@tanstack/react-query";
import {
    createQuiz,
    deleteQuiz,
    fetchQuizById,
    fetchQuizzes,
    toQuizCard,
    updateQuiz,
    type QuizFilters,
} from "./api";
import type { QuizCard } from "./types";

export function useQuizzesQuery(filters: QuizFilters = {}) {
    return useQuery({
        queryKey: ["quizzes", filters],
        queryFn: () => fetchQuizzes(filters),
        select: (rows): QuizCard[] => rows.map(toQuizCard),
        placeholderData: keepPreviousData,
    });
}

export function useQuizDetailQuery(id?: number) {
    return useQuery({
        queryKey: ["quiz", id],
        queryFn: () => fetchQuizById(id!),
        enabled: !!id,
    });
}

export function useCreateQuizMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: createQuiz,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["quizzes"] });
        },
    });
}

export function useUpdateQuizMutation(id: number) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: any) => updateQuiz(id, payload),
        onMutate: async (payload) => {
            await qc.cancelQueries({ queryKey: ["quizzes"] });
            const prev = qc.getQueryData<any[]>(["quizzes", {}]); // tuỳ filters đang dùng
            // có thể setQueryData để optimistic update nếu cần
            return { prev };
        },
        onError: (_err, _payload, ctx) => {
            if (ctx?.prev) qc.setQueryData(["quizzes", {}], ctx.prev);
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: ["quizzes"] });
            qc.invalidateQueries({ queryKey: ["quiz", id] });
        },
    });
}

export function useDeleteQuizMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteQuiz(id),
        onMutate: async (id) => {
            await qc.cancelQueries({ queryKey: ["quizzes"] });
            const key = ["quizzes", {}];
            const prev = qc.getQueryData<QuizCard[]>(key);
            if (prev) {
                qc.setQueryData<QuizCard[]>(
                    key,
                    prev.filter((q) => q.id !== id)
                );
            }
            return { key, prev };
        },
        onError: (_e, _id, ctx) => {
            if (ctx?.prev) qc.setQueryData(ctx.key!, ctx.prev);
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: ["quizzes"] });
        },
    });
}
