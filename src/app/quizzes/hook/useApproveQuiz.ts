import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../api/api-client";

export function useApproveQuiz() {
    return useMutation({
        mutationFn: async (quizData: any) => {
            const mappedQuestions = quizData.questions.map((q: any) => ({
                questionText: q.question,
                correctOption: q.answer ?? "",
                score: 1,
                options: q.options.map((opt: any) => ({
                    optionLabel: opt.optionLabel,
                    optionText: opt.optionText,
                })),
            }));

            const payload = { ...quizData, questions: mappedQuestions };

            return apiClient("/api/quizzes", {
                method: "POST",
                body: JSON.stringify(payload),
            });
        },
    });
}