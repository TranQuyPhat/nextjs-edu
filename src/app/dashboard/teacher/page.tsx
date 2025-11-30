"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  Award,
  BookOpen,
  Calendar,
  Clock,
  Compass,
  Eye,
  FileText,
  Flame,
  LineChart,
  Plus,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTeacherDashboard } from "@/services/dashboardService";
import { useTeacherRanking } from "@/app/grades/hooks/useTeacherRanking";
import { PageSkeleton } from "@/components/ui/skeleton-modern";

export default function TeacherDashboard() {
  const router = useRouter();

  // Lấy user & token từ localStorage
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.replace("/auth/login");
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch {
      localStorage.removeItem("user");
      router.replace("/auth/login");
    }
  }, [router]);

  const {
    data: dashboardData,
    isLoading,
    error,
  } = useTeacherDashboard(Boolean(user));
  const {
    data: rankingData = [],
    isLoading: rankingLoading,
    error: rankingError,
  } = useTeacherRanking();
  if (isLoading) {
    return <PageSkeleton />;
  }

  if (!user || !dashboardData) return null;

  const total = dashboardData.gradeDistribution?.totalStudents ?? 0;
  const percent = (value: number) =>
    total > 0 ? `${((value * 100) / total).toFixed(0)}%` : "0%";

  const today = new Date();
  const dateMeta = {
    weekday: today.toLocaleDateString("vi-VN", { weekday: "long" }),
    fullDate: today.toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    time: today.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
  };

  const heroMetrics = [
    {
      label: "Lớp đang dạy",
      value: dashboardData.totalClasses,
      delta: "+2 lớp mới",
    },
    {
      label: "Bài cần xử lý",
      value: dashboardData.pendingGrading,
      delta: "Ưu tiên tuần này",
    },
    {
      label: "Điểm trung bình",
      value: `${dashboardData.averageGrade ?? 0}/10`,
      delta: "Ổn định 7 ngày qua",
    },
  ];

  const quickActions = [
    {
      label: "Tạo bài tập",
      description: "Giao nhanh chỉ 3 bước",
      href: "#",
      icon: Plus,
      accent: "from-cyan-400 to-blue-500",
    },
    {
      label: "Quản lý lớp",
      description: "Điều phối lớp & tài liệu",
      href: "/classes/teacher",
      icon: BookOpen,
      accent: "from-emerald-400 to-lime-500",
    },
    {
      label: "Theo dõi điểm",
      description: "Xem biểu đồ & báo cáo",
      href: "/grades/teacher",
      icon: LineChart,
      accent: "from-purple-400 to-pink-500",
    },
    {
      label: "Tạo quiz nhanh",
      description: "Trắc nghiệm & AI chấm",
      href: "/quizzes/teacher",
      icon: Target,
      accent: "from-amber-400 to-orange-500",
    },
  ];

  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-indigo-600/40 via-slate-900 to-slate-950 blur-3xl" />
        <div className="absolute -right-20 top-32 h-64 w-64 rounded-full bg-blue-500/30 blur-[120px]" />
        <div className="absolute -left-10 bottom-0 h-72 w-72 rounded-full bg-violet-500/30 blur-[140px]" />
        <div className="absolute inset-0 opacity-30">
          {[...Array(30)].map((_, index) => (
            <span
              key={index}
              className="absolute h-1 w-1 rounded-full bg-cyan-200/50"
              style={{
                left: `${(index * 37) % 100}%`,
                top: `${(index * 19) % 100}%`,
                animation: `pulse 6s ease-in-out ${index * 0.3}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <Navigation />
      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[32px] border border-white/5 bg-white/5 p-8 shadow-2xl backdrop-blur-3xl">
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.5em] text-slate-300">
                    Giáo viên tiên phong
                  </p>
                  <h1 className="mt-3 text-4xl font-black md:text-5xl">
                    Xin chào, {user.fullName}
                  </h1>
                  <p className="mt-2 text-slate-300">
                    Tổng quan trạng thái lớp học và hiệu suất mới nhất.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 px-6 py-4 text-right text-sm text-slate-200">
                  <p className="text-lg font-semibold text-white">{dateMeta.weekday}</p>
                  <p>{dateMeta.fullDate}</p>
                  <p className="text-cyan-200">{dateMeta.time}</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {heroMetrics.map((metric) => (
                  <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-400">{metric.label}</p>
                    <p className="mt-2 text-3xl font-semibold text-white">{metric.value}</p>
                    <p className="text-xs text-emerald-300">{metric.delta}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid gap-6">
            <Card className="rounded-[28px] border-white/10 bg-slate-900/70 p-6 text-white shadow-xl backdrop-blur-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Lớp học đang hoạt động</p>
                  <p className="mt-2 text-4xl font-bold">{dashboardData.totalClasses}</p>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-4">
                  <BookOpen className="h-6 w-6" />
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-300">
                {dashboardData.totalStudents} học sinh đang được quản lý trong hệ thống của bạn.
              </p>
            </Card>
            <Card className="rounded-[28px] border-white/10 bg-slate-900/70 p-6 text-white shadow-xl backdrop-blur-2xl">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 p-4">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Bài đang chờ chấm</p>
                  <p className="text-3xl font-bold text-white">{dashboardData.pendingGrading}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-300">
                Hãy xử lý trước các bài có hạn trong vòng 24 giờ tới để giữ tiến độ lớp.
              </p>
            </Card>
          </div>
        </section>

        <section className="mt-12 grid gap-8">
          <div className="rounded-[32px] border border-white/5 bg-white/5 p-6 shadow-2xl backdrop-blur-3xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-white">
                <div className="rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 p-2">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.4em] text-slate-300">Command Center</p>
                  <h2 className="text-2xl font-semibold text-white">Thao tác nhanh</h2>
                </div>
              </div>
              <Button variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                <Plus className="mr-2 h-4 w-4" />
                Bắt đầu ngay
              </Button>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {quickActions.map(({ label, description, href, icon: Icon, accent }) => (
                <Link key={label} href={href}>
                  <div className="group rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:bg-white/10">
                    <div className={`mb-4 inline-flex rounded-2xl bg-gradient-to-br ${accent} p-3 text-white shadow-lg`}>
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

        <section className="mt-12 grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-8">
            <Card className="rounded-[28px] border-white/5 bg-slate-900/60 p-6 text-white shadow-xl backdrop-blur-2xl">
              <CardHeader className="flex flex-col gap-2 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3 text-slate-200">
                  <Flame className="h-5 w-5 text-amber-300" />
                  <CardTitle>Hoạt động mới nhất</CardTitle>
                </div>
                <p className="text-sm text-slate-400">Tương tác, bài nộp và câu hỏi từ học sinh</p>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {dashboardData.recentActivities.map((activity, index) => (
                  <div key={activity.id ?? index} className="flex items-start gap-3 rounded-2xl border border-white/5 p-4">
                    <div className="rounded-2xl bg-white/10 p-2">
                      {activity.type === "submission" && <FileText className="h-5 w-5 text-blue-300" />}
                      {activity.type === "grade" && <Award className="h-5 w-5 text-emerald-300" />}
                      {activity.type === "question" && <AlertCircle className="h-5 w-5 text-orange-300" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{activity.message}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                        <Badge variant="outline" className="border-white/20 text-white">
                          {activity.className}
                        </Badge>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-[28px] border-white/5 bg-slate-900/60 p-6 text-white shadow-xl backdrop-blur-2xl">
              <CardHeader className="flex items-center gap-3 border-b border-white/5 pb-4">
                <Calendar className="h-5 w-5 text-cyan-200" />
                <div>
                  <CardTitle>Hạn nộp sắp tới</CardTitle>
                  <p className="text-sm text-slate-400">Theo dõi tiến độ từng lớp để không bỏ lỡ</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {dashboardData.upcomingDeadlinesTeacher.map((deadline) => {
                  const completion = Math.round(
                    (deadline.submittedCount / deadline.totalStudents) * 100 || 0,
                  );
                  return (
                    <div key={deadline.id} className="rounded-2xl border border-white/5 p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-white">{deadline.title}</h4>
                          <Badge variant="outline" className="border-white/20 text-white">
                            {deadline.className}
                          </Badge>
                        </div>
                        <span className="text-sm text-slate-400">{deadline.dueDate}</span>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm text-slate-300">
                          <span>
                            Đã nộp: {deadline.submittedCount}/{deadline.totalStudents}
                          </span>
                          <span>{completion}%</span>
                        </div>
                        <Progress value={completion} className="h-2" />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="rounded-[28px] border-white/5 bg-gradient-to-br from-slate-900/80 to-slate-950/70 p-6 text-white shadow-xl backdrop-blur-3xl">
              <CardHeader className="flex items-center gap-3 border-b border-white/5 pb-4">
                <TrendingUp className="h-5 w-5 text-emerald-300" />
                <div>
                  <CardTitle>Tổng quan thành tích</CardTitle>
                  <p className="text-sm text-slate-400">Tỉ lệ phân bố theo thang điểm</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-3 text-sm text-slate-300">
                  <div className="flex items-center justify-between">
                    <span>Xuất sắc (≥9.0)</span>
                    <span className="font-semibold text-white">
                      {percent(dashboardData.gradeDistribution?.xuatSac ?? 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Giỏi (8.0-8.9)</span>
                    <span className="font-semibold text-white">
                      {percent(dashboardData.gradeDistribution?.gioi ?? 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Khá (6.5-7.9)</span>
                    <span className="font-semibold text-white">
                      {percent(dashboardData.gradeDistribution?.kha ?? 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Cần cải thiện</span>
                    <span className="font-semibold text-white">
                      {percent(dashboardData.gradeDistribution?.canCaiThien ?? 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[28px] border-white/5 bg-white/5 p-6 text-white shadow-xl backdrop-blur-3xl">
              <CardHeader className="flex items-center gap-3 border-b border-white/5 pb-4">
                <Award className="h-5 w-5 text-yellow-300" />
                <div>
                  <CardTitle>Học sinh nổi bật</CardTitle>
                  <p className="text-sm text-slate-300">Điểm trung bình trên 8.0</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {rankingLoading ? (
                  <div className="py-6 text-center text-slate-400">Đang tải...</div>
                ) : rankingError ? (
                  <div className="py-6 text-center text-rose-400">Lỗi tải dữ liệu xếp hạng</div>
                ) : (
                  (() => {
                    const excellentStudents = (rankingData || [])
                      .filter((student) => Number(student.averageScore) > 8)
                      .slice(0, 3);
                    if (excellentStudents.length === 0) {
                      return (
                        <div className="py-6 text-center text-slate-400">
                          Không có học sinh xuất sắc nào (điểm &gt; 8)
                        </div>
                      );
                    }
                    return (
                      <>
                        {excellentStudents.map((student, index) => (
                          <div
                            key={student.studentId ?? `${student.studentEmail}-${index}`}
                            className="flex items-center justify-between rounded-2xl border border-white/5 p-4"
                          >
                            <div>
                              <p className="font-medium text-white">{student.studentName}</p>
                              <p className="text-sm text-slate-300">{student.className}</p>
                            </div>
                            <Badge className="rounded-full bg-emerald-500/20 px-4 py-1 text-emerald-200">
                              {student.averageScore}
                            </Badge>
                          </div>
                        ))}
                        <Link href="/grades/teacher">
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 w-full border-white/30 text-white hover:bg-white/10"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Xem tất cả xếp hạng
                          </Button>
                        </Link>
                      </>
                    );
                  })()
                )}
              </CardContent>
            </Card>

            <Card className="rounded-[28px] border-white/5 bg-slate-900/60 p-6 text-white shadow-xl backdrop-blur-2xl">
              <CardHeader className="flex items-center gap-3 border-b border-white/5 pb-4">
                <Compass className="h-5 w-5 text-cyan-300" />
                <div>
                  <CardTitle>Chiến lược tuần này</CardTitle>
                  <p className="text-sm text-slate-400">Tối ưu hiệu suất giảng dạy</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4 text-sm text-slate-300">
                <p>• Ưu tiên chấm dứt điểm các bài Toán 11 trước thứ Năm để giảm backlog.</p>
                <p>• Tổ chức live session Q&A cho lớp 12A1 để giải đáp thắc mắc đề cương.</p>
                <p>• Theo dõi sát nhóm học sinh “Cần cải thiện” và gửi nhắc nhở cá nhân.</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
