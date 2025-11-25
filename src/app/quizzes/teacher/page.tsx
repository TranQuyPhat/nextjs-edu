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
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Sắp diễn ra
          </Badge>
        );
      case "OPEN":
        return (
          <Badge className="bg-green-500 text-white">
            <Clock className="h-3 w-3 mr-1" />
            Đang mở
          </Badge>
        );
      case "CLOSED":
        return (
          <Badge variant="destructive">
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
        className="p-5 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1
         transition duration-200 ease-in-out"
      >
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {quiz.title}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{quiz.subject}</span>
            {getStatusBadge(quiz.status)}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2 text-gray-400" />
            <span>
              {quiz.timeLimit} phút • {quiz.totalQuestion} câu
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2 text-gray-400" />
            <span>
              {quiz.studentsSubmitted}/{quiz.totalStudents} đã làm
            </span>
          </div>
          <div className="text-sm text-gray-500">
            {activeTab === "UPCOMING"
              ? `Bắt đầu: ${formatDateTime(quiz.startDate)}`
              : `Hết hạn: ${formatDateTime(quiz.endDate)}`}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1 text-green-700 bg-green-100 hover:bg-green-200
             border border-green-300 transition-colors duration-200"
            onClick={() => handleXemKetQua(quiz.id)}
          >
            <Eye className="h-4 w-4 mr-1" />
            Kết quả
          </Button>

          {activeTab === "UPCOMING" && (
            <>
              <Button
                size="sm"
                className="text-blue-700 bg-blue-100 hover:bg-blue-200
                 border border-blue-300 transition-colors duration-200"
                onClick={() =>
                  router.push(`teacher/preview?mode=edit&id=${quiz.id}`)
                }
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="ml-2"
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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold text-gray-800">
              Lớp {classData.className}
            </h2>
            <Badge variant="outline">{totalQuizzes} bài kiểm tra</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {uniqueQuizzes.map((quiz) => renderQuizCard(quiz))}
        </div>

        {canLoadMore && (
          <div className="flex justify-center items-center gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
            {remainingCount > 0 && (
              <span className="text-sm text-gray-600">
                Còn {remainingCount} bài kiểm tra khác
              </span>
            )}

            <Button
              variant="outline"
              onClick={handleLoadMoreQuizzes}
              disabled={isFetchingNextPage}
              className="min-w-[120px]"
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
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Quản lý trắc nghiệm
              </h1>
              <p className="text-gray-600">
                Tạo và theo dõi bài kiểm tra trắc nghiệm
              </p>
            </div>
            <Link href="teacher/createQuiz">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tạo bài kiểm tra mới
              </Button>
            </Link>
          </div>

          <Card className="bg-white">
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Tìm kiếm theo tên bài kiểm tra..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="min-w-[200px]">
                  <Select
                    value={selectedSubject}
                    onValueChange={setSelectedSubject}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn môn học" />
                    </SelectTrigger>
                    <SelectContent>
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
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn lớp học" />
                    </SelectTrigger>
                    <SelectContent>
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

          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as QuizStatus)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="OPEN" className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Đang mở
              </TabsTrigger>
              <TabsTrigger value="UPCOMING" className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                Sắp diễn ra
              </TabsTrigger>
              <TabsTrigger value="CLOSED" className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                Đã đóng
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {isLoading ? (
                <TeacherQuizSkeleton />
              ) : error ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-red-500 text-lg mb-4">
                      Có lỗi xảy ra khi tải dữ liệu
                    </p>
                    <Button onClick={() => refetch()}>Thử lại</Button>
                  </CardContent>
                </Card>
              ) : filteredClasses.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500 text-lg">
                      Không tìm thấy bài kiểm tra nào
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
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
        </div>
      </div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xoá bài kiểm tra</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xoá bài kiểm tra này? Thao tác này
              <span className="font-semibold"> không thể hoàn tác</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Huỷ</AlertDialogCancel>
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
