import { BackendQuizResponse, QuizzFormData } from "@/types/quiz.type";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {

  return twMerge(clsx(inputs))
}

export function mapBackendToFormData(apiData: BackendQuizResponse): QuizzFormData {

  return {
    title: apiData.quizTitle || "",
    grade: "",
    subject: "",
    startDate: "",
    endDate: "",
    time: "",
    description: "",
    fileName: "",

    questions: apiData.questions.map((q) => ({
      question: q.questionText,
      options: q.options.map((opt, idx) => ({
        optionLabel: String.fromCharCode(65 + idx), // A, B, C, D
        optionText: opt.replace(/^[A-D]\.\s*/, "").trim(), // Bỏ tiền tố "A. "
      })),
      answer: String.fromCharCode(65 + q.correctIndex),
      explanation: q.explanation,
      topic: q.topic,
      difficulty: q.difficulty,
    })),
  };
}