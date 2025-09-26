"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  BookOpen,
  FileText,
  Clock,
  TrendingUp,
  Award,
  AlertCircle,
  Plus,
  Eye,
  Calendar,
  Target,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTeacherDashboard } from "@/services/dashboardService";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
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

<<<<<<< HEAD
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
=======
  if (loading) {
    return (
      <div>
        <Navigation />
        <div className="container mx-auto p-6 h-52 flex justify-center items-center">
          <DotLottieReact src="/animations/loading.lottie" loop autoplay />
        </div>
      </div>
    );
>>>>>>> 6629ee2 (update loading)
  }

  if (!user || !dashboardData) return null;

  const total = dashboardData.gradeDistribution?.totalStudents ?? 0;
  const percent = (value: number) =>
    total > 0 ? `${((value * 100) / total).toFixed(0)}%` : "0%";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navigation />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                Chào mừng trở lại!
              </h1>
              <p className="text-xl text-gray-600 font-medium">
                Xin chào, <span className="text-blue-600 font-semibold">{user.fullName}</span>
              </p>
              <p className="text-gray-500 mt-1">
                Tổng quan về hoạt động giảng dạy của bạn
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {new Date().toLocaleDateString('vi-VN', { weekday: 'long' })}
                  </div>
                  <div className="text-lg text-gray-600">
                    {new Date().toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-105 hover:-translate-y-2 overflow-hidden">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
                <CardTitle className="text-sm font-semibold text-gray-700">Lớp học</CardTitle>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {dashboardData.totalClasses}
                </div>
                <p className="text-sm text-gray-500">Đang giảng dạy</p>
              </CardContent>
            </div>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-105 hover:-translate-y-2 overflow-hidden">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
                <CardTitle className="text-sm font-semibold text-gray-700">Học sinh</CardTitle>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {dashboardData.totalStudents}
                </div>
                <p className="text-sm text-gray-500">Tổng số học sinh</p>
              </CardContent>
            </div>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-105 hover:-translate-y-2 overflow-hidden">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
                <CardTitle className="text-sm font-semibold text-gray-700">Bài tập</CardTitle>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-6 w-6 text-white" />
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {dashboardData.totalAssignments}
                </div>
                <p className="text-sm text-gray-500">Đã tạo</p>
              </CardContent>
            </div>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-105 hover:-translate-y-2 overflow-hidden">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
                <CardTitle className="text-sm font-semibold text-gray-700">Chờ chấm</CardTitle>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="text-3xl font-bold text-orange-600 mb-1">
                  {dashboardData.pendingGrading}
                </div>
                <p className="text-sm text-gray-500">Bài nộp mới</p>
              </CardContent>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-500">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  Thao tác nhanh
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <Link href="#">
                    <Button className="w-full h-24 flex flex-col gap-3 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-xl">
                      <Plus className="h-6 w-6" />
                      <span className="text-sm font-semibold">Tạo bài tập</span>
                    </Button>
                  </Link>
                  <Link href="/classes/teacher">
                    <Button
                      variant="outline"
                      className="w-full h-24 flex flex-col gap-3 bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-105 transition-all duration-300 border-2 border-green-200 hover:border-green-300 rounded-xl"
                    >
                      <BookOpen className="h-6 w-6 text-green-600" />
                      <span className="text-sm font-semibold text-green-700">Quản lý lớp</span>
                    </Button>
                  </Link>
                  <Link href="/grades/teacher">
                    <Button
                      variant="outline"
                      className="w-full h-24 flex flex-col gap-3 bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-105 transition-all duration-300 border-2 border-purple-200 hover:border-purple-300 rounded-xl"
                    >
                      <Award className="h-6 w-6 text-purple-600" />
                      <span className="text-sm font-semibold text-purple-700">Xem điểm</span>
                    </Button>
                  </Link>
                  <Link href="/quizzes/teacher">
                    <Button
                      variant="outline"
                      className="w-full h-24 flex flex-col gap-3 bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-105 transition-all duration-300 border-2 border-orange-200 hover:border-orange-300 rounded-xl"
                    >
                      <Target className="h-6 w-6 text-orange-600" />
                      <span className="text-sm font-semibold text-orange-700">Tạo quiz</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Hoạt động gần đây</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dashboardData.recentActivities.map((activity, index) => (
                  <div
                    key={activity.id ?? index}
                    className="flex items-start space-x-3"
                  >
                    <div className="flex-shrink-0">
                      {activity.type === "submission" && (
                        <FileText className="h-5 w-5 text-blue-500" />
                      )}
                      {activity.type === "grade" && (
                        <Award className="h-5 w-5 text-green-500" />
                      )}
                      {activity.type === "question" && (
                        <AlertCircle className="h-5 w-5 text-orange-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {activity.className}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            {/* Upcoming Deadlines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" /> Hạn nộp sắp tới
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dashboardData.upcomingDeadlinesTeacher.map((deadline) => (
                  <div key={deadline.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{deadline.title}</h4>
                        <Badge variant="outline">{deadline.className}</Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {deadline.dueDate}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>
                          Đã nộp: {deadline.submittedCount}/
                          {deadline.totalStudents}
                        </span>
                        <span>
                          {Math.round(
                            (deadline.submittedCount / deadline.totalStudents) *
                              100
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={
                          (deadline.submittedCount / deadline.totalStudents) *
                          100
                        }
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          {/* Right Column */}
          <div className="space-y-6">
            {/* Performance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" /> Tổng quan thành tích
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Xuất sắc (≥9.0)</span>
                    <span className="font-medium">
                      {percent(dashboardData.gradeDistribution?.xuatSac ?? 0)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Giỏi (8.0-8.9)</span>
                    <span className="font-medium">
                      {percent(dashboardData.gradeDistribution?.gioi ?? 0)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Khá (6.5-7.9)</span>
                    <span className="font-medium">
                      {percent(dashboardData.gradeDistribution?.kha ?? 0)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Cần cải thiện</span>
                    <span className="font-medium">
                      {percent(
                        dashboardData.gradeDistribution?.canCaiThien ?? 0
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Top Performers from Ranking API */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" /> Học sinh xuất sắc
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {rankingLoading ? (
                  <div className="text-center py-4">Đang tải...</div>
                ) : rankingError ? (
                  <div className="text-center text-red-500 py-4">
                    Lỗi tải dữ liệu xếp hạng
                  </div>
                ) : (
                  (() => {
                    const excellentStudents = (rankingData || [])
                      .filter((student) => Number(student.averageScore) > 8)
                      .slice(0, 3);
                    if (excellentStudents.length === 0) {
                      return (
                        <div className="text-center text-muted-foreground py-4">
                          Không có học sinh xuất sắc nào (điểm {">"} 8)
                        </div>
                      );
                    }
                    return (
                      <>
                        {excellentStudents.map((student, index) => (
                          <div
                            key={
                              student.studentId ??
                              `${student.studentEmail}-${index}`
                            }
                            className="flex items-center justify-between"
                          >
                            <div>
                              <p className="font-medium">
                                {student.studentName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {student.className}
                              </p>
                            </div>
                            <Badge className="bg-green-500">
                              {student.averageScore}
                            </Badge>
                          </div>
                        ))}
                        <Link href="/grades/teacher">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-2 bg-transparent"
                          >
                            <Eye className="h-4 w-4 mr-2" /> Xem tất cả
                          </Button>
                        </Link>
                      </>
                    );
                  })()
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
