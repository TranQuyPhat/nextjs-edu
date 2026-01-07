"use client";

import { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
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
  Trophy,
  Award,
  BarChart3,
  ChevronDown,
  ChevronUp,
  BookOpen,
  GraduationCap,
  Medal,
} from "lucide-react";
import { getCurrentUserId } from "@/untils/utils";
import {
  useRankingByClass,
  useTopStudents,
  ClassRanking,
  TopStudent,
} from "../hooks/useRankingData";

export default function TeacherGradesPageNew() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [expandedClasses, setExpandedClasses] = useState<Set<number>>(
    new Set()
  );

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

  const {
    data: rankingByClass,
    isLoading: isLoadingRanking,
    error: errorRanking,
  } = useRankingByClass();
  const {
    data: topStudents,
    isLoading: isLoadingTop,
    error: errorTop,
  } = useTopStudents(10);

  const toggleClassExpansion = (classId: number) => {
    setExpandedClasses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(classId)) {
        newSet.delete(classId);
      } else {
        newSet.add(classId);
      }
      return newSet;
    });
  };

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

  const getGradeBadge = (grade: number) => {
    if (grade >= 9)
      return (
        <Badge className="rounded-full border border-emerald-300/50 bg-emerald-500/20 text-emerald-200 px-3 py-1">
          Xuất sắc
        </Badge>
      );
    if (grade >= 8)
      return (
        <Badge className="rounded-full border border-teal-300/50 bg-teal-500/20 text-teal-200 px-3 py-1">
          Giỏi
        </Badge>
      );
    if (grade >= 6.5)
      return (
        <Badge className="rounded-full border border-yellow-300/50 bg-yellow-500/20 text-yellow-200 px-3 py-1">
          Khá
        </Badge>
      );
    return (
      <Badge className="rounded-full border border-red-300/50 bg-red-500/20 text-red-200 px-3 py-1">
        Cần cố gắng
      </Badge>
    );
  };

  if (!teacherId) return null;
  if (isLoadingRanking || isLoadingTop)
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-slate-300">Đang tải dữ liệu...</div>
      </div>
    );
  if (errorRanking || errorTop)
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
              <h1 className="mt-4 text-4xl font-black md:text-5xl">
                Bảng xếp hạng học sinh
              </h1>
              <p className="mt-3 max-w-2xl text-slate-300">
                Theo dõi và đánh giá sự tiến bộ của học sinh. Phân tích thành
                tích và xu hướng học tập một cách toàn diện.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <Tabs defaultValue="top-students" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10 rounded-2xl p-1 h-auto">
              <TabsTrigger
                value="top-students"
                className="flex items-center gap-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-300 rounded-xl h-12 transition-all"
              >
                <Trophy className="h-4 w-4" />
                Top 10 xuất sắc
              </TabsTrigger>
              <TabsTrigger
                value="by-class"
                className="flex items-center gap-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-300 rounded-xl h-12 transition-all"
              >
                <GraduationCap className="h-4 w-4" />
                Xếp hạng theo lớp
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: TOP 10 STUDENTS */}
            <TabsContent value="top-students" className="space-y-6">
              <Card className="rounded-[28px] border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-2xl">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Medal className="h-8 w-8 text-yellow-400" />
                    <div>
                      <CardTitle className="text-white text-2xl">
                        Top 10 học sinh xuất sắc nhất
                      </CardTitle>
                      <CardDescription className="text-slate-400">
                        Danh sách sinh viên có điểm cao nhất trong tất cả các lớp
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/10 hover:bg-white/5">
                          <TableHead className="w-16 text-slate-300">
                            Hạng
                          </TableHead>
                          <TableHead className="text-slate-300">
                            Học sinh
                          </TableHead>
                          <TableHead className="text-slate-300">
                            Lớp học
                          </TableHead>
                          <TableHead className="text-slate-300">
                            Môn học
                          </TableHead>
                          <TableHead className="text-center text-slate-300">
                            Điểm cao nhất
                          </TableHead>
                          <TableHead className="text-center text-slate-300">
                            Đánh giá
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {topStudents && topStudents.length > 0 ? (
                          topStudents.map((student, index) => (
                            <TableRow
                              key={student.studentId}
                              className="border-white/10 hover:bg-white/5 transition"
                            >
                              <TableCell className="text-center">
                                {getRankIcon(index + 1)}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-10 w-10 border-2 border-white/20">
                                    <AvatarFallback className="bg-emerald-500/20 text-emerald-200 font-semibold">
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
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <BookOpen className="h-4 w-4 text-teal-400" />
                                  <span className="text-slate-200">
                                    {student.className}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-indigo-500/20 text-indigo-200 border-indigo-500/30">
                                  {student.subjectName}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center">
                                <span
                                  className={`text-xl font-bold ${
                                    student.bestScore >= 9
                                      ? "text-emerald-400"
                                      : student.bestScore >= 8
                                      ? "text-teal-400"
                                      : student.bestScore >= 6.5
                                      ? "text-yellow-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  {student.bestScore.toFixed(1)}
                                </span>
                              </TableCell>
                              <TableCell className="text-center">
                                {getGradeBadge(student.bestScore)}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="text-center text-slate-400 py-8"
                            >
                              Chưa có dữ liệu học sinh xuất sắc
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 2: BY CLASS */}
            <TabsContent value="by-class" className="space-y-6">
              {rankingByClass && rankingByClass.length > 0 ? (
                rankingByClass.map((classData) => {
                  const isExpanded = expandedClasses.has(classData.classId);
                  const displayedStudents = isExpanded
                    ? classData.students
                    : classData.students.slice(0, 10);

                  return (
                    <Card
                      key={classData.classId}
                      className="rounded-[28px] border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-2xl"
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                              <GraduationCap className="h-6 w-6 text-emerald-400" />
                            </div>
                            <div>
                              <CardTitle className="text-white text-xl">
                                {classData.className}
                              </CardTitle>
                              <CardDescription className="text-slate-400">
                                {classData.subjectName} • {classData.students.length} học sinh
                              </CardDescription>
                            </div>
                          </div>
                          <Badge className="bg-teal-500/20 text-teal-200 border-teal-500/30 px-4 py-2">
                            ID: {classData.classId}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-white/10 hover:bg-white/5">
                                <TableHead className="w-16 text-slate-300">
                                  Hạng
                                </TableHead>
                                <TableHead className="text-slate-300">
                                  Học sinh
                                </TableHead>
                                <TableHead className="text-center text-slate-300">
                                  Điểm TB
                                </TableHead>
                                <TableHead className="text-center text-slate-300">
                                  Đánh giá
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {displayedStudents.map((student, index) => (
                                <TableRow
                                  key={student.studentId}
                                  className="border-white/10 hover:bg-white/5 transition"
                                >
                                  <TableCell className="text-center">
                                    {getRankIcon(index + 1)}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center space-x-3">
                                      <Avatar className="h-9 w-9 border border-white/20">
                                        <AvatarFallback className="bg-emerald-500/20 text-emerald-200 text-sm">
                                          {student.studentName?.charAt(0)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <div className="font-medium text-white">
                                          {student.studentName}
                                        </div>
                                        <div className="text-xs text-slate-400">
                                          {student.studentEmail}
                                        </div>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <span
                                      className={`text-lg font-bold ${
                                        student.averageScore >= 9
                                          ? "text-emerald-400"
                                          : student.averageScore >= 8
                                          ? "text-teal-400"
                                          : student.averageScore >= 6.5
                                          ? "text-yellow-400"
                                          : "text-red-400"
                                      }`}
                                    >
                                      {student.averageScore.toFixed(1)}
                                    </span>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {getGradeBadge(student.averageScore)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>

                        {classData.students.length > 10 && (
                          <div className="mt-4 flex justify-center">
                            <Button
                              onClick={() =>
                                toggleClassExpansion(classData.classId)
                              }
                              variant="outline"
                              className="bg-white/5 border-white/10 text-white hover:bg-white/10 transition"
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="h-4 w-4 mr-2" />
                                  Thu gọn
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="h-4 w-4 mr-2" />
                                  Xem thêm {classData.students.length - 10} học sinh
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <Card className="rounded-[28px] border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-2xl">
                  <CardContent className="py-12 text-center">
                    <GraduationCap className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg">
                      Chưa có dữ liệu xếp hạng theo lớp
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  );
}
