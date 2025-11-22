"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BookOpen,
  Users,
  GraduationCap,
  Calendar,
  FileText,
  Trophy,
  ArrowRight,
  CheckCircle,
  Star,
  Sparkles,
  Zap,
  Shield,
  Globe,
  Heart,
  Brain,
  Target,
  Sparkle,
  Rocket,
  Award,
} from "lucide-react"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [particles, setParticles] = useState<Array<{left: string, top: string, delay: string, duration: string}>>([])

  useEffect(() => {
    setMounted(true)
    setIsVisible(true)
    // Generate random particles only on client to avoid hydration mismatch
    setParticles(
      [...Array(20)].map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
        duration: `${3 + Math.random() * 4}s`,
      }))
    )
  }, [])

  const features = [
    {
      icon: BookOpen,
      title: "Quản lý Lớp học",
      description: "Tạo và quản lý lớp học một cách dễ dàng, theo dõi tiến độ học tập của từng học sinh",
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      bgGradient: "from-emerald-50 to-teal-50",
      delay: "delay-100",
    },
    {
      icon: FileText,
      title: "Bài tập & Kiểm tra",
      description: "Tạo bài tập, trắc nghiệm trực tuyến và chấm điểm tự động, tiết kiệm thời gian",
      gradient: "from-teal-500 via-cyan-500 to-blue-500",
      bgGradient: "from-teal-50 to-cyan-50",
      delay: "delay-200",
    },
    {
      icon: Users,
      title: "Tương tác & Thảo luận",
      description: "Tạo không gian thảo luận, bình luận và hỗ trợ học tập giữa giáo viên và học sinh",
      gradient: "from-cyan-500 via-blue-500 to-indigo-500",
      bgGradient: "from-cyan-50 to-blue-50",
      delay: "delay-300",
    },
    {
      icon: Calendar,
      title: "Thời khóa biểu",
      description: "Quản lý lịch học, lịch thi và các hoạt động giáo dục một cách khoa học",
      gradient: "from-indigo-500 via-purple-500 to-pink-500",
      bgGradient: "from-indigo-50 to-purple-50",
      delay: "delay-400",
    },
    {
      icon: GraduationCap,
      title: "Kết quả học tập",
      description: "Theo dõi điểm số, đánh giá tiến độ và phân tích kết quả học tập chi tiết",
      gradient: "from-purple-500 via-pink-500 to-rose-500",
      bgGradient: "from-purple-50 to-pink-50",
      delay: "delay-500",
    },
    {
      icon: Trophy,
      title: "Bảng xếp hạng",
      description: "Tạo động lực học tập thông qua hệ thống xếp hạng và thành tích",
      gradient: "from-rose-500 via-orange-500 to-amber-500",
      bgGradient: "from-rose-50 to-orange-50",
      delay: "delay-600",
    },
  ]

  const stats = [
    { icon: Users, label: "Người dùng", value: "10,000+", gradient: "from-emerald-500 to-teal-500" },
    { icon: BookOpen, label: "Lớp học", value: "500+", gradient: "from-teal-500 to-cyan-500" },
    { icon: FileText, label: "Bài tập", value: "50,000+", gradient: "from-cyan-500 to-blue-500" },
    { icon: Star, label: "Đánh giá", value: "4.9/5", gradient: "from-blue-500 to-indigo-500" },
  ]

  const benefits = [
    {
      icon: Zap,
      title: "Nhanh chóng & Hiệu quả",
      description: "Giao diện tối ưu giúp tiết kiệm thời gian và nâng cao năng suất",
    },
    {
      icon: Shield,
      title: "Bảo mật Cao",
      description: "Dữ liệu được mã hóa và bảo vệ theo tiêu chuẩn quốc tế",
    },
    {
      icon: Globe,
      title: "Truy cập Mọi lúc",
      description: "Học tập mọi lúc, mọi nơi trên mọi thiết bị",
    },
    {
      icon: Heart,
      title: "Thân thiện",
      description: "Giao diện trực quan, dễ sử dụng cho mọi lứa tuổi",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Animated Background với màu mới */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-emerald-400/30 via-teal-400/30 to-cyan-400/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-teal-400/30 via-cyan-400/30 to-blue-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-cyan-400/20 via-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "4s" }} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        {/* Floating particles với màu mới */}
        {mounted && particles.length > 0 && (
          <div className="absolute inset-0">
            {particles.map((particle, i) => (
              <div
                key={i}
                className="absolute w-1.5 h-1.5 bg-emerald-400/40 rounded-full animate-bounce"
                style={{
                  left: particle.left,
                  top: particle.top,
                  animationDelay: particle.delay,
                  animationDuration: particle.duration,
                  boxShadow: "0 0 6px rgba(16, 185, 129, 0.5)",
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="relative container mx-auto px-4 py-20 lg:py-32 z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge với màu mới */}
          <div
            className={`inline-flex items-center gap-2 bg-white/90 backdrop-blur-md text-emerald-700 px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-xl border border-emerald-200/60 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <Sparkle className="h-4 w-4 text-emerald-500 animate-pulse" />
            Nền tảng học tập thông minh thế hệ mới
          </div>

          {/* Main Heading với gradient mới */}
          <h1
            className={`text-5xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 mb-8 text-balance transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{
              textShadow: "0 0 40px rgba(16, 185, 129, 0.3)",
            }}
          >
            EduSystem
            <span className="block text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mt-4">
              Tương lai của giáo dục
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className={`text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto text-pretty leading-relaxed transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            Kết nối giáo viên và học sinh trong một môi trường học tập tương tác, 
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-semibold"> hiện đại và hiệu quả</span>. 
            Nâng cao chất lượng giáo dục với công nghệ AI tiên tiến.
          </p>

          {/* CTA Buttons với màu mới */}
          <div
            className={`flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 transition-all duration-1000 delay-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <Link href="/auth/login">
              <Button
                size="lg"
                className="w-full sm:w-auto group bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300 relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Bắt đầu học ngay
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-white/90 backdrop-blur-md hover:bg-white hover:scale-105 transition-all duration-300 hover:shadow-xl border-2 border-emerald-300/60 text-emerald-700 hover:text-emerald-800 px-8 py-4 text-lg font-semibold rounded-2xl"
              >
                Tạo tài khoản miễn phí
              </Button>
            </Link>
          </div>

          {/* Stats với design mới */}
          <div
            className={`grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto transition-all duration-1000 delay-800 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  className="text-center group hover:scale-110 transition-all duration-500"
                >
                  <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/60 group-hover:shadow-2xl group-hover:border-emerald-200/80 transition-all duration-500 relative overflow-hidden">
                    {/* Gradient background on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    <div className="relative z-10">
                      <div className={`w-14 h-14 mx-auto mb-4 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <div className={`text-3xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>{stat.value}</div>
                      <div className="text-sm text-gray-600 font-semibold">{stat.label}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Features Section với design mới */}
      <div className="container mx-auto px-4 py-24 relative z-10">
        <div
          className={`text-center mb-20 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 mb-6 text-balance">
            Tính năng nổi bật
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto text-pretty leading-relaxed">
            Khám phá những công cụ mạnh mẽ giúp nâng cao trải nghiệm học tập và giảng dạy
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className={`group hover:shadow-2xl transition-all duration-700 border-0 bg-white/90 backdrop-blur-md hover:bg-white hover:scale-105 hover:-translate-y-4 cursor-pointer overflow-hidden relative ${isVisible ? `opacity-100 translate-y-0 ${feature.delay}` : "opacity-0 translate-y-8"}`}
              >
                <div className="relative">
                  {/* Gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  
                  <CardHeader className="space-y-6 p-8 relative z-10">
                    <div
                      className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-2xl relative`}
                    >
                      <Icon className="h-10 w-10 text-white group-hover:scale-110 transition-transform duration-300" />
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500`} />
                    </div>
                    <div>
                      <CardTitle className="text-2xl mb-4 bg-gradient-to-r from-gray-800 to-gray-600 group-hover:from-emerald-600 group-hover:to-teal-600 bg-clip-text text-transparent transition-all duration-300 font-bold">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-base leading-relaxed text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                        {feature.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Benefits Section với màu mới */}
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 right-20 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-teal-200/20 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div
            className={`text-center mb-20 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 mb-6 text-balance">
              Tại sao chọn EduSystem?
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto text-pretty leading-relaxed">
              Những lý do khiến hàng nghìn giáo viên và học sinh tin tưởng sử dụng
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div
                  key={index}
                  className={`text-center group hover:scale-110 transition-all duration-500 ${isVisible ? `opacity-100 translate-y-0 delay-${index * 100}` : "opacity-0 translate-y-8"}`}
                >
                  <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/60 group-hover:shadow-2xl group-hover:border-emerald-200/80 transition-all duration-500 relative overflow-hidden">
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg relative">
                        <Icon className="h-8 w-8 text-white relative z-10" />
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:to-teal-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
