"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Users,
  TrendingUp,
  TrendingDown,
  Trophy,
  Award,
  BookOpen,
  Target,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { getCurrentUserId } from "@/untils/utils";
import { useTeacherRanking } from "../hooks/useTeacherRanking";

type UiStudent = {
  id: string | number;
  studentName: string;
  studentEmail: string;
  className: string;
  classId?: number;
  avgGrade: number;
  trend: "up" | "down" | "stable";
  completionRate: number;
  subjects: {
    math?: number;
    literature?: number;
    english?: number;
  };
};

export default function TeacherGradesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");

  const teacherId = getCurrentUserId();

  useEffect(() => {
    if (!teacherId) {
      router.push("/auth/login");
      return;
    }
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
    else setUser({ id: teacherId });
  }, [router, teacherId]);

  const { data: ranking, isLoading, error } = useTeacherRanking();

  const apiStudents: UiStudent[] = useMemo(() => {
    if (!ranking) return [];

    // API sample:
    // [
    //   { classId, className, studentName, studentEmail, averageScore }
    // ]
    // Ta sort giảm dần theo averageScore để có "hạng"
    const sorted = [...ranking].sort((a, b) => b.averageScore - a.averageScore);

    // Map sang cấu trúc UI; trend/completionRate/subjects là dữ liệu chưa có -> mặc định.
    return sorted.map((row, idx) => ({
      id: row.studentId ?? `${row.studentEmail}-${idx}`, // fallback nếu backend chưa có studentId
      studentName: row.studentName ?? row.studentName ?? "Unknown",
      studentEmail: row.studentEmail ?? row.studentEmail ?? "",
      className: row.className,
      classId: (row as any).classId, // backend có classId -> giữ
      avgGrade: Number(row.averageScore.toFixed(1)), // API của bạn trả 0..10 hay 0..?? Nếu 0..10 thì bỏ *10
      trend: "stable",
      completionRate: 85,
      subjects: {},
    }));
  }, [ranking]);

  const classesFromApi = useMemo(() => {
    if (!apiStudents.length) {
      return [{ id: "all", name: "Tất cả lớp", avgGrade: 0, studentCount: 0 }];
    }
    // Group theo classId/className
    const byClass = new Map<
      string,
      { name: string; total: number; sum: number }
    >();

    apiStudents.forEach((s) => {
      const key = s.classId ? String(s.classId) : s.className;
      if (!byClass.has(key)) {
        byClass.set(key, { name: s.className, total: 0, sum: 0 });
      }
      const entry = byClass.get(key)!;
      entry.total += 1;
      entry.sum += s.avgGrade;
    });

    const list = Array.from(byClass.entries()).map(([id, v]) => ({
      id,
      name: v.name,
      avgGrade: Number((v.sum / v.total).toFixed(1)),
      studentCount: v.total,
    }));
    // prepend "all"
    return [
      {
        id: "all",
        name: "Tất cả lớp",
        avgGrade: 0,
        studentCount: apiStudents.length,
      },
      ...list,
    ];
  }, [apiStudents]);

  // Hàm helper (giữ nguyên / có chỉnh nhẹ cho filter động)
  const getFilteredStudents = () => {
    const base = apiStudents.length ? apiStudents : []; // nếu chưa có data thì mảng rỗng
    let filtered = base;

    if (selectedClass !== "all") {
      filtered = filtered.filter((s) => {
        // ưu tiên so classId nếu có, không thì so className
        const key = s.classId ? String(s.classId) : s.className;
        return key === selectedClass;
      });
    }

    // Đang chưa lọc theo môn vì API chưa trả subjects -> giữ nguyên
    return filtered.sort((a, b) => b.avgGrade - a.avgGrade);
  };

  // Các thống kê giữ nguyên nhưng dựa trên dữ liệu mới
  const filteredStudents = getFilteredStudents();
  console.log("filteredStudents :", filteredStudents);

  const distribution = useMemo(() => {
    const excellent = filteredStudents.filter((s) => s.avgGrade >= 9).length;
    const good = filteredStudents.filter(
      (s) => s.avgGrade >= 8 && s.avgGrade < 9
    ).length;
    const average = filteredStudents.filter(
      (s) => s.avgGrade >= 6.5 && s.avgGrade < 8
    ).length;
    const needsImprovement = filteredStudents.filter(
      (s) => s.avgGrade < 6.5
    ).length;
    return { excellent, good, average, needsImprovement };
  }, [filteredStudents]);

  // Vì API chưa trả điểm theo môn -> ta giữ nguyên cách tính cũ nhưng sẽ trả rỗng
  const subjectAverages: any = useMemo(() => {
    if (!filteredStudents.length) return {};
    // Không có dữ liệu theo môn -> tạm ẩn/để undefined
    return {
      math: undefined,
      literature: undefined,
      english: undefined,
    };
  }, [filteredStudents]);

  const trendStats = useMemo(() => {
    return {
      improving: filteredStudents.filter((s) => s.trend === "up").length,
      stable: filteredStudents.filter((s) => s.trend === "stable").length,
      declining: filteredStudents.filter((s) => s.trend === "down").length,
    };
  }, [filteredStudents]);

  const overallAverage =
    filteredStudents.length > 0
      ? (
          filteredStudents.reduce((sum, s) => sum + s.avgGrade, 0) /
          filteredStudents.length
        ).toFixed(1)
      : 0;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-400" />;
      case 2:
        return <Award className="h-5 w-5 text-slate-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-500" />;
      default:
        return <span className="text-slate-400 font-bold">#{rank}</span>;
    }
  };

  const getTrendIcon = (trend: UiStudent["trend"]) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-emerald-400" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      default:
        return <Trophy className="h-4 w-4 text-slate-400" />;
    }
  };

  const getGradeBadge = (grade: number) => {
    if (grade >= 9) return <Badge className="rounded-full border border-emerald-300/50 bg-emerald-500/20 text-emerald-200 px-3 py-1">Xuất sắc</Badge>;
    if (grade >= 8) return <Badge className="rounded-full border border-teal-300/50 bg-teal-500/20 text-teal-200 px-3 py-1">Giỏi</Badge>;
    if (grade >= 6.5) return <Badge className="rounded-full border border-yellow-300/50 bg-yellow-500/20 text-yellow-200 px-3 py-1">Khá</Badge>;
    return <Badge className="rounded-full border border-red-300/50 bg-red-500/20 text-red-200 px-3 py-1">Cần cố gắng</Badge>;
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 9) return "text-green-600";
    if (grade >= 8) return "text-blue-600";
    if (grade >= 6.5) return "text-yellow-600";
    return "text-red-600";
  };

  if (!teacherId) return null; // đã redirect ở useEffect
  if (isLoading) return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="text-slate-300">Đang tải xếp hạng...</div>
    </div>
  );
  if (error)
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-red-400">Lỗi tải dữ liệu xếp hạng</div>
      </div>
    );

  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-emerald-600/40 via-slate-900 to-slate-950 blur-3xl" />
        <div className="absolute -right-24 top-24 h-64 w-64 rounded-full bg-teal-500/30 blur-[140px]" />
        <div className="absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-indigo-500/30 blur-[150px]" />
        <div className="absolute inset-0 opacity-30">
          {[...Array(30)].map((_, index) => (
            <span
              key={index}
              className="absolute h-1 w-1 rounded-full bg-cyan-200/40"
              style={{
                left: `${(index * 37) % 100}%`,
                top: `${(index * 21) % 100}%`,
                animation: `pulse 6s ease-in-out ${index * 0.3}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <Navigation />
      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <section className="rounded-[32px] border border-white/5 bg-white/5 p-8 shadow-2xl backdrop-blur-3xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.4em] text-emerald-200">
                <BarChart3 className="h-3.5 w-3.5" />
                Ranking System
              </span>
              <h1 className="mt-4 text-4xl font-black md:text-5xl">Bảng xếp hạng học sinh</h1>
              <p className="mt-3 max-w-2xl text-slate-300">
                Theo dõi và đánh giá sự tiến bộ của học sinh. Phân tích thành tích và xu hướng học tập một cách toàn diện.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-48 bg-white/5 text-white border-white/10">
                  <SelectValue placeholder="Chọn lớp" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10 text-white">
                  {classesFromApi.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
              >
                <SelectTrigger className="w-48 bg-white/5 text-white border-white/10">
                  <SelectValue placeholder="Chọn môn học" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10 text-white">
                  <SelectItem value="all">Tất cả môn</SelectItem>
                  <SelectItem value="math">Toán học</SelectItem>
                  <SelectItem value="literature">Ngữ văn</SelectItem>
                  <SelectItem value="english">Tiếng Anh</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10 rounded-2xl p-1 h-auto">
              <TabsTrigger 
                value="overview"
                className="flex items-center gap-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-300 rounded-xl h-12 transition-all"
              >
                <BarChart3 className="h-4 w-4" />
                Tổng quan
              </TabsTrigger>
              <TabsTrigger 
                value="ranking"
                className="flex items-center gap-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-300 rounded-xl h-12 transition-all"
              >
                <Trophy className="h-4 w-4" />
                Xếp hạng
              </TabsTrigger>
              <TabsTrigger 
                value="analysis"
                className="flex items-center gap-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-300 rounded-xl h-12 transition-all"
              >
                <Target className="h-4 w-4" />
                Phân tích
              </TabsTrigger>
            </TabsList>

            {/* ======= OVERVIEW ======= */}
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <Card className="rounded-[28px] border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-2xl transition hover:-translate-y-1 hover:bg-white/10">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">
                      Tổng học sinh
                    </CardTitle>
                    <Users className="h-4 w-4 text-emerald-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      {filteredStudents.length}
                    </div>
                    <p className="text-xs text-slate-400">
                      Đang theo dõi
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-[28px] border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-2xl transition hover:-translate-y-1 hover:bg-white/10">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">
                      Điểm TB chung
                    </CardTitle>
                    <Target className="h-4 w-4 text-emerald-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{overallAverage}</div>
                    <p className="text-xs text-slate-400">
                      Trên thang điểm 10
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-[28px] border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-2xl transition hover:-translate-y-1 hover:bg-white/10">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">
                      Học sinh giỏi
                    </CardTitle>
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-emerald-400">
                      {distribution.excellent + distribution.good}
                    </div>
                    <p className="text-xs text-slate-400">≥ 8.0 điểm</p>
                  </CardContent>
                </Card>

                <Card className="rounded-[28px] border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-2xl transition hover:-translate-y-1 hover:bg-white/10">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">
                      Tiến bộ
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-emerald-400">
                      {trendStats.improving}
                    </div>
                    <p className="text-xs text-slate-400">
                      Học sinh cải thiện
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-[28px] border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-2xl transition hover:-translate-y-1 hover:bg-white/10">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">
                      Cần chú ý
                    </CardTitle>
                    <AlertCircle className="h-4 w-4 text-red-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-400">
                      {distribution.needsImprovement}
                    </div>
                    <p className="text-xs text-slate-400">
                      &lt;6.5 điểm
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Top 3 Students */}
              <Card className="rounded-[28px] border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-2xl">
                <CardHeader>
                  <CardTitle className="text-white">Top 3 học sinh xuất sắc</CardTitle>
                  <CardDescription className="text-slate-400">
                    Những học sinh có thành tích cao nhất
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const excellentStudents = filteredStudents
                      .filter((student) => student.avgGrade > 8)
                      .slice(0, 3);
                    if (excellentStudents.length === 0) {
                      return (
                        <div className="text-center text-slate-400 py-4">
                          Không có học sinh xuất sắc nào (điểm {">"} 8)
                        </div>
                      );
                    }
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {excellentStudents.map((student, index) => (
                          <div
                            key={student.id}
                            className="text-center p-6 bg-white/5 rounded-[20px] border border-white/10 backdrop-blur-xl transition hover:bg-white/10 hover:-translate-y-1"
                          >
                            <div className="flex justify-center mb-3">
                              {getRankIcon(index + 1)}
                            </div>
                            <Avatar className="h-16 w-16 mx-auto mb-3 border-2 border-emerald-500/50">
                              <AvatarFallback className="text-lg bg-emerald-500/20 text-emerald-200">
                                {student?.studentName?.charAt(0) ||
                                  student?.studentName?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <h3 className="font-medium text-white">
                              {student?.studentName || student?.studentName}
                            </h3>
                            <p className="text-sm text-slate-400 mb-2">
                              {student.className}
                            </p>
                            <div className="flex items-center justify-center space-x-2">
                              <span
                                className={`text-xl font-bold ${
                                  student.avgGrade >= 9
                                    ? "text-emerald-400"
                                    : student.avgGrade >= 8
                                    ? "text-teal-400"
                                    : "text-yellow-400"
                                }`}
                              >
                                {student.avgGrade}
                              </span>
                              {getTrendIcon(student.trend)}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>

              {/* Class Statistics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="rounded-[28px] border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-2xl">
                  <CardHeader>
                    <CardTitle className="text-white">Phân bố điểm số</CardTitle>
                    <CardDescription className="text-slate-400">
                      Số lượng học sinh theo từng mức điểm
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {/* Xuất sắc */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-emerald-400" />
                          <span className="text-sm text-slate-300">Xuất sắc (9.0-10)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-white/10 rounded-full h-2">
                            <div
                              className="bg-emerald-500 h-2 rounded-full"
                              style={{
                                width: `${
                                  filteredStudents.length
                                    ? (distribution.excellent /
                                        filteredStudents.length) *
                                      100
                                    : 0
                                }%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8 text-white">
                            {distribution.excellent}
                          </span>
                        </div>
                      </div>

                      {/* Giỏi */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Target className="h-4 w-4 text-teal-400" />
                          <span className="text-sm text-slate-300">Giỏi (8.0-8.9)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-white/10 rounded-full h-2">
                            <div
                              className="bg-teal-500 h-2 rounded-full"
                              style={{
                                width: `${
                                  filteredStudents.length
                                    ? (distribution.good /
                                        filteredStudents.length) *
                                      100
                                    : 0
                                }%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8 text-white">
                            {distribution.good}
                          </span>
                        </div>
                      </div>

                      {/* Khá */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <BookOpen className="h-4 w-4 text-yellow-400" />
                          <span className="text-sm text-slate-300">Khá (6.5-7.9)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-white/10 rounded-full h-2">
                            <div
                              className="bg-yellow-500 h-2 rounded-full"
                              style={{
                                width: `${
                                  filteredStudents.length
                                    ? (distribution.average /
                                        filteredStudents.length) *
                                      100
                                    : 0
                                }%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8 text-white">
                            {distribution.average}
                          </span>
                        </div>
                      </div>

                      {/* Cần cố gắng */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="h-4 w-4 text-red-400" />
                          <span className="text-sm text-slate-300">Cần cố gắng (&lt;6.5)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-white/10 rounded-full h-2">
                            <div
                              className="bg-red-500 h-2 rounded-full"
                              style={{
                                width: `${
                                  filteredStudents.length
                                    ? (distribution.needsImprovement /
                                        filteredStudents.length) *
                                      100
                                    : 0
                                }%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8 text-white">
                            {distribution.needsImprovement}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Thống kê theo lớp (từ API) */}
                <Card className="rounded-[28px] border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-2xl">
                  <CardHeader>
                    <CardTitle className="text-white">Thống kê theo lớp</CardTitle>
                    <CardDescription className="text-slate-400">
                      Điểm trung bình từng lớp học
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {classesFromApi
                        .filter((c) => c.id !== "all")
                        .map((cls) => (
                          <div
                            key={cls.id}
                            className="flex items-center justify-between p-4 bg-white/5 rounded-[16px] border border-white/10 backdrop-blur-xl transition hover:bg-white/10"
                          >
                            <div>
                              <h4 className="font-medium text-white">{cls.name}</h4>
                              <p className="text-sm text-slate-400">
                                {cls.studentCount} học sinh
                              </p>
                            </div>
                            <div className="text-right">
                              <div
                                className={`text-lg font-bold ${
                                  cls.avgGrade >= 9
                                    ? "text-emerald-400"
                                    : cls.avgGrade >= 8
                                    ? "text-teal-400"
                                    : cls.avgGrade >= 6.5
                                    ? "text-yellow-400"
                                    : "text-red-400"
                                }`}
                              >
                                {cls.avgGrade}
                              </div>
                              <p className="text-xs text-slate-400">Điểm TB</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ======= RANKING ======= */}
            <TabsContent value="ranking" className="space-y-6">
              <Card className="rounded-[28px] border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-2xl">
                <CardHeader>
                  <CardTitle className="text-white">Bảng xếp hạng chi tiết</CardTitle>
                  <CardDescription className="text-slate-400">
                    Danh sách tất cả học sinh được sắp xếp theo điểm trung bình
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/10 hover:bg-white/5">
                          <TableHead className="w-16 text-slate-300">Hạng</TableHead>
                          <TableHead className="text-slate-300">Học sinh</TableHead>
                          <TableHead className="text-slate-300">Lớp</TableHead>
                          <TableHead className="text-center text-slate-300">Điểm TB</TableHead>
                          <TableHead className="text-center text-slate-300">Xu hướng</TableHead>
                          <TableHead className="text-center text-slate-300">
                            Hoàn thành
                          </TableHead>
                          <TableHead className="text-center text-slate-300">Đánh giá</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStudents.map((student, index) => (
                          <TableRow key={student.id} className="border-white/10 hover:bg-white/5">
                            <TableCell className="text-center">
                              {getRankIcon(index + 1)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8 border border-white/20">
                                  <AvatarFallback className="bg-emerald-500/20 text-emerald-200">
                                    {student.studentName?.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-white">
                                    {student.studentName}
                                  </div>
                                  <div className="text-sm text-slate-400">
                                    {student.studentEmail}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-slate-300">{student.className}</TableCell>
                            <TableCell className="text-center">
                              <span
                                className={`text-lg font-bold ${
                                  student.avgGrade >= 9
                                    ? "text-emerald-400"
                                    : student.avgGrade >= 8
                                    ? "text-teal-400"
                                    : student.avgGrade >= 6.5
                                    ? "text-yellow-400"
                                    : "text-red-400"
                                }`}
                              >
                                {student.avgGrade}
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              {getTrendIcon(student.trend)}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center space-x-2">
                                <div className="w-16 bg-white/10 rounded-full h-2">
                                  <div
                                    className="bg-emerald-500 h-2 rounded-full"
                                    style={{
                                      width: `${student.completionRate}%`,
                                    }}
                                  />
                                </div>
                                <span className="text-sm text-slate-300">
                                  {student.completionRate}%
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              {getGradeBadge(student.avgGrade)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ======= ANALYSIS ======= */}
            <TabsContent value="analysis" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="rounded-[28px] border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-2xl">
                  <CardHeader>
                    <CardTitle className="text-white">Xu hướng học tập</CardTitle>
                    <CardDescription className="text-slate-400">
                      Phân tích sự tiến bộ của học sinh
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-emerald-500/10 rounded-[16px] border border-emerald-500/20 backdrop-blur-xl">
                      <div className="flex items-center space-x-3">
                        <TrendingUp className="h-8 w-8 text-emerald-400" />
                        <div>
                          <h4 className="font-medium text-white">
                            Tiến bộ
                          </h4>
                          <p className="text-sm text-emerald-300">
                            Điểm số cải thiện
                          </p>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-emerald-400">
                        {trendStats.improving}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-[16px] border border-white/10 backdrop-blur-xl">
                      <div className="flex items-center space-x-3">
                        <Trophy className="h-8 w-8 text-slate-400" />
                        <div>
                          <h4 className="font-medium text-white">Ổn định</h4>
                          <p className="text-sm text-slate-400">
                            Duy trì mức độ hiện tại
                          </p>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-slate-300">
                        {trendStats.stable}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-[16px] border border-red-500/20 backdrop-blur-xl">
                      <div className="flex items-center space-x-3">
                        <TrendingDown className="h-8 w-8 text-red-400" />
                        <div>
                          <h4 className="font-medium text-white">
                            Cần chú ý
                          </h4>
                          <p className="text-sm text-red-300">Điểm số giảm</p>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-red-400">
                        {trendStats.declining}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Thành tích theo môn – chưa có dữ liệu chi tiết -> giữ bố cục, ẩn số nếu undefined */}
                <Card className="rounded-[28px] border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-2xl">
                  <CardHeader>
                    <CardTitle className="text-white">Thành tích theo môn</CardTitle>
                    <CardDescription className="text-slate-400">
                      Điểm trung bình từng môn học
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {["math", "literature", "english"].map((sub) => {
                        const label =
                          sub === "math"
                            ? "Toán học"
                            : sub === "literature"
                            ? "Ngữ văn"
                            : "Tiếng Anh";
                        const val = subjectAverages?.[sub];
                        return (
                          <div
                            key={sub}
                            className="flex items-center justify-between p-3 bg-white/5 rounded-[12px] border border-white/10"
                          >
                            <span className="font-medium text-white">{label}</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-24 bg-white/10 rounded-full h-3">
                                <div
                                  className="bg-emerald-500 h-3 rounded-full"
                                  style={{
                                    width: val ? `${(val / 10) * 100}%` : "0%",
                                  }}
                                />
                              </div>
                              <span
                                className={`font-bold ${
                                  val
                                    ? val >= 9
                                      ? "text-emerald-400"
                                      : val >= 8
                                      ? "text-teal-400"
                                      : val >= 6.5
                                      ? "text-yellow-400"
                                      : "text-red-400"
                                    : "text-slate-500"
                                }`}
                              >
                                {val ?? "--"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Analysis */}
              <Card className="rounded-[28px] border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-2xl">
                <CardHeader>
                  <CardTitle className="text-white">Phân tích chi tiết</CardTitle>
                  <CardDescription className="text-slate-400">
                    Thống kê toàn diện về thành tích học tập
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center p-6 bg-emerald-500/10 rounded-[20px] border border-emerald-500/20 backdrop-blur-xl transition hover:bg-emerald-500/15">
                      <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-emerald-400">
                        {distribution.excellent}
                      </div>
                      <p className="text-sm text-emerald-300">Xuất sắc (9.0+)</p>
                    </div>
                    <div className="text-center p-6 bg-teal-500/10 rounded-[20px] border border-teal-500/20 backdrop-blur-xl transition hover:bg-teal-500/15">
                      <Target className="h-8 w-8 text-teal-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-teal-400">
                        {distribution.good}
                      </div>
                      <p className="text-sm text-teal-300">Giỏi (8.0-8.9)</p>
                    </div>
                    <div className="text-center p-6 bg-yellow-500/10 rounded-[20px] border border-yellow-500/20 backdrop-blur-xl transition hover:bg-yellow-500/15">
                      <BookOpen className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-yellow-400">
                        {distribution.average}
                      </div>
                      <p className="text-sm text-yellow-300">Khá (6.5-7.9)</p>
                    </div>
                    <div className="text-center p-6 bg-red-500/10 rounded-[20px] border border-red-500/20 backdrop-blur-xl transition hover:bg-red-500/15">
                      <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-red-400">
                        {distribution.needsImprovement}
                      </div>
                      <p className="text-sm text-red-300">
                        Cần cố gắng (&lt;6.5)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  );
}
