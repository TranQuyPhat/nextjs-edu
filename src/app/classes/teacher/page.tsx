"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Navigation from "@/components/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Copy,
  Edit3,
  Eye,
  Layers,
  Plus,
  Search,
  Settings,
  Sparkles,
  Trash2,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  getTeacherClasses,
  createClass,
  getAllSubjects,
  deleteClass,
  updateClass,
  searchClassesTeacher, // Import hàm search mới
} from "@/services/classService";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DropdownNotificationBell from "@/components/classDetails/DropdownNotificationBell";
import SubjectManager from "@/components/classes/SubjectManager";
import { CardSkeletonGrid } from "@/components/skeletons/CardSkeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

import { toast } from "react-toastify";
import Swal from "sweetalert2";

// Schema validate form lớp học
const classSchema = yup.object().shape({
  className: yup.string().required("Tên lớp không được để trống"),
  schoolYear: yup
    .number()
    .typeError("Niên khóa phải là số")
    .required("Vui lòng nhập niên khóa")
    .min(2000, "Niên khóa không hợp lệ"),
  semester: yup.string().required("Vui lòng chọn học kỳ"),
  description: yup.string(),
  subjectId: yup.number().required("Vui lòng chọn môn học"),
  joinMode: yup
    .string()
    .oneOf(["AUTO", "APPROVAL"])
    .required("Vui lòng chọn chế độ tham gia lớp"),
});

