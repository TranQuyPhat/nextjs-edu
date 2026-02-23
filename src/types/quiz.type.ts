import { QuestionType } from './setting.type';
export type Quiz = {
    id: number;
    title: string;
    description?: string;
    totalQuestions: number;
    classId?: number;
    createdAt: string;
    questions: Question[];
};

export type Question = {
    id: string;
    questionText: string;
    questionType: string;
    options: Option[];
    // For ONE_CHOICE/MULTI_CHOICE: "A" or "A,C"
    // For TRUE_FALSE: "TRUE" or "FALSE"
    correctOptions?: string | null;
    // For FILL_BLANK: array of valid answers
    correctAnswerTexts?: string[] | null;
    correctAnswerRegex?: string | null;
    caseSensitive?: boolean;
    trimWhitespace?: boolean;
    score?: number | null;
    explanation?: string | null;
    topic?: string | null;
    difficulty?: 'easy' | 'medium' | 'hard' | null;
};
export type Option = {
    optionLabel: string;
    optionText: string;
};
export type QuizzFormData = {
    className?: string;
    subject?: string;
    title: string;
    startDate: string;
    endDate: string;
    classId?: number;
    createdBy?: number;
    timeLimit: number;
    description: string;
    fileName?: string;
    questions: Question[];
};
export type QuizzFormDatas = {
    title: string;
    startDate: string;
    endDate: string;
    classId?: number;
    timeLimit: string;
    description: string;
    questions: Question[];
};
export interface QuizCard {
    id: number;
    title: string;
    description: string;
    className: string;
    timeLimit: number;
    totalQuestions: number;
    totalStudents: number;
    studentsSubmitted: number;
    studentsUnSubmitted: number;
    endDate: string;
    startDate: string;
    subject: string;
    classID: number;
    createdBy: number;
    status: string;
}
export interface AiQuizSettings {
    quizTitle?: string;
    language?: string;
    difficulty?: string;
    // Số lượng câu cho từng loại
    numOneChoice?: number;     // ONE_CHOICE
    numTrueFalse?: number;     // TRUE_FALSE
    numFillBlank?: number;     // FILL_BLANK
    userPrompt?: string;
}


export interface BackendQuizResponse {
    quizTitle: string;
    questions: Array<{
        questionType: string;
        questionText: string;
        options: Option[];
        // For ONE_CHOICE/MULTI_CHOICE: "A" or "A,C"
        // For TRUE_FALSE: "TRUE" or "FALSE"
        correctOptions?: string | null;
        // For FILL_BLANK
        correctAnswerTexts?: string[] | null;
        correctAnswerRegex?: string | null;
        caseSensitive?: boolean;
        trimWhitespace?: boolean;
        explanation?: string;
        topic?: string;
        difficulty?: 'easy' | 'medium' | 'hard';
    }>;
}

