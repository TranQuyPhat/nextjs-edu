"use client"

import Link from 'next/link'
import React from 'react'
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  Heart,
  ArrowUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <footer className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden" suppressHydrationWarning>
            {/* Background Effects */}
            <div className="absolute inset-0" suppressHydrationWarning>
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" suppressHydrationWarning />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" suppressHydrationWarning />
            </div>

            <div className="relative container mx-auto px-4 py-16" suppressHydrationWarning>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12" suppressHydrationWarning>
                    {/* Company Info */}
                    <div className="space-y-6" suppressHydrationWarning>
                        <div className="flex items-center space-x-3" suppressHydrationWarning>
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center" suppressHydrationWarning>
                                <span className="text-white font-bold text-lg">E</span>
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                EduSystem
                            </span>
                        </div>
                        <p className="text-gray-300 leading-relaxed max-w-sm">
                            Nền tảng học tập thông minh, kết nối giáo viên và học sinh trong môi trường giáo dục hiện đại và hiệu quả.
                        </p>
                        <div className="flex space-x-4" suppressHydrationWarning>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl">
                                <Facebook className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl">
                                <Twitter className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl">
                                <Instagram className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl">
                                <Linkedin className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6" suppressHydrationWarning>
                        <h3 className="text-xl font-bold text-white">Liên kết nhanh</h3>
                        <div className="space-y-3" suppressHydrationWarning>
                            <Link href="/" className="block text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-2 transform">
                                Trang chủ
                            </Link>
                            <Link href="/auth/login" className="block text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-2 transform">
                                Đăng nhập
                            </Link>
                            <Link href="/auth/register" className="block text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-2 transform">
                                Đăng ký
                            </Link>
                            <Link href="/dashboard" className="block text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-2 transform">
                                Dashboard
                            </Link>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-6" suppressHydrationWarning>
                        <h3 className="text-xl font-bold text-white">Tính năng</h3>
                        <div className="space-y-3" suppressHydrationWarning>
                            <Link href="/classes" className="block text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-2 transform">
                                Quản lý lớp học
                            </Link>
                            <Link href="/quizzes" className="block text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-2 transform">
                                Trắc nghiệm
                            </Link>
                            <Link href="/grades" className="block text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-2 transform">
                                Điểm số
                            </Link>
                            <Link href="/schedule" className="block text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-2 transform">
                                Thời khóa biểu
                            </Link>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6" suppressHydrationWarning>
                        <h3 className="text-xl font-bold text-white">Liên hệ</h3>
                        <div className="space-y-4" suppressHydrationWarning>
                            <div className="flex items-center space-x-3 text-gray-300" suppressHydrationWarning>
                                <Mail className="h-5 w-5 text-blue-400" />
                                <span>support@edusystem.com</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-300" suppressHydrationWarning>
                                <Phone className="h-5 w-5 text-blue-400" />
                                <span>+84 123 456 789</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-300" suppressHydrationWarning>
                                <MapPin className="h-5 w-5 text-blue-400" />
                                <span>Hà Nội, Việt Nam</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-700 pt-8" suppressHydrationWarning>
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0" suppressHydrationWarning>
                        <div className="flex items-center space-x-2 text-gray-400" suppressHydrationWarning>
                            <span>© {new Date().getFullYear()} EduSystem. Made with</span>
                            <Heart className="h-4 w-4 text-red-500 animate-pulse" />
                            <span>in Vietnam</span>
                        </div>
                        <div className="flex items-center space-x-6 text-sm text-gray-400" suppressHydrationWarning>
                            <Link href="/privacy" className="hover:text-white transition-colors duration-300">
                                Chính sách bảo mật
                            </Link>
                            <Link href="/terms" className="hover:text-white transition-colors duration-300">
                                Điều khoản sử dụng
                            </Link>
                            <Link href="/help" className="hover:text-white transition-colors duration-300">
                                Trợ giúp
                            </Link>
                        </div>
                        <Button
                            onClick={scrollToTop}
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
                        >
                            <ArrowUp className="h-4 w-4 mr-2" />
                            Lên đầu trang
                        </Button>
                    </div>
                </div>
            </div>
        </footer>
    )
}