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
import { Clock, Users, CheckCircle, Play, Eye, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDateTime } from "@/untils/dateFormatter";
import Loading from "@/components/loading";

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
        const token = localStorage.getItem("accessToken");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/quizzes/student`,
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

  if (!user) return <Loading />;

  // ----- UI -----
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Bài kiểm tra trắc nghiệm
            </h1>
            <p className="text-gray-600">Làm bài kiểm tra và xem kết quả</p>
          </div>

          <Tabs defaultValue="available" className="space-y-4">
            <TabsList>
              <TabsTrigger value="available">Có thể làm</TabsTrigger>
              <TabsTrigger value="upcoming">Sắp diễn ra</TabsTrigger>
              <TabsTrigger value="closed">Đã đóng</TabsTrigger>
              <TabsTrigger value="completed">Đã nộp</TabsTrigger>
            </TabsList>

            {/* Có thể làm */}
            <TabsContent value="available" className="space-y-4">
              {availableQuizzes.length === 0 ? (
                <Card>
                  <CardContent className="py-6 text-gray-600">
                    Không có bài nào.
                  </CardContent>
                </Card>
              ) : (
                availableQuizzes.map((quiz) => (
                  <QuizCard
                    key={quiz.id}
                    quiz={quiz}
                    router={router}
                    showButton
                  />
                ))
              )}
            </TabsContent>

            {/* Sắp diễn ra */}
            <TabsContent value="upcoming" className="space-y-4">
              {upcomingQuizzes.length === 0 ? (
                <Card>
                  <CardContent className="py-6 text-gray-600">
                    Không có bài nào sắp diễn ra.
                  </CardContent>
                </Card>
              ) : (
                upcomingQuizzes.map((quiz) => (
                  <QuizCard key={quiz.id} quiz={quiz} router={router} />
                ))
              )}
            </TabsContent>

            {/* Đã đóng nhưng chưa nộp */}
            <TabsContent value="closed" className="space-y-4">
              {closedQuizzes.length === 0 ? (
                <Card>
                  <CardContent className="py-6 text-gray-600">
                    Không có bài đã đóng.
                  </CardContent>
                </Card>
              ) : (
                closedQuizzes.map((quiz) => (
                  <QuizCard key={quiz.id} quiz={quiz} router={router} />
                ))
              )}
            </TabsContent>

            {/* Đã nộp */}
            <TabsContent value="completed" className="space-y-4">
              {completedQuizzes.length === 0 ? (
                <Card>
                  <CardContent className="py-6 text-gray-600">
                    Chưa có bài đã nộp.
                  </CardContent>
                </Card>
              ) : (
                completedQuizzes.map((quiz) => (
                  <QuizCard
                    key={quiz.id}
                    quiz={quiz}
                    router={router}
                    showResult
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );

  // ----- Sub Component -----
  function QuizCard({
    quiz,
    router,
    showButton = false,
    showResult = false,
  }: {
    quiz: StudentQuiz;
    router: any;
    showButton?: boolean;
    showResult?: boolean;
  }) {
    const totalQuestions = quiz.totalQuestion ?? 0;
    const scoreText = quiz.score != null ? `Điểm: ${quiz.score}` : null;

    return (
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{quiz.title}</CardTitle>
              <CardDescription className="mt-1">
                Lớp {quiz.className} • {quiz.timeLimit} phút • {totalQuestions}{" "}
                câu hỏi
              </CardDescription>
            </div>
            {getStatusBadge(quiz.submitted, quiz.endDate ?? undefined)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {quiz.description && (
            <p className="text-gray-600">{quiz.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm">
            {quiz.startDate && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-600" />
                <span>Mở: {formatDateTime(quiz.startDate)}</span>
              </div>
            )}
            {quiz.endDate && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-red-500" />
                <span>Đóng: {formatDateTime(quiz.endDate)}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>Thời gian: {quiz.timeLimit} phút</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span>Số câu: {totalQuestions}</span>
            </div>
          </div>

          {showButton && (
            <Button onClick={() => router.push(`student/${quiz.id}`)}>
              <Play className="h-4 w-4 mr-2" />
              Bắt đầu làm bài
            </Button>
          )}

          {showResult && (
            <div className="flex gap-2">
              {scoreText && <Badge className="bg-green-500">{scoreText}</Badge>}
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4 mr-1" />
                Xem kết quả
              </Button>
              <Button size="sm" variant="outline">
                Xem đáp án
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
}
