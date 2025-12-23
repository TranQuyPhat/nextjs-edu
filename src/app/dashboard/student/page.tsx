"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  FileText,
  Clock,
  CheckCircle,
  TrendingUp,
  Calendar,
  Award,
  Target,
  MapPin,
  User,
  ArrowRight,
  Sparkles,
  BarChart3,
  Layers,
} from "lucide-react";

import { StudentDashboardResponse } from "@/types/dashboard";
import { fetchStudentDashboard } from "@/services/dashboardService";
import { useRecentScoreOfStudent } from "../hooks/useRecentScoreOfStudent";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { getScheduleByWeek, LessonItem, DaySchedule } from "../../../services/scheduleService";

import { toast } from "react-toastify";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function StudentDashboard() {
  const router = useRouter();
  const { data, isLoading, isError, error } = useRecentScoreOfStudent();

  const [user, setUser] = useState<{ fullName: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [todayLessons, setTodayLessons] = useState<LessonItem[]>([]);
  const [loadingSchedule, setLoadingSchedule] = useState(true);

  // Dashboard state (kết hợp API + mock)
  const [dashboardData, setDashboardData] = useState<{
    enrolledClasses: number;
    totalAssignments: number;
    completedAssignments: number;
    pendingAssignments: number;
    averageGrade: number;
    upcomingDeadlines: any[];
    recentGrades: any[];
    classProgress: any[];
  }>({
    enrolledClasses: 0,
    totalAssignments: 0,
    completedAssignments: 0,
    pendingAssignments: 0,
    averageGrade: 8.5,
    upcomingDeadlines: [
      {
        id: 1,
        title: "Bài tập Chương 4 - Hàm số",
        class: "Toán 12A1",
        dueDate: "2024-01-28",
        timeLeft: "3 ngày",
        status: "pending",
      },
      {
        id: 2,
        title: "Kiểm tra giữa kỳ",
        class: "Vật lý 12A1",
        dueDate: "2024-01-30",
        timeLeft: "5 ngày",
        status: "pending",
      },
    ],
    recentGrades: [
      {
        id: 1,
        assignment: "Bài tập Chương 3",
        class: "Toán 12A1",
        grade: 9.0,
        maxGrade: 10,
        date: "2024-01-20",
      },
      {
        id: 2,
        assignment: "Kiểm tra 15 phút",
        class: "Vật lý 12A1",
        grade: 8.5,
        maxGrade: 10,
        date: "2024-01-18",
      },
      {
        id: 3,
        assignment: "Thí nghiệm 1",
        class: "Hóa 12A1",
        grade: 8.0,
        maxGrade: 10,
        date: "2024-01-15",
      },
    ],
    classProgress: [
      {
        class: "Toán 12A1",
        completed: 5,
        total: 6,
        average: 8.8,
      },
      {
        class: "Vật lý 12A1",
        completed: 4,
        total: 5,
        average: 8.2,
      },
      {
        class: "Hóa 12A1",
        completed: 3,
        total: 4,
        average: 8.5,
      },
    ],
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("user");
    if (!token || !userData) {
      router.replace("/auth/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchStudentDashboard()
        .then((data: StudentDashboardResponse) => {
          setDashboardData((prev) => ({
            ...prev,
            enrolledClasses: data.enrolledClasses,
            totalAssignments: data.totalAssignments,
            completedAssignments: data.completedAssignments,
            averageGrade: data.avgScore,
            upcomingDeadlines: data.upcomingDeadlines,
            pendingAssignments:
              data.totalAssignments - data.completedAssignments,
            classProgress: data.classProgress,
          }));
        })
        .catch((error: any) => {
          console.error("Không thể load dashboard student");
          toast.error(
            error?.response?.data?.messages?.[0] ??
              "Không thể load dashboard student"
          );
        })
        .finally(() => setLoading(false));
    } catch {
      localStorage.removeItem("user");
      router.replace("/auth/login");
    }
  }, [router]);

  // Fetch today's schedule
  useEffect(() => {
    const fetchTodaySchedule = async () => {
      try {
        setLoadingSchedule(true);
        const today = format(new Date(), "yyyy-MM-dd");
        const scheduleData = await getScheduleByWeek(today);
        
        // Find today's lessons
        const todayDate = format(new Date(), "yyyy-MM-dd");
        const todaySchedule = scheduleData.schedules.find(
          (day: DaySchedule) => day.date === todayDate
        );
        
        if (todaySchedule) {
          setTodayLessons(todaySchedule.lessons || []);
        } else {
          setTodayLessons([]);
        }
      } catch (error) {
        console.error("Error fetching today's schedule:", error);
        setTodayLessons([]);
      } finally {
        setLoadingSchedule(false);
      }
    };

    if (user) {
      fetchTodaySchedule();
    }
  }, [user]);

  const getGradeBadge = (grade: number, maxGrade: number) => {
    const percentage = (grade / maxGrade) * 100;
    if (percentage >= 90)
      return <Badge className="bg-green-500">Xuất sắc</Badge>;
    if (percentage >= 80) return <Badge className="bg-blue-500">Giỏi</Badge>;
    if (percentage >= 65) return <Badge className="bg-yellow-500">Khá</Badge>;
    if (percentage >= 50)
      return <Badge className="bg-orange-500">Trung bình</Badge>;
    return <Badge variant="destructive">Yếu</Badge>;
  };

  const completionRate = useMemo(() => {
    if (!dashboardData.totalAssignments) return 0;
    return Math.round(
      (dashboardData.completedAssignments / dashboardData.totalAssignments) * 100
    );
  }, [dashboardData.completedAssignments, dashboardData.totalAssignments]);

  const quickActions = [
    {
      label: "Bài tập",
      description: "Xem và nộp nhanh",
      href: "/quizzes/student",
      icon: FileText,
      accent: "from-cyan-400 to-blue-500",
    },
    {
      label: "Lớp học",
      description: "Theo dõi tiến độ",
      href: "/classes/student",
      icon: BookOpen,
      accent: "from-emerald-400 to-lime-500",
    },
    {
      label: "Điểm số",
      description: "Biểu đồ & lịch sử",
      href: "/grades/student",
      icon: TrendingUp,
      accent: "from-purple-400 to-pink-500",
    },
    {
      label: "Thời khóa biểu",
      description: "Lịch học trong ngày",
      href: "/schedule/student",
      icon: Calendar,
      accent: "from-amber-400 to-orange-500",
    },
  ];

  if (loading) {
    return (
      <div className="relative min-h-screen bg-slate-950 text-white">
        <Navigation />
        <div className="container mx-auto flex h-64 items-center justify-center">
          <DotLottieReact src="/animations/loading.lottie" loop autoplay />
        </div>
      </div>
    );
  }
  if (!user) return null;

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "quiz":
        return <Target className="h-4 w-4 text-blue-500" />;
      case "assignment":
        return <FileText className="h-4 w-4 text-green-500" />;
      case "exam":
        return <Award className="h-4 w-4 text-purple-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "quiz":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "assignment":
        return "bg-green-50 text-green-700 border-green-200";
      case "exam":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };
  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-indigo-600/40 via-slate-900 to-slate-950 blur-3xl" />
        <div className="absolute -right-16 top-32 h-64 w-64 rounded-full bg-blue-500/30 blur-[120px]" />
        <div className="absolute -left-12 bottom-0 h-72 w-72 rounded-full bg-violet-500/30 blur-[140px]" />
        <div className="absolute inset-0 opacity-30">
          {[...Array(26)].map((_, index) => (
            <span
              key={index}
              className="absolute h-1 w-1 rounded-full bg-cyan-200/50"
              style={{
                left: `${(index * 29) % 100}%`,
                top: `${(index * 17) % 100}%`,
                animation: `pulse 6s ease-in-out ${index * 0.25}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <Navigation />
      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[32px] border border-white/5 bg-white/5 p-8 shadow-2xl backdrop-blur-3xl">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <p className="text-sm uppercase tracking-[0.45em] text-slate-300">
                  Học viên chủ động
                </p>
                <h1 className="mt-3 text-4xl font-black md:text-5xl">
                  Chào {user.fullName}
                </h1>
                <p className="mt-2 text-slate-300">
                  Theo dõi tiến độ, hạn nộp và lịch học mới nhất.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 px-6 py-4 text-right text-sm text-slate-200">
                <p className="text-lg font-semibold text-white">
                  {format(new Date(), "EEEE", { locale: vi })}
                </p>
                <p>{format(new Date(), "dd MMMM yyyy", { locale: vi })}</p>
                <p className="text-cyan-200">
                  {format(new Date(), "HH:mm", { locale: vi })}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-300">Lớp đang học</p>
                <p className="mt-2 text-3xl font-semibold text-white">
                  {dashboardData.enrolledClasses}
                </p>
                <p className="text-xs text-emerald-300">Cập nhật realtime</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-300">Bài đã nộp</p>
                <p className="mt-2 text-3xl font-semibold text-white">
                  {dashboardData.completedAssignments}/{dashboardData.totalAssignments}
                </p>
                <p className="text-xs text-cyan-300">Ưu tiên bài đến hạn</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-300">Điểm trung bình</p>
                <p className="mt-2 text-3xl font-semibold text-white">
                  {dashboardData.averageGrade}
                </p>
                <p className="text-xs text-amber-300">Ổn định tuần này</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <Card className="rounded-[28px] border-white/10 bg-slate-900/70 p-6 text-white shadow-xl backdrop-blur-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Tổng bài cần làm</p>
                  <p className="mt-2 text-4xl font-bold">
                    {dashboardData.pendingAssignments}
                  </p>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-4">
                  <Clock className="h-6 w-6" />
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-300">
                Ưu tiên hoàn thành trước hạn để giữ nhịp học.
              </p>
            </Card>

            <Card className="rounded-[28px] border-white/10 bg-slate-900/70 p-6 text-white shadow-xl backdrop-blur-2xl">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 p-4">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-300">Tiến độ tổng thể</p>
                  <p className="text-3xl font-bold text-white">{completionRate}%</p>
                </div>
              </div>
              <Progress value={completionRate} className="mt-4 h-2" />
            </Card>
          </div>
        </section>

        <section className="mt-10 grid gap-8">
          <div className="rounded-[32px] border border-white/5 bg-white/5 p-6 shadow-2xl backdrop-blur-3xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-white">
                <div className="rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 p-2">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-300">
                    Lối tắt nhanh
                  </p>
                  <h2 className="text-2xl font-semibold text-white">Thao tác nổi bật</h2>
                </div>
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {quickActions.map(({ label, description, href, icon: Icon, accent }) => (
                <Link key={label} href={href}>
                  <div className="group rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:bg-white/10">
                    <div
                      className={`mb-4 inline-flex rounded-2xl bg-gradient-to-br ${accent} p-3 text-white shadow-lg`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-lg font-semibold text-white">{label}</p>
                    <p className="text-sm text-slate-300">{description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <Card className="rounded-[28px] border-white/5 bg-slate-900/60 p-6 text-white shadow-xl backdrop-blur-2xl">
              <CardHeader className="flex flex-col gap-2 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3 text-slate-200">
                  <Clock className="h-5 w-5 text-cyan-200" />
                  <CardTitle>Hạn nộp sắp tới</CardTitle>
                </div>
                <p className="text-sm text-slate-400">Đừng để lỡ deadline quan trọng</p>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {dashboardData.upcomingDeadlines.map((deadline) => (
                  <div
                    key={deadline.id}
                    className="rounded-2xl border border-white/5 p-4 transition hover:border-white/10 hover:bg-white/5"
                  >
                    <div className="flex justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="text-lg font-semibold text-white">{deadline.title}</h4>
                        <Badge variant="outline" className="border-white/20 text-white">
                          {deadline.className}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-amber-300">{deadline.daysLeft}</span>
                        <p className="text-xs text-slate-400">{deadline.dueDate}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" className="bg-white text-slate-900 hover:bg-slate-200">
                        Làm bài
                      </Button>
                      <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        Xem chi tiết
                      </Button>
                    </div>
                  </div>
                ))}
                {dashboardData.upcomingDeadlines.length === 0 && (
                  <div className="py-8 text-center text-slate-400">
                    <CheckCircle className="mx-auto mb-2 h-12 w-12 opacity-70" />
                    <p>Bạn đã hoàn thành tất cả bài tập!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-[28px] border-white/5 bg-slate-900/60 p-6 text-white shadow-xl backdrop-blur-2xl">
              <CardHeader className="flex items-center gap-3 border-b border-white/5 pb-4">
                <Award className="h-5 w-5 text-yellow-300" />
                <div>
                  <CardTitle>Điểm số gần đây</CardTitle>
                  <p className="text-sm text-slate-400">Theo dõi kết quả mới nhất</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {data?.map((score, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-white/5 p-4 transition hover:border-white/10 hover:bg-white/5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          {getTypeIcon(score.type)}
                          <h4 className="text-lg font-semibold text-white">{score.title}</h4>
                        </div>
                        <Badge variant="outline" className="text-xs border-white/20 text-white">
                          {score.className}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="mb-1 text-2xl font-bold text-white">{score.score}/10</div>
                        {getGradeBadge(score.score, 10)}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3 text-sm text-slate-400">
                      <Badge
                        variant="outline"
                        className={`${getTypeColor(score.type)} border-none text-xs font-medium`}
                      >
                        {score.type}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {format(new Date(score.submittedAt), "dd/MM/yyyy HH:mm", {
                            locale: vi,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {(!data || data.length === 0) && (
                  <div className="py-8 text-center text-slate-400">
                    <FileText className="mx-auto mb-3 h-12 w-12 opacity-50" />
                    <p>Chưa có kết quả nào</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="rounded-[28px] border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-950/70 p-6 text-white shadow-xl backdrop-blur-3xl">
              <CardHeader className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-cyan-200" />
                  <div>
                    <CardTitle>Lịch học hôm nay</CardTitle>
                    <p className="text-sm text-slate-400">Những buổi không thể bỏ lỡ</p>
                  </div>
                </div>
                <Link href="/schedule/student">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="border border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
                  >
                    Xem tất cả
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="pt-4">
                {loadingSchedule ? (
                  <div className="py-4 text-center text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-cyan-400" />
                      <span className="text-sm">Đang tải...</span>
                    </div>
                  </div>
                ) : todayLessons.length === 0 ? (
                  <div className="py-6 text-center text-slate-400">
                    <Calendar className="mx-auto mb-3 h-12 w-12 text-slate-500" />
                    <p>Hôm nay không có lịch học</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {todayLessons.map((lesson, index) => {
                      let hash = 0;
                      for (let i = 0; i < lesson.subjectName.length; i++) {
                        hash = lesson.subjectName.charCodeAt(i) + ((hash << 5) - hash);
                      }
                      const colorIndex = Math.abs(hash) % 10;
                      const colors = [
                        "from-blue-500 to-blue-600",
                        "from-purple-500 to-purple-600",
                        "from-pink-500 to-pink-600",
                        "from-indigo-500 to-indigo-600",
                        "from-teal-500 to-teal-600",
                        "from-cyan-500 to-cyan-600",
                        "from-emerald-500 to-emerald-600",
                        "from-amber-500 to-amber-600",
                        "from-orange-500 to-orange-600",
                        "from-rose-500 to-rose-600",
                      ];
                      const gradient = colors[colorIndex];

                      return (
                        <div
                          key={lesson.sessionId || index}
                          className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm transition hover:border-white/20 hover:bg-white/10"
                        >
                          <div className="flex items-start gap-3">
                            <div className={`h-full min-h-[60px] w-1 rounded-full bg-gradient-to-b ${gradient}`} />
                            <div className="flex-1 min-w-0">
                              <div className="mb-2 flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <h4 className="text-sm font-semibold text-white">
                                    {lesson.subjectName}
                                  </h4>
                                  <p className="text-xs text-slate-300">{lesson.className}</p>
                                </div>
                                <div className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-xs font-medium text-slate-200">
                                  <Clock className="h-3 w-3" />
                                  <span>
                                    Tiết {lesson.startPeriod}-{lesson.endPeriod}
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                  <span>{lesson.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <User className="h-3.5 w-3.5 text-slate-400" />
                                  <span className="truncate max-w-[140px]">
                                    {lesson.teacherName}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-[28px] border-white/5 bg-slate-900/60 p-6 text-white shadow-xl backdrop-blur-2xl">
              <CardHeader className="flex items-center gap-3 border-b border-white/5 pb-4">
                <TrendingUp className="h-5 w-5 text-emerald-300" />
                <div>
                  <CardTitle>Tiến độ theo lớp</CardTitle>
                  <p className="text-sm text-slate-400">Theo dõi mức độ hoàn thành từng lớp</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {dashboardData.classProgress.map((classItem, index) => {
                  const percent = Math.round(
                    (classItem.completed / classItem.total) * 100
                  );
                  return (
                    <div key={index} className="space-y-2 rounded-2xl border border-white/5 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-white">
                          <Layers className="h-4 w-4 text-cyan-200" />
                          <span className="font-medium">{classItem.className}</span>
                        </div>
                        <span className="text-sm text-slate-300">
                          {classItem.completed}/{classItem.total} bài tập
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Hoàn thành</span>
                        <span className="font-semibold text-white">{percent}%</span>
                      </div>
                      <Progress value={percent} className="h-2" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="rounded-[28px] border-white/5 bg-white/5 p-6 text-white shadow-xl backdrop-blur-3xl">
              <CardHeader className="flex items-center gap-3 border-b border-white/5 pb-4">
                <Award className="h-5 w-5 text-yellow-300" />
                <div>
                  <CardTitle>Thành tích</CardTitle>
                  <p className="text-sm text-slate-300">Sẽ cập nhật khi có huy hiệu mới</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div className="py-8 text-center text-slate-400">
                  <FileText className="mx-auto mb-3 h-12 w-12 opacity-50" />
                  <p>Hiện tại bạn chưa có thành tích nào!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
