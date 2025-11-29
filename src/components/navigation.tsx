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
      <nav className="bg-slate-900/80 backdrop-blur-xl shadow-2xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo Section */}
            <div className="flex items-center">
              <Link
                href="/dashboard"
                className="flex-shrink-0 flex items-center group"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Image
                    src="/images/logo.png"
                    alt="Logo"
                    width={40}
                    height={40}
                    className="relative group-hover:scale-110 transition-transform duration-300 rounded-full"
                  />
                </div>
                <span className="ml-3 text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  EduSystem
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                const colorMap: { [key: string]: string } = {
                  blue: "from-blue-500 to-cyan-500",
                  green: "from-emerald-500 to-teal-500",
                  purple: "from-purple-500 to-pink-500",
                  yellow: "from-amber-500 to-orange-500",
                  red: "from-red-500 to-rose-500",
                  orange: "from-orange-500 to-amber-500",
                };
                const gradient = colorMap[item.color] || "from-emerald-500 to-teal-500";
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? `bg-gradient-to-r ${gradient} text-white shadow-lg`
                        : "text-slate-300 hover:text-white hover:bg-white/10"
                    }`}
                    style={isActive ? { boxShadow: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(16, 185, 129, 0.3)` } : {}}
                  >
                    <Icon className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                    {item.label}
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-lg" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              {/* Search Button */}
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex items-center gap-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl border border-white/10"
              >
                <Search className="h-4 w-4" />
                <span className="text-sm">Tìm kiếm</span>
              </Button>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                className="relative text-slate-300 hover:text-white hover:bg-white/10 rounded-xl border border-white/10"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center ring-2 ring-slate-900">
                  <span className="text-xs text-white font-bold">3</span>
                </span>
              </Button>

              {/* Dark Mode Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="text-slate-300 hover:text-white hover:bg-white/10 rounded-xl border border-white/10"
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
                    <Avatar className="h-10 w-10 cursor-pointer ring-2 ring-emerald-500/50 hover:ring-emerald-400 transition-all duration-300">
                      <AvatarImage
                        src={user.avatarBase64 || undefined}
                        alt={user.username}
                      />
                      <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold">
                        {user.username?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 p-4 bg-slate-900/95 border border-white/10 backdrop-blur-xl" align="end">
                  <div className="flex flex-col gap-3 p-2">
                    <div className="text-center">
                      <p className="font-semibold text-lg text-white">{user.fullName}</p>
                      <p className="truncate text-sm text-slate-400">
                        {user.email}
                      </p>
                      <div className="inline-flex items-center gap-1 mt-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            currentRole === "teacher"
                              ? "bg-emerald-500"
                              : "bg-blue-500"
                          }`}
                        />
                        <p className="text-xs font-medium text-slate-300">
                          {currentRole === "teacher" ? "Giáo viên" : "Học sinh"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-white/10 pt-2">
                    <DropdownMenuItem
                      onClick={() => setIsProfileModalOpen(true)}
                      className="cursor-pointer rounded-lg hover:bg-white/10 text-white transition-colors duration-200"
                    >
                      <CircleUser className="mr-3 h-4 w-4" />
                      Xem hồ sơ
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-white/10 text-white transition-colors duration-200">
                      <Settings className="mr-3 h-4 w-4" />
                      Cài đặt
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={logout}
                      className="cursor-pointer rounded-lg hover:bg-red-500/20 text-red-400 transition-colors duration-200"
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
                className="md:hidden ml-2 hover:bg-white/10 rounded-xl border border-white/10 text-slate-300 hover:text-white"
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
          <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-white/10">
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                const colorMap: { [key: string]: string } = {
                  blue: "from-blue-500 to-cyan-500",
                  green: "from-emerald-500 to-teal-500",
                  purple: "from-purple-500 to-pink-500",
                  yellow: "from-amber-500 to-orange-500",
                  red: "from-red-500 to-rose-500",
                  orange: "from-orange-500 to-amber-500",
                };
                const gradient = colorMap[item.color] || "from-emerald-500 to-teal-500";
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                      isActive
                        ? `bg-gradient-to-r ${gradient} text-white shadow-lg`
                        : "text-slate-300 hover:text-white hover:bg-white/10"
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
