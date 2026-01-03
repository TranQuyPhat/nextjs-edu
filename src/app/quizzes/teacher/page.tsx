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
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useDeleteQuiz } from "../hook/quiz-hooks";
import { useGroupedQuizzes } from "../hooks";
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
    const date = new Date(dateString);
    const vietnamDate = new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes()
    );
    const day = String(vietnamDate.getDate()).padStart(2, "0");
    const month = String(vietnamDate.getMonth() + 1).padStart(2, "0");
    const year = vietnamDate.getFullYear();
    const hours = String(vietnamDate.getHours()).padStart(2, "0");
    const minutes = String(vietnamDate.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const handleXemKetQua = (quizId: number) => {
    router.push(`teacher/quizResult/${quizId}`);
  };

  const renderQuizCard = (quiz: QuizDTO) => {
    return (
      <Card
        key={quiz.id}
        className="rounded-xl border border-white/10 bg-slate-800 text-white shadow-sm"
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

    const uniqueQuizzes = quizzes.filter(
      (quiz, index, self) => index === self.findIndex((q) => q.id === quiz.id)
    );

    const totalQuizzes = classData.quizTotal;
    const displayedQuizzes = uniqueQuizzes.slice(0, 3);

    const handleOpenClassDetail = () => {
      router.push(
        `/quizzes/teacher/Quizclass?classId=${
          classData.classId
        }&className=${encodeURIComponent(
          classData.className
        )}&subjectName=${encodeURIComponent(classData.subjectName)}`
      );
    };

    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={handleOpenClassDetail}
          className="flex w-full items-start justify-between text-left transition hover:translate-x-1"
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-semibold text-white underline-offset-4 hover:underline">
                Lớp {classData.className}
              </h2>
              <Badge className="rounded-full border border-white/20 bg-white/10 text-emerald-200 px-3 py-1">
                {totalQuizzes} bài kiểm tra
              </Badge>
            </div>
            <p className="text-sm text-emerald-200/80">
              Bấm để xem tất cả bài kiểm tra của lớp này
            </p>
          </div>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayedQuizzes.map((quiz) => renderQuizCard(quiz))}
        </div>
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
    <div className="min-h-screen bg-slate-900 text-white">
      <Navigation />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-white/10 bg-slate-800 p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Quản lý trắc nghiệm</h1>
              <p className="mt-2 text-sm text-slate-300">
                Xem và chỉnh sửa nhanh các bài kiểm tra theo lớp.
              </p>
            </div>
            <Link href="teacher/createQuiz">
              <Button className="rounded-xl bg-emerald-500 px-5 py-2.5 text-white hover:bg-emerald-600">
                <Plus className="mr-2 h-4 w-4" />
                Tạo bài kiểm tra mới
              </Button>
            </Link>
          </div>
        </section>

        <section className="mt-6">
          <Card className="rounded-2xl border-white/10 bg-slate-800 text-white shadow-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-3 md:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Tìm kiếm bài kiểm tra..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-900 text-white placeholder:text-slate-500 border-white/10"
                  />
                </div>

                <div className="min-w-[180px]">
                  <Select
                    value={selectedSubject}
                    onValueChange={setSelectedSubject}
                  >
                    <SelectTrigger className="bg-slate-900 text-white border-white/10">
                      <SelectValue placeholder="Môn học" />
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

                <div className="min-w-[180px]">
                  <Select
                    value={selectedClass}
                    onValueChange={setSelectedClass}
                  >
                    <SelectTrigger className="bg-slate-900 text-white border-white/10">
                      <SelectValue placeholder="Lớp học" />
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

        <section className="mt-6">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as QuizStatus)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 bg-slate-800 border border-white/10 rounded-xl p-1 h-auto">
              <TabsTrigger
                value="OPEN"
                className="flex items-center justify-center gap-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-white text-slate-300 rounded-lg h-11 transition-all"
              >
                Đang mở
              </TabsTrigger>
              <TabsTrigger
                value="UPCOMING"
                className="flex items-center justify-center gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-white text-slate-300 rounded-lg h-11 transition-all"
              >
                Sắp diễn ra
              </TabsTrigger>
              <TabsTrigger
                value="CLOSED"
                className="flex items-center justify-center gap-2 data-[state=active]:bg-red-500 data-[state=active]:text-white text-slate-300 rounded-lg h-11 transition-all"
              >
                Đã đóng
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {isLoading ? (
                <TeacherQuizSkeleton />
              ) : error ? (
                <Card className="rounded-2xl border-white/10 bg-slate-800 text-white">
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
                <Card className="rounded-2xl border-white/10 bg-slate-800 text-white">
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
            <AlertDialogTitle className="text-white">
              Xác nhận xoá bài kiểm tra
            </AlertDialogTitle>
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
