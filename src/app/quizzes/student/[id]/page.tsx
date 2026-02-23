"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import { getAccessToken } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, ArrowLeft, ArrowRight, Send } from "lucide-react";
import QuestionCard from "./QuestionCard";
import { Skeleton } from "@/components/ui/skeleton";
import Navigation from "@/components/navigation";
import { QuizResultDialog } from "../components/quiz-result-dialog";
import { useCreateQuizSubmission, useQuiz } from "../../hook/quiz-hooks";
import { QueryError } from "../../components/QueryError";
import Swal from "sweetalert2";

interface QuizResultData {
  studentName: string;
  className: string;
  subject: string;
  duration: string;
  startTime: string;
  endTime: string;
  score: number;
  totalQuestions: number;
  title: string;
}

export default function QuizPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { mutate: submitQuiz } = useCreateQuizSubmission();
  const { data: quiz, isLoading, error, refetch, isFetching } = useQuiz(id);
  console.log("quiz :", quiz);

  const [quizAnswers, setQuizAnswers] = useState<
    Record<number, string | string[]>
  >({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmited, setIsSubmited] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  // 2) Sửa chỗ tính currentQuestions để an toàn khi quiz chưa sẵn
  const QUESTIONS_PER_PAGE = 5;
  const currentQuestions =
    quiz?.questions?.slice(
      currentPage * QUESTIONS_PER_PAGE,
      (currentPage + 1) * QUESTIONS_PER_PAGE
    ) ?? [];

  const [quizResult, setQuizResult] = useState<QuizResultData | null>(null);
  const [isResultOpen, setIsResultOpen] = useState(false);

  const token = getAccessToken();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
  };

  const handleSubmit = useCallback(async () => {
    if (!startTime || isSubmitting || isSubmited) return;
    if (!quiz || !quiz.questions?.length) return;

    try {
      const answersPayload: Record<number, string[]> = {};
      for (const q of quiz.questions) {
        const qid = Number(q.id);
        const answer = quizAnswers[qid];
        if (Array.isArray(answer)) {
          answersPayload[qid] = answer;
        } else if (typeof answer === "string" && answer) {
          answersPayload[qid] = [answer];
        } else {
          answersPayload[qid] = [];
        }
      }

      const unanswered = Object.values(answersPayload).filter(
        (v) => v.length === 0
      ).length;
      const answered = quiz.questions.length - unanswered;

      // Xác nhận nộp bài trong mọi trường hợp
      const confirmResult = await Swal.fire({
        title: "Xác nhận nộp bài",
        html: `
          <div class="text-left space-y-2">
            <p><strong>Tổng số câu:</strong> ${quiz.questions.length}</p>
            <p><strong>Đã làm:</strong> ${answered} câu</p>
            <p><strong>Chưa làm:</strong> ${unanswered} câu</p>
            ${
              unanswered > 0
                ? '<p class="text-amber-600 font-semibold mt-3">⚠️ Bạn còn câu chưa làm!</p>'
                : ""
            }
          </div>
        `,
        text: "Bạn có chắc chắn muốn nộp bài không?",
        icon: unanswered > 0 ? "warning" : "question",
        showCancelButton: true,
        confirmButtonText: "Nộp bài",
        cancelButtonText: "Hủy",
        confirmButtonColor: unanswered > 0 ? "#f59e0b" : "#3b82f6",
        cancelButtonColor: "#6b7280",
      });

      if (!confirmResult.isConfirmed) {
        return;
      }

      setIsSubmitting(true);

      const userString = localStorage.getItem("user");
      if (!userString) throw new Error("User data not found");

      const user = JSON.parse(userString);
      const studentId = user.userId;
      if (!studentId) throw new Error("Student ID not found");

      const submissionPayload = {
        quizId: Number.parseInt(id as string, 10),
        studentId,
        startAt: startTime.toISOString(),
        endAt: new Date().toISOString(),
        answers: answersPayload,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/quiz-submissions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(submissionPayload),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = "Có lỗi xảy ra khi nộp bài";
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorMessage;
        } catch {}
        throw new Error(errorMessage);
      }

      const result = await res.json();
      setIsSubmited(true);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      const start = new Date(result.startAt).getTime();
      const end = new Date(result.endAt).getTime();
      const durationMs = Math.max(0, end - start);
      const durationMinutes = Math.floor(durationMs / 60000);
      const durationSeconds = Math.floor((durationMs % 60000) / 1000);

      setQuizResult({
        studentName: result.studentName,
        className: result.className,
        subject: result.subjectName,
        duration: `${durationMinutes} phút ${durationSeconds} giây`,
        startTime: formatDateTime(result.startAt),
        endTime: formatDateTime(result.endAt),
        score: result.score,
        totalQuestions: quiz.questions.length,
        title: quiz.title,
      });

      setIsResultOpen(true);
    } catch (err: any) {
      console.error("Error submitting quiz:", err);
      alert(`Lỗi khi nộp bài: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [id, startTime, quiz, quizAnswers, isSubmitting, isSubmited, token]);

  const handleAnswerChange = (
    questionId: number,
    answer: string | string[]
  ) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [Number(questionId)]: answer,
    }));
  };

  const calculateProgress = () => {
    if (!quiz || !quiz.questions?.length) return 0;
    if (!quizAnswers) return 0;

    const answeredCount =
      quiz?.questions?.filter((q: any) => {
        const answer = quizAnswers[q.id as number];
        return (
          (Array.isArray(answer) && answer.length > 0) ||
          (!Array.isArray(answer) && answer !== "")
        );
      }).length ?? 0;
    return quiz?.questions?.length
      ? (answeredCount / quiz.questions.length) * 100
      : 0;
  };

  // Khởi tạo timer khi có quiz data
  useEffect(() => {
    if (quiz && quiz.timeLimit && !startTime) {
      const now = new Date();
      setStartTime(now);
      setTimeLeft(quiz.timeLimit * 60); // Convert minutes to seconds
    }
  }, [quiz, startTime]);

  // Timer logic
  useEffect(() => {
    if (isSubmited || isSubmitting || timeLeft <= 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      if (timeLeft <= 0 && !isSubmited && !isSubmitting && startTime) {
        handleSubmit();
      }

      return;
    }

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        return newTime;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timeLeft, isSubmitting, isSubmited, startTime, handleSubmit]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  if (error) {
    return (
      <QueryError
        error={error}
        title="Không tải được bài quiz"
        onRetry={() => refetch()}
        onGoBack={() => history.back()}
        isRetrying={isFetching}
      />
    );
  }
  if (isLoading || isFetching) {
    return <QuizSkeleton />;
  }
  if (!quiz) {
    return <QuizSkeleton />;
  }
  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-indigo-600/35 via-slate-900 to-slate-950 blur-3xl" />
        <div className="absolute -right-16 top-24 h-64 w-64 rounded-full bg-blue-500/25 blur-[130px]" />
        <div className="absolute -left-14 bottom-0 h-72 w-72 rounded-full bg-violet-500/25 blur-[140px]" />
      </div>

      <Navigation />
      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <Card className="sticky top-4 h-fit rounded-[24px] border-white/10 bg-white/5 text-white backdrop-blur-2xl lg:col-span-1">
            <CardHeader>
              <CardTitle className="truncate text-xl font-semibold">
                {quiz.title}
              </CardTitle>
              <CardDescription className="flex items-center text-slate-300">
                <Clock className="mr-2 h-4 w-4" />
                Thời gian: {quiz.timeLimit} phút
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-200">Tiến độ</span>
                  <span className="text-sm font-semibold text-blue-200">
                    {Math.round(calculateProgress())}%
                  </span>
                </div>
                <Progress
                  value={calculateProgress()}
                  className="h-2 bg-white/10"
                />
              </div>

              <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="flex justify-between text-sm text-slate-200">
                  <span>Thời gian còn lại</span>
                  <span className="font-semibold text-amber-200">
                    {formatTime(timeLeft)}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {quiz.questions.map((q: any, index: number) => {
                    const pageOfQuestion = Math.floor(
                      index / QUESTIONS_PER_PAGE
                    );
                    const isInCurrentPage = pageOfQuestion === currentPage;
                    const answer = quizAnswers[q.id];
                    const isAnswered = Array.isArray(answer)
                      ? answer.length > 0
                      : answer !== "";

                    return (
                      <Button
                        key={q.id}
                        size="icon"
                        onClick={() => setCurrentPage(pageOfQuestion)}
                        className={`rounded-lg border-white/20 text-white hover:bg-white/10 ${
                          isInCurrentPage
                            ? "border-2 border-blue-400 bg-white/10"
                            : "border"
                        } ${
                          isAnswered
                            ? "border-emerald-300/60 bg-emerald-500/30"
                            : ""
                        }`}
                        variant="outline"
                      >
                        {index + 1}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <Button
                className="mt-2 w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600"
                size="lg"
                onClick={handleSubmit}
                disabled={isSubmitting || isSubmited}
              >
                <Send className="mr-2 h-4 w-4" />
                {isSubmited
                  ? "Đã nộp"
                  : isSubmitting
                  ? "Đang nộp..."
                  : "Nộp bài"}
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6 lg:col-span-3">
            <Card className="rounded-[24px] border-white/10 bg-white/5 text-white backdrop-blur-2xl">
              <CardContent className="space-y-6">
                {currentQuestions.map((q: any, idx: number) => (
                  <QuestionCard
                    key={q.id}
                    index={currentPage * QUESTIONS_PER_PAGE + idx}
                    data={q}
                    answer={quizAnswers[q.id]}
                    onAnswer={(val) => handleAnswerChange(q.id, val)}
                  />
                ))}

                <div className="flex justify-between pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    disabled={currentPage === 0}
                    className="rounded-xl border-white/20 text-white hover:bg-white/10"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Trang trước
                  </Button>

                  {(currentPage + 1) * QUESTIONS_PER_PAGE <
                  quiz.questions.length ? (
                    <Button
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                      disabled={isSubmited}
                      className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600"
                    >
                      Trang tiếp
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting || isSubmited}
                      className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      {isSubmited
                        ? "Đã nộp"
                        : isSubmitting
                        ? "Đang nộp..."
                        : "Nộp bài"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {quizResult && (
        <QuizResultDialog
          open={isResultOpen}
          onOpenChange={setIsResultOpen}
          data={quizResult}
        />
      )}
    </div>
  );
}
// 1) Tạo component skeleton
function QuizSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <Card className="lg:col-span-1 sticky top-4 h-fit">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/3 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-10" />
                </div>
                <Skeleton className="h-3 w-full" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-14" />
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-10 rounded-full" />
                  ))}
                </div>
              </div>

              <Skeleton className="h-10 w-full mt-4" />
            </CardContent>
          </Card>

          {/* Content */}
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardContent className="space-y-6 py-6">
                {/* 5 item - tương ứng QUESTIONS_PER_PAGE */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-5 w-2/3" />
                    {/* vài dòng mô tả/option giả */}
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-11/12" />
                    <Skeleton className="h-4 w-10/12" />
                    {/* các option */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                ))}

                <div className="flex justify-between pt-4">
                  <Skeleton className="h-10 w-28" />
                  <Skeleton className="h-10 w-28" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
