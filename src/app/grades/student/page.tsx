"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TrendingUp,
  TrendingDown,
  Award,
  BookOpen,
  FileText,
  Sparkles,
} from "lucide-react";
import { useStudentResult } from "../hooks/useTeacherRanking";
import { fetchStudentDashboard } from "@/services/dashboardService";
import Loading from "@/components/loading";
interface OverallStats {
  totalAssignments: number;
  completedAssignments: number;
  averageGrade: number;
  improvement: string;
}

export default function GradesPage() {
  const [user, setUser] = useState<any>(null);
  const { data, isLoading, isError, error } = useStudentResult();
  // Chỉ giữ assignment & quiz
  // const [data?] = useState([
  //   {
  //     id: 1,
  //     subject: "Toán học",
  //     className: "Toán 12A1",
  //     assignments: [
  //       { name: "Bài tập Chương 1", grade: 8.5, maxGrade: 10, type: "assignment", date: "2024-01-15" },
  //       { name: "Kiểm tra 15 phút", grade: 9.0, maxGrade: 10, type: "quiz", date: "2024-01-18" },
  //       { name: "Bài tập Chương 2", grade: 7.5, maxGrade: 10, type: "assignment", date: "2024-01-20" }
  //     ],
  //     average: 8.33,
  //     trend: "up",
  //   },
  //   {
  //     id: 2,
  //     subject: "Vật lý",
  //     className: "Vật lý 12A1",
  //     assignments: [
  //       { name: "Bài tập Động học", grade: 7.0, maxGrade: 10, type: "assignment", date: "2024-01-16" }
  //     ],
  //     average: 7.0,
  //     trend: "up",
  //   },
  //   {
  //     id: 3,
  //     subject: "Hóa học",
  //     className: "Hóa 12A1",
  //     assignments: [
  //       { name: "Bài tập Hóa hữu cơ", grade: 9.0, maxGrade: 10, type: "assignment", date: "2024-01-17" },
  //       { name: "Kiểm tra 15 phút", grade: 8.5, maxGrade: 10, type: "quiz", date: "2024-01-23" }
  //     ],
  //     average: 8.75,
  //     trend: "stable",
  //   },
  // ])

  const [overallStats, setOverallStats] = useState<OverallStats>({
    totalAssignments: 0,
    completedAssignments: 0,
    averageGrade: 0,
    improvement: "0.3",
  });

  useEffect(() => {
    fetchStudentDashboard().then((data: any) => {
      setOverallStats({
        totalAssignments: data.totalAssignments,
        completedAssignments: data.completedAssignments,
        averageGrade: data.avgScore,
        improvement: "0.3", // mặc định
      });
    });
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const getGradeBadge = (grade: number, maxGrade: number) => {
    const percentage = (grade / maxGrade) * 100;
    if (percentage >= 90)
      return <Badge className="border-none bg-emerald-500/20 text-emerald-100">Xuất sắc</Badge>;
    if (percentage >= 80) return <Badge className="border-none bg-blue-500/20 text-blue-100">Giỏi</Badge>;
    if (percentage >= 65) return <Badge className="border-none bg-amber-500/20 text-amber-100">Khá</Badge>;
    if (percentage >= 50)
      return <Badge className="border-none bg-orange-500/20 text-orange-100">Trung bình</Badge>;
    return <Badge className="border-none bg-rose-500/20 text-rose-100">Yếu</Badge>;
  };

  const getTypeIcon = (type: string) => {
    if (type === "assignment") return <FileText className="h-4 w-4" />;
    if (type === "quiz") return <BookOpen className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const getTypeName = (type: string) => {
    if (type === "assignment") return "Bài tập";
    if (type === "quiz") return "Trắc nghiệm";
    return "Khác";
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "up")
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === "down")
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <div className="h-4 w-4" />;
  };

  if (!user) {
    return <Loading />;
  }

  const OverviewTab = () => (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl border-white/10 bg-white/5 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">
              Điểm trung bình
            </CardTitle>
            <Award className="h-4 w-4 text-blue-200" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {overallStats.averageGrade}
            </div>
            <p className="text-xs text-slate-400">
              <span className="text-emerald-300">{overallStats.improvement}</span>{" "}
              từ kỳ trước
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-white/10 bg-white/5 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">
              Bài tập hoàn thành
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-200" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {overallStats.completedAssignments}/{overallStats.totalAssignments}
            </div>
            <Progress
              value={
                (overallStats.completedAssignments /
                  overallStats.totalAssignments) *
                100
              }
              className="mt-2 h-2"
            />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-white/10 bg-white/5 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">
              Môn học
            </CardTitle>
            <BookOpen className="h-4 w-4 text-blue-200" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{data?.length}</div>
            <p className="text-xs text-slate-400">Đang theo học</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle className="text-lg">Tiến độ theo môn học</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data?.map((subject) => (
              <div
                key={subject.id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                  <div>
                    <p className="font-medium text-white">{subject.subject}</p>
                    <p className="text-sm text-slate-400">
                      {subject.assignments.length} bài
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white">{subject.average}</span>
                  {getTrendIcon(subject.trend)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle className="text-lg">Bài tập gần đây</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data
              ?.flatMap((subject) =>
                subject.assignments.map((assignment) => ({
                  ...assignment,
                  subject: subject.subject,
                }))
              )
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .slice(0, 5)
              .map((assignment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                >
                  <div className="flex items-center space-x-3">
                    {getTypeIcon(assignment.type)}
                    <div>
                      <p className="font-medium text-white">{assignment.name}</p>
                      <p className="text-sm text-slate-400">
                        {assignment.subject} • {assignment.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white">
                      {assignment.grade}/{assignment.maxGrade}
                    </span>
                    {getGradeBadge(assignment.grade, assignment.maxGrade)}
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const SubjectGradesTab = () => (
    <div className="space-y-6">
      {data?.map((subject) => (
        <Card
          key={subject.id}
          className="rounded-2xl border-white/10 bg-white/5 text-white backdrop-blur-2xl"
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl text-white">{subject.subject}</CardTitle>
                <CardDescription className="text-slate-300">
                  {subject.className}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{subject.average}</div>
                <div className="flex items-center gap-1 text-sm text-slate-400">
                  <span>Điểm TB</span>
                  {getTrendIcon(subject.trend)}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-slate-300">Bài tập</TableHead>
                  <TableHead className="text-slate-300">Loại</TableHead>
                  <TableHead className="text-slate-300">Ngày</TableHead>
                  <TableHead className="text-slate-300">Điểm</TableHead>
                  <TableHead className="text-slate-300">Đánh giá</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subject.assignments.map((assignment, index) => (
                  <TableRow key={index} className="border-white/10">
                    <TableCell className="font-medium text-white">
                      {assignment.name}
                    </TableCell>
                    <TableCell className="text-slate-200">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(assignment.type)}
                        <span className="text-sm">{getTypeName(assignment.type)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-200">{assignment.date}</TableCell>
                    <TableCell className="font-bold text-white">
                      {assignment.grade}/{assignment.maxGrade}
                    </TableCell>
                    <TableCell>{getGradeBadge(assignment.grade, assignment.maxGrade)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-indigo-600/35 via-slate-900 to-slate-950 blur-3xl" />
        <div className="absolute -right-16 top-28 h-64 w-64 rounded-full bg-blue-500/25 blur-[130px]" />
        <div className="absolute -left-14 bottom-0 h-72 w-72 rounded-full bg-violet-500/25 blur-[140px]" />
      </div>

      <Navigation />
      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <section className="rounded-[32px] border border-white/5 bg-white/5 p-8 shadow-2xl backdrop-blur-3xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.35em] text-blue-200">
                <Sparkles className="h-3.5 w-3.5" />
                Kết quả
              </span>
              <div>
                <h1 className="text-4xl font-black md:text-5xl text-white">
                  Kết quả học tập
                </h1>
                <p className="mt-2 max-w-2xl text-slate-300">
                  Theo dõi điểm số, tiến độ và chi tiết từng môn học của bạn.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Điểm TB", value: overallStats.averageGrade, detail: `${overallStats.improvement} từ kỳ trước` },
                  {
                    label: "Hoàn thành",
                    value: `${overallStats.completedAssignments}/${overallStats.totalAssignments}`,
                    detail: "Bài đã nộp",
                  },
                  { label: "Môn học", value: data?.length || 0, detail: "Đang theo học" },
                ].map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white"
                  >
                    <p className="text-sm text-slate-300">{metric.label}</p>
                    <p className="mt-1 text-2xl font-semibold">{metric.value}</p>
                    <p className="text-xs text-blue-200">{metric.detail}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-slate-200">
              <p className="text-lg font-semibold text-white">Mẹo</p>
              <p className="text-slate-300">Ưu tiên môn có xu hướng giảm để giữ ổn định điểm TB.</p>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-[32px] border border-white/5 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-2xl">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
              <TabsTrigger
                value="overview"
                className="rounded-xl text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                Tổng quan
              </TabsTrigger>
              <TabsTrigger
                value="subjects"
                className="rounded-xl text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                Theo môn học
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <OverviewTab />
            </TabsContent>

            <TabsContent value="subjects">
              <SubjectGradesTab />
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  );
}
