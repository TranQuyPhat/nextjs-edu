export type Quiz = {
    id: number;
    title: string;
    description?: string;
    totalQuestions: number;
    classId?: number;
    createdAt: string;
};

export type Question = {
    question: string;
    options: Option[];
    answer: string | null;
    explanation?: string | null;
    topic?: string | null;
    difficulty?: "easy" | "medium" | "hard" | null;
};
export type Option = {
    optionLabel: string;
    optionText: string;
};
export type QuizzFormData = {
    title: string;
    grade: string;
    subject: string;
    startDate: string;
    endDate: string;
    time: string;
    description: string;
    questions: Question[];

};

export interface AiQuizSettings {
    numQuestions?: number;
    quizTitle?: string;
    language?: string;
    questionType?: string;
    difficulty?: string;
    studyMode?: string;
    userPrompt?: string;
}


export interface BackendQuizResponse {
    quizTitle: string;
    questions: Array<{
        questionText: string;
        options: string[];
        correctIndex: number;
        explanation?: string;
        topic?: string;
        difficulty?: 'easy' | 'medium' | 'hard';
    }>;
}