export default function TeacherClassesPage() {
  const [searchSubject, setSearchSubject] = useState("");
  const [searchKeyword, setSearchKeyword] = useState(""); // Input field value
  const [isSearching, setIsSearching] = useState(false); // Trạng thái đang tìm kiếm
  const [user, setUser] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state cho page

  const uniqueSubjects = useMemo(() => {
    return (
      subjects?.filter(
        (subject, index, self) =>
          subject &&
          subject.id &&
          index === self.findIndex((s) => s && s.id === subject.id)
      ) || []
    );
  }, [subjects]);

  const filteredSubjects = useMemo(() => {
    if (!uniqueSubjects || uniqueSubjects.length === 0) {
      return [];
    }
    return uniqueSubjects.filter((subject) =>
      subject.subjectName.toLowerCase().includes(searchSubject.toLowerCase())
    );
  }, [uniqueSubjects, searchSubject]);

  // Form cho tạo/sửa lớp học
  const classForm = useForm({
    resolver: yupResolver(classSchema),
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      // Chờ cả 2 request (classes + subjects) hoàn thành
      Promise.all([
        getTeacherClasses(parsedUser.userId, 0, 6),
        getAllSubjects(),
      ])
        .then(([classesRes, subjectsRes]) => {
          setClasses(classesRes.data);
          setPageNumber(classesRes.pageNumber);
          setTotalPages(classesRes.totalPages);
          setSubjects(subjectsRes);
          setIsLoading(false); // Chỉ tắt loading khi cả 2 request xong
        })
        .catch((err) => {
          console.error("Lỗi khi tải dữ liệu:", err);
          toast.error("Không thể tải dữ liệu!");
          setIsLoading(false); // Tắt loading thậm chí khi có lỗi
        });
    }
  }, []);

  const loadClasses = useCallback(
    (userId: number, page: number) => {
      getTeacherClasses(userId, page, pageSize)
        .then((res) => {
          setClasses(res.data);
          setPageNumber(res.pageNumber);
          setTotalPages(res.totalPages);
        })
        .catch((err) => {
          console.error("Lỗi khi lấy lớp:", err);
          toast.error(
            err?.response?.data?.messages?.[0] ?? "Không thể tải danh sách lớp!"
          );
        });
    },
    [pageSize]
  );

  const loadSubjects = useCallback(() => {
    getAllSubjects()
      .then((data) => {
        setSubjects(data);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy môn học:", err);
        toast.error(
          err?.response?.data?.messages?.[0] ??
            "Không thể tải danh sách môn học!"
        );
      });
  }, []);

  // Hàm tìm kiếm bằng backend
  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      toast.error("Vui lòng nhập từ khóa tìm kiếm!");
      return;
    }

    try {
      setIsSearching(true);
      const res = await searchClassesTeacher(user.userId, searchKeyword.trim());

      // Hiển thị tất cả kết quả từ backend, không phân trang
      setClasses(res.data || res);
      setPageNumber(0);
      setTotalPages(0); // Không phân trang khi search

      console.log("Kết quả tìm kiếm:", res);
    } catch (err: any) {
      console.error("Lỗi khi tìm kiếm lớp:", err);
      toast.error(
        err?.response?.data?.messages?.[0] ?? "Không thể tìm kiếm lớp!"
      );
    }
  };

  // Hàm clear search
  const clearSearch = () => {
    setSearchKeyword("");
    setIsSearching(false);
    loadClasses(user.userId, 0); // Load lại trang đầu
  };

  // Hàm chuyển trang (chỉ hoạt động khi không tìm kiếm)
  const handlePageChange = (page: number) => {
    if (!isSearching) {
      loadClasses(user.userId, page);
    }
  };

  // Hàm mở form tạo mới
  const openCreateModal = () => {
    setEditingClass(null);
    classForm.reset();
    setIsModalOpen(true);
  };

  // Hàm mở form chỉnh sửa
  const openEditModal = async (classItem: any) => {
    setEditingClass(classItem);

    // Đảm bảo subjects đã load xong
    if (subjects.length === 0) {
      await loadSubjects();
    }

    // Delay một chút để đảm bảo state đã update
    setTimeout(() => {
      // Điền dữ liệu vào form
      classForm.reset({
        className: classItem.className,
        schoolYear: classItem.schoolYear,
        semester: classItem.semester,
        description: classItem.description || "",
        subjectId: classItem.subject?.id,
        joinMode: classItem.joinMode,
      });

      setIsModalOpen(true);
    }, 100);
  };

  // Hàm đóng modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingClass(null);
    classForm.reset();
  };

  const onSubmitClass = async (data: any) => {
    try {
      if (editingClass) {
        // Cập nhật lớp học
        const payload = {
          ...data,
          id: editingClass.id,
          teacherId: user.userId,
        };

        await updateClass(editingClass.id, payload);
        toast.success("Cập nhật lớp học thành công!");
      } else {
        // Tạo lớp học mới
        const payload = {
          ...data,
          teacherId: user.userId,
        };

        await createClass(payload);
        toast.success("Tạo lớp học thành công!");
      }

      // Load lại danh sách lớp
      if (isSearching) {
        clearSearch(); // Clear search và load lại trang bình thường
      } else {
        await loadClasses(user.userId, pageNumber);
      }

      // reset form và đóng modal
      classForm.reset();
      setIsModalOpen(false);
      setEditingClass(null);
    } catch (err: any) {
      console.error(
        editingClass ? "Lỗi cập nhật lớp học:" : "Lỗi tạo lớp học:",
        err
      );
      const backendMessage =
        err?.response?.data?.messages?.[0] ??
        (editingClass ? "Cập nhật lớp học thất bại!" : "Tạo lớp học thất bại!");

      toast.error(backendMessage);
    }
  };

  const handleDeleteClass = async (id: number) => {
    const result = await Swal.fire({
      title: "Xác nhận xóa",
      text: "Hành động này sẽ xóa vĩnh viễn lớp học và không thể hoàn tác!",
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy bỏ",
      reverseButtons: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      focusCancel: true, // Tránh nhấn nhầm
    });

    if (result.isConfirmed) {
      try {
        await deleteClass(id);

        // Load lại danh sách lớp
        if (isSearching) {
          clearSearch(); // Clear search và load lại trang bình thường
        } else {
          await loadClasses(user.userId, pageNumber);
        }

        toast.success("Xóa lớp thành công!");
      } catch {
        Swal.fire("Thất bại!", "Xóa lớp thất bại.", "error");
      }
    }
  };

  const copyClassCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Đã sao chép mã lớp!");
  };

  if (!user || isLoading) {
    return (
      <div className="relative min-h-screen bg-slate-950 text-white">
        <div className="absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-emerald-600/40 via-slate-900 to-slate-950 blur-3xl" />
          <div className="absolute -right-24 top-24 h-64 w-64 rounded-full bg-teal-500/30 blur-[140px]" />
          <div className="absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-indigo-500/30 blur-[150px]" />
        </div>
        <Navigation />
        <main className="relative z-10 mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
          {/* Search Section Skeleton */}
          <section className="rounded-[32px] border border-white/5 bg-white/5 p-6 shadow-2xl backdrop-blur-3xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="h-10 flex-1 rounded-xl bg-slate-700/50 animate-pulse"></div>
                <div className="h-10 w-40 rounded-xl bg-slate-700/50 animate-pulse"></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-32 rounded-2xl bg-slate-700/50 animate-pulse"></div>
                <div className="h-10 w-28 rounded-2xl bg-slate-700/50 animate-pulse"></div>
                <div className="h-10 w-10 rounded-full bg-slate-700/50 animate-pulse"></div>
              </div>
            </div>
          </section>

          {/* Classes Grid Skeleton */}
          <section className="mt-12 space-y-8">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-[28px] border border-white/10 bg-white/5 text-white"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex-1 space-y-2">
                        <div className="h-6 w-3/4 rounded bg-slate-700/50 animate-pulse"></div>
                        <div className="h-4 w-full rounded bg-slate-700/50 animate-pulse"></div>
                      </div>
                      <div className="h-6 w-20 rounded-full bg-slate-700/50 animate-pulse"></div>
                    </div>
                    <div className="h-4 w-1/2 rounded bg-slate-700/50 animate-pulse mb-4"></div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 mb-4">
                      <div className="h-6 w-32 rounded bg-slate-700/50 animate-pulse"></div>
                    </div>

                    <div className="flex gap-2">
                      <div className="h-10 flex-1 rounded-xl bg-slate-700/50 animate-pulse"></div>
                      <div className="h-10 w-10 rounded-xl bg-slate-700/50 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    );
  }

  const uniqueClasses =
    classes?.filter(
      (classItem, index, self) =>
        classItem &&
        classItem.id &&
        index === self.findIndex((c) => c && c.id === classItem.id)
    ) || [];

  const autoClasses = uniqueClasses.filter(
    (cls) => cls.joinMode === "AUTO"
  ).length;
  const approvalClasses = uniqueClasses.filter(
    (cls) => cls.joinMode === "APPROVAL"
  ).length;

  const heroMetrics = [
    {
      label: "Lớp đang quản lý",
      value: uniqueClasses.length,
      detail: `${
        uniqueClasses.length >= pageSize ? "Đang đầy tải" : "Ổn định"
      }`,
    },
    {
      label: "Tự động tham gia",
      value: autoClasses,
      detail: "Không cần phê duyệt",
    },
    {
      label: "Cần phê duyệt",
      value: approvalClasses,
      detail: "Kiểm soát học sinh",
    },
  ];

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
        <section className="rounded-[32px] border border-white/5 bg-white/5 p-6 shadow-2xl backdrop-blur-3xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3 flex-1">
              <Input
                placeholder="Nhập tên lớp, môn học hoặc mã lớp..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                className="flex-1 bg-white/5 text-white placeholder:text-slate-500"
              />
              <Button
                onClick={handleSearch}
                className="rounded-xl bg-emerald-500 px-6 py-2.5 text-white hover:bg-emerald-600 whitespace-nowrap"
                disabled={!searchKeyword.trim()}
              >
                <Search className="mr-2 h-4 w-4" />
                Tìm kiếm lớp học
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <SubjectManager
                userId={user.userId}
                subjects={uniqueSubjects}
                reloadSubjects={async () => loadSubjects()}
              />
              <Button
                className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-2.5 font-semibold shadow-emerald-500/40 hover:from-emerald-600 hover:to-teal-600 whitespace-nowrap"
                onClick={openCreateModal}
              >
                <Plus className="mr-2 h-4 w-4" />
                Tạo lớp
              </Button>
              <DropdownNotificationBell teacherId={user.userId} />
            </div>
          </div>
        </section>

        {/* Dialog tạo/sửa lớp học */}
        <Dialog
          open={isModalOpen}
          onOpenChange={(open) => {
            if (!open) {
              closeModal();
            }
          }}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-green-700">
                {editingClass ? "Chỉnh sửa lớp học" : "Tạo lớp học mới"}
              </DialogTitle>
              <DialogDescription>
                {editingClass
                  ? "Cập nhật thông tin lớp học"
                  : "Nhập thông tin để tạo lớp học mới"}
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={classForm.handleSubmit(onSubmitClass)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="className">Tên lớp</Label>
                <Input id="className" {...classForm.register("className")} />
                {classForm.formState.errors.className && (
                  <p className="text-red-500 text-sm">
                    {classForm.formState.errors.className.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="schoolYear">Niên khóa</Label>
                <Input
                  id="schoolYear"
                  type="number"
                  {...classForm.register("schoolYear")}
                />
                {classForm.formState.errors.schoolYear && (
                  <p className="text-red-500 text-sm">
                    {classForm.formState.errors.schoolYear.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Học kỳ</Label>
                <Select
                  key={`semester-select-${editingClass?.id || "new"}`}
                  value={classForm.watch("semester") || ""}
                  onValueChange={(val) => classForm.setValue("semester", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn học kỳ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Học kỳ 1">Học kỳ 1</SelectItem>
                    <SelectItem value="Học kỳ 2">Học kỳ 2</SelectItem>
                    <SelectItem value="Học kỳ hè">Học kỳ hè</SelectItem>
                  </SelectContent>
                </Select>
                {classForm.formState.errors.semester && (
                  <p className="text-red-500 text-sm">
                    {classForm.formState.errors.semester.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  {...classForm.register("description")}
                />
              </div>
              <div className="space-y-2">
                <Label>Môn học</Label>
                <Select
                  key={`subject-select-${editingClass?.id || "new"}`}
                  value={classForm.watch("subjectId")?.toString() || ""}
                  onValueChange={(val) =>
                    classForm.setValue("subjectId", Number(val))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn môn học" />
                  </SelectTrigger>
                  <SelectContent side="top" className="max-h-60">
                    {/* Ô tìm kiếm với event handling cải thiện */}
                    <div className="p-2 sticky top-0 bg-white z-10 border-b">
                      <Input
                        placeholder="Tìm kiếm môn học..."
                        value={searchSubject}
                        onChange={(e) => setSearchSubject(e.target.value)}
                        onKeyDown={(e) => {
                          // Prevent Select from closing when typing
                          e.stopPropagation();
                        }}
                        onClick={(e) => {
                          // Prevent Select from closing when clicking on input
                          e.stopPropagation();
                        }}
                        className="h-8"
                      />
                    </div>

                    {/* Danh sách đã filter */}
                    <div className="max-h-48 overflow-y-auto">
                      {filteredSubjects.length > 0 ? (
                        filteredSubjects.map((subject, index) => (
                          <SelectItem
                            key={`subject-${subject.id}-${index}`}
                            value={subject.id.toString()}
                            className="cursor-pointer hover:bg-gray-100"
                          >
                            <div className="flex items-center">
                              <span>{subject.subjectName}</span>
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-3 py-6 text-center">
                          <div className="text-sm text-gray-500 mb-1">
                            Không tìm thấy môn học
                          </div>
                          <div className="text-xs text-gray-400">
                            Thử từ khóa khác hoặc kiểm tra lại chính tả
                          </div>
                        </div>
                      )}
                    </div>
                  </SelectContent>
                </Select>

                {classForm.formState.errors.subjectId && (
                  <p className="text-red-500 text-sm">
                    {classForm.formState.errors.subjectId.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Chế độ tham gia lớp</Label>
                <Select
                  key={`joinmode-select-${editingClass?.id || "new"}`}
                  value={classForm.watch("joinMode") || ""}
                  onValueChange={(val) =>
                    classForm.setValue("joinMode", val as "AUTO" | "APPROVAL")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn chế độ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AUTO">
                      Tự động vào (không cần duyệt)
                    </SelectItem>
                    <SelectItem value="APPROVAL">
                      Cần giáo viên duyệt
                    </SelectItem>
                  </SelectContent>
                </Select>
                {classForm.formState.errors.joinMode && (
                  <p className="text-red-500 text-sm">
                    {classForm.formState.errors.joinMode.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-green-700 hover:bg-green-800"
                disabled={classForm.formState.isSubmitting}
              >
                {classForm.formState.isSubmitting
                  ? "Đang xử lý..."
                  : editingClass
                  ? "Cập nhật lớp"
                  : "Tạo lớp"}
              </Button>

              {/* Thêm button hủy */}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={closeModal}
              >
                Hủy
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <section className="mt-12 space-y-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {uniqueClasses.map((classItem, index) => (
              <Card
                key={`class-${classItem.id}-${index}`}
                className="rounded-[28px] border border-white/10 bg-white/5 text-white transition hover:-translate-y-1 hover:bg-white/10"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-semibold">
                        {classItem.className}
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-300 line-clamp-2">
                        {classItem.description ||
                          "Chưa có mô tả cho lớp học này."}
                      </CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className={`rounded-full border px-3 py-1 text-xs ${
                        classItem.joinMode === "AUTO"
                          ? "border-emerald-300 text-emerald-200"
                          : "border-amber-300 text-amber-200"
                      }`}
                    >
                      {classItem.joinMode === "AUTO" ? "Tự động" : "Phê duyệt"}
                    </Badge>
                  </div>
                  <div className="mt-4 flex items-center gap-3 text-sm text-slate-400">
                    <Users className="h-4 w-4 text-emerald-200" />
                    Niên khóa {classItem.schoolYear} • {classItem.semester}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <span className="text-xs uppercase tracking-[0.3em] text-slate-500">
                        Mã lớp
                      </span>
                      <span className="font-mono text-lg text-white">
                        #{classItem.id}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-full text-xs text-white hover:bg-white/10"
                      onClick={() => copyClassCode(classItem.id.toString())}
                    >
                      <Copy className="mr-1 h-3.5 w-3.5" />
                      Sao chép
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/classes/${classItem.id}`} className="flex-1">
                      <Button className="w-full rounded-xl bg-emerald-500 text-white hover:bg-emerald-600">
                        <Eye className="mr-2 h-4 w-4" />
                        Xem lớp
                      </Button>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-48 rounded-2xl border border-slate-800 bg-slate-900/95 text-white backdrop-blur-xl"
                      >
                        <DropdownMenuItem
                          className="flex items-center gap-2 text-sm text-white hover:bg-white/5"
                          onClick={() => openEditModal(classItem)}
                        >
                          <Edit3 className="h-4 w-4 text-emerald-200" />
                          Chỉnh sửa lớp
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="flex items-center gap-2 text-sm text-rose-300 hover:bg-white/5"
                          onClick={() => handleDeleteClass(classItem.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Xóa lớp học
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {uniqueClasses.length === 0 && (
            <div className="rounded-[32px] border border-dashed border-white/20 bg-white/5 px-6 py-16 text-center">
              <p className="text-lg text-slate-300">
                {isSearching
                  ? `Không tìm thấy lớp học nào với từ khóa "${searchKeyword}"`
                  : "Chưa có lớp học nào. Hãy tạo lớp đầu tiên để bắt đầu hành trình giảng dạy số."}
              </p>
              {isSearching && (
                <Button
                  variant="outline"
                  className="mt-6 border-white/10 bg-white/10 text-white hover:bg-white/30 hover:border-white/30 hover:text-white"
                  onClick={clearSearch}
                >
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          )}

          {!isSearching && totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i).map((num) => (
                <Button
                  key={num}
                  variant={num === pageNumber ? "default" : "outline"}
                  onClick={() => handlePageChange(num)}
                  className={
                    num === pageNumber
                      ? "rounded-full bg-emerald-500 text-white hover:bg-emerald-600 hover:text-white"
                      : "rounded-full bg-white/30 text-white hover:bg-white/10 hover:text-white"
                  }
                >
                  {num + 1}
                </Button>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
