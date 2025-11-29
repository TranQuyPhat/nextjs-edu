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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Clock,
  Users,
  CheckCircle,
  Edit,
  Eye,
  Trash2,
  Search,
  Filter,
  Calendar,
  BarChart3,
  ChevronDown,
  Loader2,
  Sparkles,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useDeleteQuiz } from "../hook/quiz-hooks";
import { useGroupedQuizzes, useQuizzesByClassInfinite } from "../hooks";
import { TeacherQuizSkeleton } from "../components/TeacherQuizSkeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { classDTO, QuizDTO } from "../api";

type QuizStatus = "UPCOMING" | "OPEN" | "CLOSED";

interface ExpandedClassState {
  [classId: number]: boolean;
}

export default function TeacherQuizzesPage() {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteQuizMutation = useDeleteQuiz(deleteId ?? 0);

  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<QuizStatus>("OPEN");
  const [expandedClasses, setExpandedClasses] = useState<ExpandedClassState>(
    {}
  );

  // Stores pagination queries for each class
  const [classPaginationQueries, setClassPaginationQueries] = useState<{
    [classId: number]: any;
  }>({});

  const {
    data: groupedData,
    isLoading,
    error,
    refetch,
  } = useGroupedQuizzes(activeTab);

  const handleDeleteQuiz = async (id: number) => {
    setDeleteId(id);
    await deleteQuizMutation.mutateAsync();
    setDeleteId(null);
    refetch(); // Refresh data sau khi xóa
  };

  const getStatusBadge = (status: string) => {
    switch (activeTab) {
      case "UPCOMING":
        return (
          <Badge className="rounded-full border border-amber-300/50 bg-amber-500/20 text-amber-200 px-3 py-1">
            <Clock className="h-3 w-3 mr-1" />
            Sắp diễn ra
          </Badge>
        );
      case "OPEN":
        return (
          <Badge className="rounded-full border border-emerald-300/50 bg-emerald-500/20 text-emerald-200 px-3 py-1">
            <Clock className="h-3 w-3 mr-1" />
            Đang mở
          </Badge>
        );
      case "CLOSED":
        return (
          <Badge className="rounded-full border border-red-300/50 bg-red-500/20 text-red-200 px-3 py-1">
            <Clock className="h-3 w-3 mr-1" />
            Đã đóng
          </Badge>
        );
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleXemKetQua = (quizId: number) => {
    router.push(`teacher/quizResult/${quizId}`);
  };

  const renderQuizCard = (quiz: QuizDTO) => {
    return (
      <Card
        key={quiz.id}
        className="rounded-[28px] border border-white/10 bg-white/5 text-white transition hover:-translate-y-1 hover:bg-white/10 shadow-xl backdrop-blur-2xl"
      >
        <div className="p-6">
          <div className="mb-4">
            <h3 className="font-semibold text-white mb-2 line-clamp-2 text-lg">
              {quiz.title}
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">{quiz.subject}</span>
              {getStatusBadge(quiz.status)}
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-slate-300">
              <Clock className="h-4 w-4 mr-2 text-emerald-200" />
              <span>
                {quiz.timeLimit} phút • {quiz.totalQuestion} câu
              </span>
            </div>
            <div className="flex items-center text-sm text-slate-300">
              <Users className="h-4 w-4 mr-2 text-emerald-200" />
              <span>
                {quiz.studentsSubmitted}/{quiz.totalStudents} đã làm
              </span>
            </div>
            <div className="text-sm text-slate-400">
              {activeTab === "UPCOMING"
                ? `Bắt đầu: ${formatDateTime(quiz.startDate)}`
                : `Hết hạn: ${formatDateTime(quiz.endDate)}`}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors duration-200"
              onClick={() => handleXemKetQua(quiz.id)}
            >
              <Eye className="h-4 w-4 mr-1" />
              Kết quả
            </Button>

            {activeTab === "UPCOMING" && (
              <>
                <Button
                  size="sm"
                  className="rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors duration-200"
                  onClick={() =>
                    router.push(`teacher/preview?mode=edit&id=${quiz.id}`)
                  }
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  className="rounded-xl border border-red-500/30 bg-red-500/20 text-red-200 hover:bg-red-500/30 transition-colors duration-200"
                  onClick={() => {
                    setDeleteId(quiz.id);
                    setShowDeleteConfirm(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>
    );
  };

  const ClassSection = ({
    classData,
    status,
  }: {
    classData: classDTO;
    status: QuizStatus;
  }) => {
    const quizzes = classData.quizzes ?? [];

    // Initialize pagination query for this class if needed
    const classQuery = classPaginationQueries[classData.classId];

    const {
      data: paginatedData,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      refetch: refetchClassQuizzes,
    } = useQuizzesByClassInfinite(classData.classId, status, {
      enabled: !!classQuery, // Only enabled when we need to fetch more data
    });

    const handleLoadMoreQuizzes = () => {
      // Initialize the query for this class
      if (!classQuery) {
        setClassPaginationQueries((prev) => ({
          ...prev,
          [classData.classId]: true,
        }));
        // Need to wait for next render cycle for the query to be enabled
        setTimeout(() => {
          fetchNextPage();
        }, 0);
      } else {
        // Trigger fetch next page
        fetchNextPage();
      }
    };

    const allQuizzes = [
      ...quizzes,
      ...(paginatedData?.pages?.flatMap((page) => page.content) || []),
    ];

    const uniqueQuizzes = allQuizzes.filter(
      (quiz, index, self) => index === self.findIndex((q) => q.id === quiz.id)
    );

    const totalQuizzes = classData.quizTotal;
    const currentCount = uniqueQuizzes.length;
    const remainingCount = Math.max(0, totalQuizzes - currentCount);

    const canLoadMore = currentCount < totalQuizzes;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold text-white">
              Lớp {classData.className}
            </h2>
            <Badge className="rounded-full border border-white/20 bg-white/10 text-emerald-200 px-3 py-1">
              {totalQuizzes} bài kiểm tra
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {uniqueQuizzes.map((quiz) => renderQuizCard(quiz))}
        </div>

        {canLoadMore && (
          <div className="flex justify-center items-center gap-4 mt-6 p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
            {remainingCount > 0 && (
              <span className="text-sm text-slate-300">
                Còn {remainingCount} bài kiểm tra khác
              </span>
            )}

            <Button
              variant="outline"
              onClick={handleLoadMoreQuizzes}
              disabled={isFetchingNextPage}
              className="min-w-[120px] rounded-xl border-white/30 text-white hover:bg-white/10"
            >
              {isFetchingNextPage ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang tải...
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-2" />
                  Xem thêm
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    );
  };

  // Filtered classes based on search and filters
  const filteredClasses =
    groupedData?.classes?.filter((classData: classDTO) => {
      if (selectedClass !== "all" && classData.className !== selectedClass) {
        return false;
      }

      // Filter by search term within quizzes
      if (searchTerm) {
        return classData.quizzes.some(
          (quiz) =>
            quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quiz.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            selectedSubject === "all" ||
            quiz.subject === selectedSubject
        );
      }

      return true;
    }) || [];

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
                <FileText className="h-3.5 w-3.5" />
                Quiz Management
              </span>
              <h1 className="mt-4 text-4xl font-black md:text-5xl">Quản lý trắc nghiệm</h1>
              <p className="mt-3 max-w-2xl text-slate-300">
                Tạo, điều phối và giám sát mọi bài kiểm tra trắc nghiệm trong một giao diện thống nhất. Theo dõi kết quả và tiến độ học sinh realtime.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="teacher/createQuiz">
                <Button className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-5 text-base font-semibold shadow-emerald-500/40 hover:from-emerald-600 hover:to-teal-600">
                  <Plus className="mr-2 h-4 w-4" />
                  Tạo bài kiểm tra mới
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <Card className="rounded-[28px] border-white/10 bg-slate-900/70 text-white shadow-xl backdrop-blur-2xl">
            <CardHeader className="border-b border-white/5 pb-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-2xl font-semibold">Tìm kiếm & bộ lọc</CardTitle>
                  <CardDescription className="text-slate-400">
                    Lọc nhanh theo tên bài kiểm tra, môn học hoặc lớp học.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex flex-col gap-3 md:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Tìm kiếm theo tên bài kiểm tra..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/5 text-white placeholder:text-slate-500 border-white/10"
                  />
                </div>

                <div className="min-w-[200px]">
                  <Select
                    value={selectedSubject}
                    onValueChange={setSelectedSubject}
                  >
                    <SelectTrigger className="bg-white/5 text-white border-white/10">
                      <SelectValue placeholder="Chọn môn học" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                      <SelectItem value="all">Tất cả môn học</SelectItem>
                      {groupedData?.classes?.map((classData, idx) => (
                        <SelectItem
                          key={`${classData.classId}-${idx}`}
                          value={classData.subjectName}
                        >
                          {classData.subjectName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="min-w-[200px]">
                  <Select
                    value={selectedClass}
                    onValueChange={setSelectedClass}
                  >
                    <SelectTrigger className="bg-white/5 text-white border-white/10">
                      <SelectValue placeholder="Chọn lớp học" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                      <SelectItem value="all">Tất cả lớp học</SelectItem>
                      {groupedData?.classes?.map((classData: classDTO) => (
                        <SelectItem
                          key={classData.classId}
                          value={classData.className}
                        >
                          {classData.className}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-10">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as QuizStatus)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10 rounded-2xl p-1 h-auto">
              <TabsTrigger 
                value="OPEN" 
                className="flex items-center gap-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-300 rounded-xl h-12 transition-all"
              >
                <span className="w-2 h-2 bg-emerald-500 rounded-full data-[state=active]:bg-white"></span>
                Đang mở
              </TabsTrigger>
              <TabsTrigger 
                value="UPCOMING" 
                className="flex items-center gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-300 rounded-xl h-12 transition-all"
              >
                <span className="w-2 h-2 bg-amber-500 rounded-full data-[state=active]:bg-white"></span>
                Sắp diễn ra
              </TabsTrigger>
              <TabsTrigger 
                value="CLOSED" 
                className="flex items-center gap-2 data-[state=active]:bg-red-500 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-300 rounded-xl h-12 transition-all"
              >
                <span className="w-2 h-2 bg-red-500 rounded-full data-[state=active]:bg-white"></span>
                Đã đóng
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {isLoading ? (
                <TeacherQuizSkeleton />
              ) : error ? (
                <Card className="rounded-[28px] border-white/10 bg-white/5 text-white backdrop-blur-2xl">
                  <CardContent className="p-8 text-center">
                    <p className="text-red-400 text-lg mb-4">
                      Có lỗi xảy ra khi tải dữ liệu
                    </p>
                    <Button 
                      onClick={() => refetch()}
                      className="rounded-xl bg-emerald-500 text-white hover:bg-emerald-600"
                    >
                      Thử lại
                    </Button>
                  </CardContent>
                </Card>
              ) : filteredClasses.length === 0 ? (
                <Card className="rounded-[28px] border-white/10 bg-white/5 text-white backdrop-blur-2xl">
                  <CardContent className="p-8 text-center">
                    <p className="text-slate-300 text-lg">
                      Không tìm thấy bài kiểm tra nào
                    </p>
                    <p className="text-slate-400 text-sm mt-2">
                      Thử thay đổi bộ lọc hoặc tạo bài kiểm tra mới
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-8">
                  {filteredClasses.map((classData: classDTO) => (
                    <ClassSection
                      key={classData.classId}
                      classData={classData}
                      status={activeTab}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="bg-slate-900 border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Xác nhận xoá bài kiểm tra</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              Bạn có chắc chắn muốn xoá bài kiểm tra này? Thao tác này
              <span className="font-semibold"> không thể hoàn tác</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 text-white hover:bg-white/10">
              Huỷ
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={async () => {
                if (deleteId !== null) {
                  await deleteQuizMutation.mutateAsync();
                  setDeleteId(null);
                }
              }}
            >
              Xoá
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
