"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Eye, Search, X, Sparkles, Users } from "lucide-react";
import Link from "next/link";
import {
  getStudentClasses,
  getClasses,
  createJoinRequest,
  getClassById,
  searchClasses,
  getLatestClasses,
  searchClassesStudentPaginate, // Thêm import cho search function
} from "@/services/classService";
import StudentNotificationToast from "@/components/classDetails/StudentNotificationToast";
import { toast } from "react-toastify";
import { CardSkeletonGrid } from "@/components/skeletons/CardSkeleton";

export default function StudentClassesPage() {
  const [user, setUser] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [joinCode, setJoinCode] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Loading state cho page

  // States cho tìm kiếm chính
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchDebounceTimeout, setSearchDebounceTimeout] =
    useState<NodeJS.Timeout | null>(null);

  // States cho dialog tham gia lớp
  const [activeTab, setActiveTab] = useState<"code" | "search">("code");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  const loadStudentClasses = useCallback(
    (userId: number, page: number) => {
      getStudentClasses(userId, page, pageSize)
        .then((res) => {
          setClasses(Array.isArray(res.data) ? res.data : res.data || []);
          setTotalPages(res.totalPages || 1);
          setIsSearching(false);
          console.log("res", res);
        })
        .catch((error) => {
          console.error("Lỗi khi lấy lớp học:", error);
          setIsSearching(false);
          toast.error(
            error?.response?.data?.messages?.[0] ??
              "Không thể tải danh sách lớp học!"
          );
        });
    },
    [pageSize]
  );

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      console.log("parsedUser :", parsedUser);

      // Chờ request classes hoàn thành trước khi tắt loading
      getStudentClasses(parsedUser.userId, 0, 6)
        .then((res) => {
          setClasses(Array.isArray(res.data) ? res.data : res.data || []);
          setTotalPages(res.totalPages || 1);
          setIsLoading(false); // Tắt loading khi dữ liệu sẵn sàng
        })
        .catch((error) => {
          console.error("Lỗi khi lấy lớp học:", error);
          toast.error(
            error?.response?.data?.messages?.[0] ??
              "Không thể tải danh sách lớp học!"
          );
          setIsLoading(false); // Tắt loading thậm chí khi có lỗi
        });
    }
  }, []);

  // Function tìm kiếm lớp học của student với phân trang
  const handleSearchStudentClasses = async (
    keyword: string,
    page: number = 0
  ) => {
    if (!keyword.trim()) {
      loadStudentClasses(user.userId, page);
      return;
    }

    try {
      setIsSearching(true);
      const response = await searchClassesStudentPaginate(
        user.userId,
        keyword,
        page,
        pageSize
      );
      setClasses(response.data);
      setCurrentPage(response.pageNumber);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      console.error("Lỗi khi tìm kiếm lớp:", err);
      toast.error(
        err?.response?.data?.messages?.[0] ?? "Không thể tìm kiếm lớp!"
      );
    } finally {
      setIsSearching(false);
    }
  };

  // Clear search và load lại lớp của student
  const clearSearch = () => {
    setSearchKeyword("");
    setIsSearching(false);
    setCurrentPage(0);
    loadStudentClasses(user.userId, 0);
  };

  // Handle search input với debounce
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchKeyword(value);

    // Clear timeout cũ
    if (searchDebounceTimeout) {
      clearTimeout(searchDebounceTimeout);
    }

    // Set timeout mới
    const timeoutId = setTimeout(() => {
      handleSearchStudentClasses(value, 0); // Reset về trang đầu khi search
    }, 500);

    setSearchDebounceTimeout(timeoutId);
  };

  // Load lớp gợi ý khi mở tab tìm kiếm lần đầu
  useEffect(() => {
    if (activeTab === "search" && searchResults.length === 0 && !searchTerm) {
      getLatestClasses().then((data) => {
        setSearchResults(Array.isArray(data) ? data : data || []);
      });
    }
  }, [activeTab, searchResults.length, searchTerm]);

  const handleJoinClass = async () => {
    if (!joinCode) {
      toast.warn("Vui lòng nhập mã lớp");
      return;
    }

    const classId = Number(joinCode);
    if (isNaN(classId)) {
      toast.error("Mã lớp không hợp lệ. Mã lớp phải là số!");
      return;
    }
    try {
      // Lấy thông tin chi tiết lớp học trước
      const classInfo = await getClassById(Number(joinCode));
      console.log("classInfo", classInfo);

      // Gửi yêu cầu tham gia lớp
      await createJoinRequest(Number(joinCode), user.userId);

      // Hiển thị thông báo tùy theo join_mode
      if (classInfo?.joinMode === "AUTO") {
        toast.success("Bạn đã tham gia lớp thành công!");
        // Refresh danh sách lớp
        loadStudentClasses(user.userId, currentPage);
      } else if (classInfo?.joinMode === "APPROVAL") {
        toast.info(
          "Yêu cầu tham gia lớp đã được gửi, vui lòng đợi giáo viên xác nhận."
        );
      } else {
        toast.info(
          "Yêu cầu tham gia lớp đã được gửi, vui lòng đợi giáo viên xác nhận."
        );
      }

      setJoinCode("");
    } catch (err: any) {
      console.error("Lỗi khi gửi yêu cầu tham gia lớp:", err);
      toast.error(
        err?.response?.data?.messages?.[0] ??
          "Không thể gửi yêu cầu tham gia lớp"
      );
    }
  };

  const handleJoinFromSearch = async (classId: number) => {
    try {
      const classInfo = await getClassById(Number(classId));
      await createJoinRequest(classId, user.userId);

      // Hiển thị thông báo tùy theo join_mode
      if (classInfo?.joinMode === "AUTO") {
        toast.success("Bạn đã tham gia lớp thành công!");
        // Refresh danh sách lớp
        loadStudentClasses(user.userId, currentPage);
      } else if (classInfo?.joinMode === "APPROVAL") {
        toast.info(
          "Yêu cầu tham gia lớp đã được gửi, vui lòng đợi giáo viên xác nhận."
        );
      } else {
        toast.info(
          "Yêu cầu tham gia lớp đã được gửi, vui lòng đợi giáo viên xác nhận."
        );
      }
    } catch (err: any) {
      console.error("Lỗi khi gửi yêu cầu tham gia lớp:", err);
      toast.error(
        err?.response?.data?.messages?.[0] ??
          "Không thể gửi yêu cầu tham gia lớp"
      );
    }
  };

  const handleSearch = async () => {
    setLoadingSearch(true);
    try {
      if (searchTerm.trim() === "") {
        // Nếu không nhập gì thì load lại 10 lớp gần nhất
        const latest = await getLatestClasses();
        setSearchResults(latest);
      } else {
        const results = await searchClasses(searchTerm);
        setSearchResults(results);
        console.log(
          "lớp tìm kiếm: ",
          searchResults,
          "searchTerm: ",
          searchTerm
        );
      }
    } catch (err: any) {
      console.error("Lỗi tìm kiếm lớp:", err);
      toast.error(
        err?.response?.data?.messages?.[0] ?? "Không thể tìm kiếm lớp!"
      );
    }
    setLoadingSearch(false);
  };

  // Handle page change - phân biệt search và load thường
  const handlePageChange = (page: number) => {
    if (isSearching && searchKeyword.trim()) {
      handleSearchStudentClasses(searchKeyword, page);
    } else {
      setCurrentPage(page);
    }
  };

  if (!user || isLoading) {
    return (
      <div className="relative min-h-screen bg-slate-950 text-white">
        <div className="absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-emerald-600/35 via-slate-900 to-slate-950 blur-3xl" />
          <div className="absolute -right-20 top-24 h-64 w-64 rounded-full bg-teal-500/25 blur-[130px]" />
          <div className="absolute -left-12 bottom-0 h-72 w-72 rounded-full bg-indigo-500/25 blur-[140px]" />
        </div>

        <Navigation />
        <main className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
          <section className="rounded-[32px] border border-white/5 bg-white/5 p-8 shadow-2xl backdrop-blur-3xl animate-pulse">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <div className="h-6 w-48 rounded-full bg-gradient-to-r from-white/10 to-white/5"></div>
                <div className="h-10 w-2/3 rounded bg-gradient-to-r from-white/10 to-white/5"></div>
                <div className="h-4 w-3/4 rounded bg-gradient-to-r from-white/10 to-white/5"></div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className="h-3 w-1/3 rounded bg-gradient-to-r from-white/10 to-white/5 mb-2"></div>
                      <div className="h-6 w-1/2 rounded bg-gradient-to-r from-white/10 to-white/5 mb-2"></div>
                      <div className="h-2 w-2/3 rounded bg-gradient-to-r from-white/10 to-white/5"></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-stretch gap-3 sm:flex-row">
                <div className="h-11 w-full rounded-2xl bg-gradient-to-r from-white/10 to-white/5 sm:w-80"></div>
                <div className="h-11 w-full rounded-2xl bg-gradient-to-r from-white/10 to-white/5 sm:w-auto"></div>
              </div>
            </div>
          </section>

          <section className="mt-10">
            <CardSkeletonGrid count={6} />
          </section>
        </main>
      </div>
    );
  }

  const totalClassCount = classes.length;

  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-emerald-600/35 via-slate-900 to-slate-950 blur-3xl" />
        <div className="absolute -right-20 top-24 h-64 w-64 rounded-full bg-teal-500/25 blur-[130px]" />
        <div className="absolute -left-12 bottom-0 h-72 w-72 rounded-full bg-indigo-500/25 blur-[140px]" />
        <div className="absolute inset-0 opacity-30">
          {[...Array(28)].map((_, index) => (
            <span
              key={index}
              className="absolute h-1 w-1 rounded-full bg-cyan-200/40"
              style={{
                left: `${(index * 31) % 100}%`,
                top: `${(index * 19) % 100}%`,
                animation: `pulse 6s ease-in-out ${index * 0.25}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <Navigation />
      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <section className="rounded-[32px] border border-white/5 bg-white/5 p-8 shadow-2xl backdrop-blur-3xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.35em] text-emerald-200">
                <Sparkles className="h-3.5 w-3.5" />
                Lớp học
              </span>
              <div>
                <h1 className="text-4xl font-black md:text-5xl">
                  Lớp học của tôi
                </h1>
                <p className="mt-2 max-w-2xl text-slate-300">
                  {isSearching && searchKeyword.trim()
                    ? `Kết quả tìm kiếm cho “${searchKeyword}”.`
                    : "Danh sách lớp đã tham gia và quản lý trong một màn hình."}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  {
                    label: "Tổng lớp",
                    value: totalClassCount,
                    detail: "Đang theo học",
                  },
                  {
                    label: "Trang hiện tại",
                    value: `${currentPage + 1}/${totalPages || 1}`,
                    detail: "Phân trang",
                  },
                  {
                    label: "Trạng thái",
                    value: isSearching ? "Đang lọc" : "Toàn bộ",
                    detail: isSearching
                      ? "Kết quả tìm kiếm"
                      : "Hiển thị đầy đủ",
                  },
                ].map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <p className="text-sm text-slate-300">{metric.label}</p>
                    <p className="mt-1 text-2xl font-semibold text-white">
                      {metric.value}
                    </p>
                    <p className="text-xs text-emerald-200">{metric.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-stretch gap-3 sm:flex-row">
              <div className="relative sm:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm lớp học..."
                  value={searchKeyword}
                  onChange={handleSearchInputChange}
                  className="w-full rounded-2xl border-white/15 bg-white/5 pl-10 pr-10 text-white placeholder:text-slate-500 focus:border-emerald-400 focus:ring-emerald-400"
                />
                {searchKeyword && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
                    title="Xóa tìm kiếm"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-5 text-white shadow-emerald-500/40 hover:from-emerald-600 hover:to-teal-600">
                    <Plus className="mr-2 h-4 w-4" />
                    Tham gia lớp
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-xl rounded-3xl border border-white/10 bg-slate-900/80 text-white backdrop-blur-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl text-white">
                      Tham gia lớp học
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                      Chọn cách tham gia phù hợp
                    </DialogDescription>
                  </DialogHeader>

                  <div className="flex gap-2 rounded-2xl bg-white/5 p-1">
                    <Button
                      variant={activeTab === "code" ? "default" : "ghost"}
                      onClick={() => setActiveTab("code")}
                      className={`flex-1 rounded-xl ${
                        activeTab === "code"
                          ? "bg-emerald-500 text-white hover:bg-emerald-600"
                          : "text-slate-200 hover:bg-white/10"
                      }`}
                    >
                      Nhập mã lớp
                    </Button>
                    <Button
                      variant={activeTab === "search" ? "default" : "ghost"}
                      onClick={() => setActiveTab("search")}
                      className={`flex-1 rounded-xl ${
                        activeTab === "search"
                          ? "bg-emerald-500 text-white hover:bg-emerald-600"
                          : "text-slate-200 hover:bg-white/10"
                      }`}
                    >
                      Tìm kiếm lớp
                    </Button>
                  </div>

                  {activeTab === "code" && (
                    <div className="space-y-3">
                      <Label htmlFor="joinCode">Mã lớp</Label>
                      <Input
                        id="joinCode"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        placeholder="Nhập mã lớp (VD: 123456)"
                        className="rounded-xl border-white/15 bg-white/5 text-white placeholder:text-slate-500 focus:border-emerald-400 focus:ring-emerald-400"
                      />
                      <Button
                        onClick={handleJoinClass}
                        className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600"
                      >
                        Tham gia
                      </Button>
                    </div>
                  )}

                  {activeTab === "search" && (
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Tìm theo tên lớp"
                          className="flex-1 rounded-xl border-white/15 bg-white/5 text-white placeholder:text-slate-500 focus:border-emerald-400 focus:ring-emerald-400"
                        />
                        <Button
                          onClick={handleSearch}
                          disabled={loadingSearch}
                          className="rounded-xl bg-emerald-500 px-4 text-white hover:bg-emerald-600"
                        >
                          {loadingSearch ? "Đang tìm..." : "Tìm"}
                        </Button>
                      </div>
                      <div className="max-h-60 space-y-3 overflow-y-auto">
                        {searchResults.length === 0 && (
                          <p className="text-sm text-slate-400">
                            Không có lớp nào.
                          </p>
                        )}
                        {searchResults.map((item) => (
                          <Card
                            key={item.id}
                            className="border border-white/10 bg-white/5 p-3 text-white shadow-sm"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="font-semibold text-white">
                                  {item.className}
                                </p>
                                <p className="text-sm text-slate-300">
                                  GV: {item.teacher?.fullName || "Chưa rõ"}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleJoinFromSearch(item.id)}
                                className="shrink-0 rounded-lg bg-emerald-500 px-3 text-white hover:bg-emerald-600"
                              >
                                Tham gia
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </section>

        {isSearching && searchKeyword.trim() && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
            <Badge
              variant="outline"
              className="border-white/20 bg-white/5 text-white"
            >
              <Search className="mr-1 h-3 w-3" />
              Đang tìm kiếm
            </Badge>
            <span className="text-slate-300">
              Hiển thị kết quả cho “{searchKeyword}”
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="ml-auto text-white hover:bg-white/10"
            >
              Xem tất cả lớp của tôi
            </Button>
          </div>
        )}

        <section className="mt-10 space-y-8">
          {classes.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {classes.map((classItem) => (
                <Card
                  key={classItem.id}
                  className="rounded-[24px] border border-white/10 bg-white/5 text-white transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <CardTitle className="text-xl font-semibold">
                          {classItem.className}
                        </CardTitle>
                        <CardDescription className="text-sm text-slate-300">
                          GV: {classItem.teacher?.fullName || "Chưa rõ"}
                        </CardDescription>
                      </div>
                      <Badge
                        variant="outline"
                        className="rounded-full border-white/30 bg-white/10 text-xs text-emerald-200"
                      >
                        #{classItem.id}
                      </Badge>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-300">
                      <Users className="h-4 w-4 text-emerald-200" />
                      Niên khóa {classItem.schoolYear} • {classItem.semester}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0 text-sm text-slate-200">
                    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                      <span className="text-slate-400">Môn học</span>
                      <span className="font-medium text-white">
                        {classItem.subject?.name || "Chưa rõ"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        href={`/classes/${classItem.id}`}
                        className="flex-1"
                      >
                        <Button className="w-full rounded-xl bg-emerald-500 text-white hover:bg-emerald-600">
                          <Eye className="mr-2 h-4 w-4" />
                          Vào lớp học
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-white/15 bg-white/5 px-6 py-12 text-center text-slate-300">
              <p className="text-lg">
                {isSearching && searchKeyword.trim()
                  ? "Không tìm thấy lớp học nào"
                  : "Chưa tham gia lớp học nào"}
              </p>
              <p className="text-sm text-slate-400">
                {isSearching && searchKeyword.trim()
                  ? "Thử từ khóa khác hoặc tham gia lớp học mới"
                  : "Bắt đầu bằng cách tham gia lớp học đầu tiên"}
              </p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i).map((num) => (
                <Button
                  key={num}
                  variant={num === currentPage ? "default" : "outline"}
                  onClick={() => handlePageChange(num)}
                  className={
                    num === currentPage
                      ? "rounded-full bg-emerald-500 text-white hover:bg-emerald-600"
                      : "rounded-full border-white/30 text-white hover:bg-white/10"
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
