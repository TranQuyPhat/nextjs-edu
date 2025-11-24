"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BookOpen,
  Users,
  Calendar,
  Trophy,
  GraduationCap,
  Home,
  LogOut,
  Menu,
  X,
  CircleUser,
  Moon,
  Sun,
  Settings,
  Bell,
  Search,
} from "lucide-react";
import Image from "next/image";
import ProfileModal from "./profile-modal";
import { useAuth } from "@/app/auth/hook/useAuth";

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { logout } = useAuth();
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    else router.push("/auth/login");
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    router.push("/auth/login");
  };

  const handleUserUpdate = (updatedUser: any) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const teacherNavItems = [
    {
      href: "/dashboard/teacher",
      label: "Trang chủ",
      icon: Home,
      color: "blue",
    },
    {
      href: "/classes/teacher",
      label: "Quản lý lớp",
      icon: Users,
      color: "green",
    },
    {
      href: "/quizzes/teacher",
      label: "Trắc nghiệm",
      icon: BookOpen,
      color: "purple",
    },
    {
      href: "/grades/teacher",
      label: "Xếp hạng",
      icon: Trophy,
      color: "yellow",
    },
  ];

  const studentNavItems = [
    {
      href: "/dashboard/student",
      label: "Trang chủ",
      icon: Home,
      color: "blue",
    },
    { href: "/classes/student", label: "Lớp học", icon: Users, color: "green" },
    {
      href: "/quizzes/student",
      label: "Trắc nghiệm",
      icon: BookOpen,
      color: "purple",
    },
    {
      href: "/grades/student",
      label: "Kết quả",
      icon: GraduationCap,
      color: "red",
    },
    {
      href: "/schedule/student",
      label: "Thời khóa biểu",
      icon: Calendar,
      color: "orange",
    },
  ];

  const currentRole = user?.roles?.includes("teacher") ? "teacher" : "student";
  const navItems =
    currentRole === "teacher" ? teacherNavItems : studentNavItems;

  if (!user) return null;

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo Section */}
            <div className="flex items-center">
              <Link
                href="/dashboard"
                className="flex-shrink-0 flex items-center group"
              >
                <div className="relative">
                  <Image
                    src="/images/logo.png"
                    alt="Logo"
                    width={40}
                    height={40}
                    className="group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                </div>
                <span className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  EduSystem
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? `bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 text-white shadow-lg`
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100/80"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                    {item.label}
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-xl"
              >
                <Search className="h-4 w-4" />
                <span className="text-sm">Tìm kiếm</span>
              </Button>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                className="relative text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-xl"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">3</span>
                </span>
              </Button>

              {/* Dark Mode Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-xl"
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>

              {/* User Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full hover:scale-105 transition-transform duration-300"
                  >
                    <Avatar className="h-10 w-10 cursor-pointer ring-2 ring-blue-200 hover:ring-blue-400 transition-all duration-300">
                      <AvatarImage
                        src={user.avatarBase64 || undefined}
                        alt={user.username}
                      />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                        {user.username?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 p-4" align="end">
                  <div className="flex flex-col gap-3 p-2">
                    <div className="text-center">
                      <p className="font-semibold text-lg">{user.fullName}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                      <div className="inline-flex items-center gap-1 mt-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            currentRole === "teacher"
                              ? "bg-green-500"
                              : "bg-blue-500"
                          }`}
                        />
                        <p className="text-xs font-medium text-gray-600">
                          {currentRole === "teacher" ? "Giáo viên" : "Học sinh"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t pt-2">
                    <DropdownMenuItem
                      onClick={() => setIsProfileModalOpen(true)}
                      className="cursor-pointer rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                      <CircleUser className="mr-3 h-4 w-4" />
                      Xem hồ sơ
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-gray-100 transition-colors duration-200">
                      <Settings className="mr-3 h-4 w-4" />
                      Cài đặt
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={logout}
                      className="cursor-pointer rounded-lg hover:bg-red-50 text-red-600 transition-colors duration-200"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Đăng xuất
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                className="md:hidden ml-2 hover:bg-gray-100/80 rounded-xl"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/50">
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                      isActive
                        ? `bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 text-white shadow-lg`
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100/80"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        onUserUpdate={handleUserUpdate}
      />
    </>
  );
}
