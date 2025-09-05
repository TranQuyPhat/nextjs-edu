// src/hooks/quiz-hooks.ts
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { apiClient } from "../api/api-client";
import { ApiResp } from "../api";

// ==== Types ====
export interface QuizQuestion {
    id: number;
    questionText: string;
    options: string[];
    correctIndex?: number;
}

export interface QuizDetail {
    id: number;
    title: string;
    timeLimit: number;
    questions: QuizQuestion[];
    subject?: string;
    className?: string;
}


export function useQuizzesQuery() {
    return useQuery({
        queryKey: ["quizzes"],
        queryFn: async () => {
            const res = await apiClient.get<ApiResp<any[]>>("/quizzes");
            return res.data; // unwrap data
        },
    });
}

export function useQuiz(id: string | number | undefined) {
    return useQuery({
        queryKey: ["quiz", id],
        enabled: !!id,
        staleTime: 60_000,
        queryFn: async () => {
            if (!id) throw new Error("ID bài quiz không hợp lệ");

            try {
                const res = await apiClient.get<ApiResp<QuizDetail>>(`/quizzes/${id}`);

                if (!res.success) {
                    throw new Error(res.message || "Yêu cầu không thành công");
                }

                if (!res.data) {
                    throw new Error("Không có dữ liệu bài quiz");
                }

                return res.data;
            } catch (error: any) {
                // Kiểm tra xem có response data không (cho cả 4xx và 5xx)
                if (error.response?.data) {
                    const responseData = error.response.data as ApiResp<any>;

                    // Ưu tiên lấy message từ response body
                    if (responseData.message) {
                        throw new Error(responseData.message);
                    }
                }

                // Fallback cho các trường hợp khác
                if (error.response?.status === 404) {
                    throw new Error("Không tìm thấy bài quiz");
                }
                if (error.response?.status === 403) {
                    throw new Error("Bạn không có quyền truy cập bài quiz này");
                }
                if (error.response?.status >= 500) {
                    throw new Error("Lỗi máy chủ, vui lòng thử lại sau");
                }

                // Nếu đã có message từ business logic
                if (error.message && error.message !== "Network Error") {
                    throw error;
                }

                throw new Error("Không thể tải bài quiz, vui lòng kiểm tra kết nối mạng");
            }
        },
        retry: (failureCount, error: any) => {
            // Không retry với các lỗi business logic hoặc 4xx
            if (error.response?.status >= 400 && error.response?.status < 500) {
                return false;
            }
            return failureCount < 2;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
}

export function extractApiError(error: any): string {
    if (error?.response?.data?.message) {
        return error.response.data.message;
    }

    if (error?.message) {
        return error.message;
    }

    return "Đã xảy ra lỗi không xác định";
}


export function useQuizById(id: number, role: "student" | "teacher" = "student") {
    return useQuery<QuizDetail>({
        queryKey: ["quiz", id, role],
        queryFn: async () => {
            const res = await apiClient.get<ApiResp<QuizDetail>>(`/quizzes/${id}?role=${role}`);
            return res.data;
        },
        enabled: !!id,
    });
}

export function useQuizQuestionsPage(quizId: number, page: number = 1, size: number = 10) {
    return useQuery({
        queryKey: ["quiz", quizId, "questions", page, size],
        queryFn: async () => {
            const res = await apiClient.get<ApiResp<any>>(
                `/quizzes/${quizId}/questions?page=${page}&size=${size}`
            );
            return res.data;
        },
        placeholderData: keepPreviousData,
        enabled: !!quizId,
    });
}

export function useApproveQuiz() {
    return useMutation({
        mutationFn: async (quizData: any) => {
            const res = await apiClient.post<ApiResp<any>>("/quizzes", quizData);
            return res.data;
        },
    });
}

export function useUpdateQuizMeta(id: number) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: any) => {
            const res = await apiClient.patch<ApiResp<any>>(`/quizzes/${id}`, payload);
            return res.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["quizzes"] });
            qc.invalidateQueries({ queryKey: ["quiz", id] });
        },
    });
}

export function useReplaceQuizContent(id: number) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: any) => {
            const res = await apiClient.put<ApiResp<any>>(`/quizzes/${id}/content`, payload);
            return res.data;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ["quiz", id] }),
    });
}

export function useUpsertQuizContent(id: number) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: any) => {
            const res = await apiClient.patch<ApiResp<any>>(`/quizzes/${id}/content`, payload);
            return res.data;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ["quiz", id] }),
    });
}

// Delete quiz
export function useDeleteQuizMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            const res = await apiClient.delete<ApiResp<any>>(`/quizzes/${id}`);
            return res.data;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ["quizzes"] }),
    });
}

export function useDeleteQuizQuestionMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (args: { quizId: number; questionId: number }) => {
            const res = await apiClient.delete<ApiResp<any>>(
                `/quizzes/${args.quizId}/questions/${args.questionId}`
            );
            return res.data;
        },
        onSuccess: (_, { quizId }) =>
            qc.invalidateQueries({ queryKey: ["quiz", quizId, "questions"] }),
    });
}
