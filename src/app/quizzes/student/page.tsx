"use client";

import { useState, useEffect, useMemo } from "react";
import Navigation from "@/components/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  Users,
  CheckCircle,
  Play,
  Eye,
  Lock,
  Sparkles,
  Calendar,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDateTime } from "@/untils/dateFormatter";
import Loading from "@/components/loading";
import { getAccessToken } from "@/lib/auth";

type StudentQuiz = {
  id: number;
  title: string;
  description?: string | null;
  className?: string | null;
  timeLimit?: number | null;
  totalQuestion?: number | null;
  startDate?: string | null; // "2025-08-30T00:00:00"
  endDate?: string | null; // "2025-08-31T00:00:00"
  subject?: string | null;
  submitted?: boolean;
  score?: number | null;
};

export default function StudentQuizzesPage() {
  const [user, setUser] = useState<any>(null);
  const [quizzes, setQuizzes] = useState<StudentQuiz[]>([]);
  const [now, setNow] = useState(new Date());
  const router = useRouter();

  // Cập nhật thời gian mỗi phút để UI tự đổi nhóm quiz
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  // Lấy user và danh sách quiz
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));

    const fetchQuizzes = async () => {
      try {
        const token = getAccessToken();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/student`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const payload = await res.json();
        setQuizzes(payload.data || []);
      } catch (e) {
        console.error("Error fetching quizzes:", e);
      }
    };

    fetchQuizzes();
  }, []);

  // Phân loại quiz
  const { availableQuizzes, upcomingQuizzes, closedQuizzes, completedQuizzes } =
    useMemo(() => {
      const available: StudentQuiz[] = [];
      const upcoming: StudentQuiz[] = [];
      const closed: StudentQuiz[] = [];
      const completed: StudentQuiz[] = [];

      (quizzes || []).forEach((q) => {
        const start = q.startDate ? new Date(q.startDate) : null;
        const end = q.endDate ? new Date(q.endDate) : null;

        if (q.submitted) {
          completed.push(q);
        } else if (start && start > now) {
          upcoming.push(q);
        } else if (start && start <= now && (!end || end >= now)) {
          available.push(q);
        } else if (end && end < now) {
          closed.push(q);
        }
      });

      return {
        availableQuizzes: available,
        upcomingQuizzes: upcoming,
        closedQuizzes: closed,
        completedQuizzes: completed,
      };
    }, [quizzes, now]);

  // Badge trạng thái
  const getStatusBadge = (
    submitted: boolean | undefined,
    endDate?: string | null
  ) => {
    const due = endDate ? new Date(endDate) : null;

    if (submitted) {
      return (
        <Badge className="bg-green-500">
          <CheckCircle className="h-3 w-3 mr-1" />
          Đã nộp
        </Badge>
      );
    }
    if (due && due < now) {
      return (
        <Badge variant="destructive">
          <Lock className="h-3 w-3 mr-1" />
          Đã đóng
        </Badge>
      );
    }
    return (
      <Badge className="bg-blue-500">
        <Clock className="h-3 w-3 mr-1" />
        Đang mở
      </Badge>
    );
  };

  const totalCount = quizzes.length;

  if (!user) return <Loading />;

  // ----- UI -----
  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-indigo-600/35 via-slate-900 to-slate-950 blur-3xl" />
        <div className="absolute -right-20 top-28 h-64 w-64 rounded-full bg-blue-500/30 blur-[130px]" />
        <div className="absolute -left-14 bottom-0 h-72 w-72 rounded-full bg-violet-500/25 blur-[140px]" />
        <div className="absolute inset-0 opacity-30">
          {[...Array(28)].map((_, index) => (
            <span
              key={index}
              className="absolute h-1 w-1 rounded-full bg-cyan-200/40"
              style={{
                left: `${(index * 33) % 100}%`,
                top: `${(index * 21) % 100}%`,
                animation: `pulse 6s ease-in-out ${index * 0.25}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <Navigation />
      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <section className="rounded-[32px] border border-white/5 bg-white/5 p-8 shadow-2xl backdrop-blur-3xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.35em] text-blue-200">
                <Sparkles className="h-3.5 w-3.5" />
                Trắc nghiệm
              </span>
              <div>
                <h1 className="text-4xl font-black md:text-5xl">
                  Bài kiểm tra trắc nghiệm
                </h1>
                <p className="mt-2 max-w-2xl text-slate-300">
                  Theo dõi bài đang mở, sắp diễn ra và đã nộp trong một giao
                  diện thống nhất.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  {
                    label: "Tổng bài",
                    value: totalCount,
                    detail: "Bao gồm mọi trạng thái",
                  },
                  {
                    label: "Đang mở",
                    value: availableQuizzes.length,
                    detail: "Có thể làm ngay",
                  },
                  {
                    label: "Đã nộp",
                    value: completedQuizzes.length,
                    detail: "Xem kết quả",
                  },
                ].map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <p className="text-sm text-slate-300">{metric.label}</p>
                    <p className="mt-1 text-2xl font-semibold text-white">
                      {metric.value}
                    </p>
                    <p className="text-xs text-blue-200">{metric.detail}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-slate-200">
              <p className="text-lg font-semibold text-white">Lưu ý</p>
              <p className="text-slate-300">
                Hãy kiểm tra thời gian mở/đóng trước khi bắt đầu.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-[32px] border border-white/5 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-2xl">
          <Tabs defaultValue="available" className="space-y-6">
            <TabsList className="flex w-full flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
              {[
                {
                  value: "available",
                  label: `Có thể làm (${availableQuizzes.length})`,
                },
                {
                  value: "upcoming",
                  label: `Sắp diễn ra (${upcomingQuizzes.length})`,
                },
                { value: "closed", label: `Đã đóng (${closedQuizzes.length})` },
                {
                  value: "completed",
                  label: `Đã nộp (${completedQuizzes.length})`,
                },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex-1 rounded-xl text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="available" className="space-y-4">
              <QuizList
                emptyText="Không có bài nào đang mở."
                items={availableQuizzes}
                action="start"
              />
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-4">
              <QuizList
                emptyText="Không có bài nào sắp diễn ra."
                items={upcomingQuizzes}
              />
            </TabsContent>

            <TabsContent value="closed" className="space-y-4">
              <QuizList
                emptyText="Không có bài đã đóng."
                items={closedQuizzes}
              />
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              <QuizList
                emptyText="Chưa có bài đã nộp."
                items={completedQuizzes}
                action="result"
              />
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  );

  // ----- Sub Component -----
  function QuizList({
    items,
    emptyText,
    action,
  }: {
    items: StudentQuiz[];
    emptyText: string;
    action?: "start" | "result";
  }) {
    if (!items.length) {
      return (
        <Card className="border border-white/10 bg-white/5 text-white">
          <CardContent className="py-6 text-slate-300 text-center">
            {emptyText}
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((quiz) => (
          <QuizCard key={quiz.id} quiz={quiz} action={action} />
        ))}
      </div>
    );
  }

  function QuizCard({
    quiz,
    action,
  }: {
    quiz: StudentQuiz;
    action?: "start" | "result";
  }) {
    const totalQuestions = quiz.totalQuestion ?? 0;
    const scoreText = quiz.score != null ? `Điểm: ${quiz.score}` : null;
    const isClosed = quiz.endDate ? new Date(quiz.endDate) < now : false;
    const isUpcoming = quiz.startDate ? new Date(quiz.startDate) > now : false;

    return (
      <Card className="rounded-[20px] border border-white/10 bg-white/5 text-white shadow-xl transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold">
                {quiz.title}
              </CardTitle>
              <CardDescription className="text-sm text-slate-300">
                {quiz.className || "Lớp chưa rõ"} • {quiz.timeLimit} phút •{" "}
                {totalQuestions} câu hỏi
              </CardDescription>
            </div>
            {getStatusBadge(quiz.submitted, quiz.endDate ?? undefined)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          {quiz.description && (
            <p className="text-sm text-slate-200">{quiz.description}</p>
          )}

          <div className="grid gap-2 text-sm text-slate-200">
            {quiz.startDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-300" />
                <span>Mở: {formatDateTime(quiz.startDate)}</span>
              </div>
            )}
            {quiz.endDate && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-rose-300" />
                <span>Đóng: {formatDateTime(quiz.endDate)}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-300" />
              <span>Thời gian: {quiz.timeLimit} phút</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-300" />
              <span>Số câu: {totalQuestions}</span>
            </div>
          </div>

          {action === "start" && !quiz.submitted && !isClosed && (
            <Button
              onClick={() => router.push(`student/${quiz.id}`)}
              className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600"
              disabled={isUpcoming}
            >
              <Play className="mr-2 h-4 w-4" />
              {isUpcoming ? "Chưa mở" : "Bắt đầu làm bài"}
            </Button>
          )}

          {action === "result" && (
            <div className="flex flex-wrap items-center gap-2">
              {scoreText && (
                <Badge className="border-none bg-emerald-500/80 text-white">
                  {scoreText}
                </Badge>
              )}
              <Button
                size="sm"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Eye className="mr-1 h-4 w-4" />
                Xem kết quả
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Xem đáp án
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
}
