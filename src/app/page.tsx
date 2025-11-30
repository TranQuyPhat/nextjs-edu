"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ArrowRight,
  Brain,
  Calendar,
  CheckCircle,
  Cloud,
  Compass,
  FileText,
  Globe,
  GraduationCap,
  Heart,
  Layers,
  LineChart,
  MessageSquare,
  MonitorSmartphone,
  PieChart,
  Shield,
  Sparkles,
  Target,
  Trophy,
  Users,
  Zap,
} from "lucide-react"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const heroStats = [
    { icon: Users, label: "Người dùng", value: "10,000+", detail: "Giáo viên & học sinh" },
    { icon: GraduationCap, label: "Khóa học", value: "1,200+", detail: "đã số hóa" },
    { icon: Trophy, label: "Đánh giá", value: "4.9/5", detail: "từ cộng đồng" },
  ]

  const primaryFeatures = [
    {
      icon: Layers,
      title: "Không gian học tập module",
      description: "Tổ chức lớp, bài tập, nội dung số trong cùng một trải nghiệm thống nhất.",
      pill: "All-in-one",
    },
    {
      icon: MessageSquare,
      title: "Tương tác thời gian thực",
      description: "Chat, nhận xét, phản hồi trực tiếp ngay trong mỗi hoạt động giảng dạy.",
      pill: "Realtime",
    },
    {
      icon: MonitorSmartphone,
      title: "Thiết kế đa nền tảng",
      description: "Giao diện đáp ứng hoàn hảo trên mọi độ phân giải, từ di động đến desktop.",
      pill: "Responsive",
    },
  ]

  const secondaryFeatures = [
    {
      icon: PieChart,
      title: "Báo cáo thông minh",
      description: "Nắm bắt tiến độ, tỷ lệ hoàn thành và KPI theo từng cá nhân hoặc lớp.",
    },
    {
      icon: Calendar,
      title: "Lịch học hợp nhất",
      description: "Kết dính mọi bài thi, lịch dạy, sự kiện vào một timeline thông minh.",
    },
    {
      icon: FileText,
      title: "Kho học liệu sống",
      description: "Tích hợp tài liệu, câu hỏi, video, ghi chú với bộ lọc mạnh mẽ.",
    },
    {
      icon: CheckCircle,
      title: "Tự động hóa chấm điểm",
      description: "Giảm 70% thời gian chấm nhờ AI và workflow được lập trình sẵn.",
    },
  ]

  const workflowSteps = [
    {
      title: "Thiết kế nội dung",
      description: "Soạn giáo án, quiz, media kéo-thả trong trình dựng thông minh.",
      icon: Sparkles,
    },
    {
      title: "Triển khai cho lớp",
      description: "Giao nhiệm vụ, lịch học, tài nguyên chỉ với vài cú nhấp.",
      icon: Target,
    },
    {
      title: "Theo dõi & tối ưu",
      description: "Biểu đồ realtime, cảnh báo và gợi ý cải thiện dựa trên dữ liệu.",
      icon: LineChart,
    },
  ]

  const testimonials = [
    {
      quote:
        "EduSystem giúp trường tôi chuyển đổi số chỉ trong 6 tuần. Giáo viên không cần học thêm công cụ mới nhưng hiệu quả tăng thấy rõ.",
      author: "Thầy Minh • Hiệu phó THPT Trần Hưng Đạo",
    },
    {
      quote:
        "Lớp học trở nên tương tác hơn, học sinh hào hứng vì mọi thứ rất trực quan và có gamification kèm theo.",
      author: "Cô Hạnh • Giáo viên Toán",
    },
  ]

  const ctaHighlights = [
    { icon: Shield, label: "Mã hóa chuẩn OWASP" },
    { icon: Globe, label: "Hạ tầng đa vùng" },
    { icon: Cloud, label: "Tích hợp sẵn Google Workspace" },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-blue-500/30 via-slate-900 to-slate-950 blur-3xl" />
        <div className="absolute -right-32 top-40 h-72 w-72 rounded-full bg-purple-600/30 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute inset-0 opacity-40">
          {[...Array(45)].map((_, index) => (
            <span
              key={index}
              className="absolute h-1 w-1 rounded-full bg-cyan-300/40"
              style={{
                left: `${(index * 47) % 100}%`,
                top: `${(index * 23) % 100}%`,
                animation: `pulse 6s ease-in-out ${index * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative isolate">
        <section className="container mx-auto grid gap-16 px-6 pb-24 pt-28 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className={`space-y-10 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <span className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-blue-200 shadow-lg shadow-blue-500/20 backdrop-blur-lg">
              <Sparkles className="h-4 w-4 text-cyan-300" />
              Trải nghiệm học tập thế hệ mới
            </span>
            <div>
              <p className="text-sm uppercase tracking-[0.6em] text-slate-400">EduSystem • Platform 2.0</p>
              <h1 className="mt-6 text-4xl font-black leading-tight text-white md:text-6xl xl:text-7xl">
                Thiết kế hành trình học tập đột phá với công nghệ và dữ liệu.
              </h1>
            </div>
            <p className="text-lg leading-relaxed text-slate-300 md:text-xl">
              Bộ công cụ hợp nhất giúp giáo viên tạo nội dung, giao bài, theo dõi tiến độ và tương tác đa chiều. Tất cả được tinh chỉnh với AI để mỗi tiết học trở nên đáng nhớ.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/auth/login" className="flex-1">
                <Button className="group w-full rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 px-8 py-6 text-lg font-semibold shadow-2xl shadow-blue-500/50 transition hover:scale-[1.01]">
                  Bắt đầu ngay
                  <ArrowRight className="ml-2 h-5 w-5 transition group-hover:translate-x-1.5" />
                </Button>
              </Link>
              <Link href="/auth/register" className="flex-1">
                <Button variant="outline" className="w-full rounded-2xl border-white/20 bg-white/5 px-8 py-6 text-lg text-white backdrop-blur-xl transition hover:bg-white/10">
                  Tạo tài khoản miễn phí
                </Button>
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {heroStats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className={`rounded-2xl border border-white/5 bg-white/5 p-5 backdrop-blur-xl ${isVisible ? `delay-${index * 100}` : ""}`}>
                    <Icon className="mb-3 h-6 w-6 text-cyan-300" />
                    <p className="text-3xl font-semibold text-white">{stat.value}</p>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                    <p className="text-xs text-slate-500">{stat.detail}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[40px] bg-gradient-to-tr from-cyan-500/40 to-purple-500/40 blur-3xl" />
            <Card className="relative rounded-[32px] border-white/10 bg-slate-900/60 p-8 text-left text-white shadow-2xl backdrop-blur-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Trạng thái lớp</p>
                  <p className="text-3xl font-semibold text-white">Đã đồng bộ</p>
                </div>
                <div className="rounded-2xl bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-300">Realtime</div>
              </div>
              <div className="mt-10 grid gap-6">
                <div className="rounded-2xl border border-white/5 bg-white/5 p-6">
                  <p className="text-sm text-slate-400">Tỉ lệ hoàn thành</p>
                  <p className="text-4xl font-bold text-white">92%</p>
                  <div className="mt-4 h-2 rounded-full bg-white/10">
                    <div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: "92%" }} />
                  </div>
                </div>
                <div className="space-y-4 rounded-2xl border border-white/5 bg-white/5 p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Bài tập cần chấm</span>
                    <span className="text-sm font-semibold text-cyan-300">-68% so với tuần trước</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-slate-300">
                    <div>
                      <p className="text-2xl font-semibold text-white">14</p>
                      <p className="text-slate-500">Trắc nghiệm</p>
                    </div>
                    <div>
                      <p className="text-2xl font-semibold text-white">6</p>
                      <p className="text-slate-500">Tự luận</p>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 p-4 text-sm text-emerald-200">
                    AI đã đề xuất 3 gợi ý phản hồi cho học sinh.
                  </div>
                </div>
              </div>
              <div className="mt-10 flex items-center gap-3 text-sm text-slate-400">
                <Brain className="h-4 w-4 text-cyan-300" />
                Đồng bộ cùng hơn 500 lớp học đang hoạt động
              </div>
            </Card>
          </div>
        </section>

        <section className="container mx-auto px-6 pb-20">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-blue-300">Feature spotlight</p>
              <h2 className="mt-4 text-3xl font-black text-white md:text-5xl">
                Tái định nghĩa quản trị lớp học với trải nghiệm hiện đại và tối giản.
              </h2>
            </div>
            <p className="text-lg text-slate-300 lg:max-w-xl">
              Mỗi tính năng được thiết kế dựa trên hành vi thực tế của giáo viên, học sinh, đảm bảo mọi thao tác đều trực quan và có thể tùy biến.
            </p>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="grid gap-8 rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-950/80 p-10 shadow-2xl backdrop-blur-3xl">
              {primaryFeatures.map((feature) => {
                const Icon = feature.icon
                return (
                  <div key={feature.title} className="flex flex-col gap-4 rounded-3xl border border-white/5 bg-white/5 p-6 transition hover:bg-white/10">
                    <div className="flex items-center gap-4">
                      <div className="rounded-2xl bg-blue-500/20 p-3 text-blue-200">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-300">
                        {feature.pill}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-white">{feature.title}</h3>
                      <p className="mt-2 text-slate-300">{feature.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="grid gap-6">
              {secondaryFeatures.map((feature) => {
                const Icon = feature.icon
                return (
                  <Card key={feature.title} className="rounded-3xl border-white/5 bg-white/5 p-6 text-white backdrop-blur-2xl">
                    <div className="flex items-center gap-4">
                      <div className="rounded-2xl bg-purple-500/20 p-3 text-purple-200">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h4 className="text-lg font-semibold">{feature.title}</h4>
                    </div>
                    <p className="mt-3 text-sm text-slate-300">{feature.description}</p>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 pb-24">
          <div className="rounded-[36px] border border-white/5 bg-gradient-to-br from-blue-950 via-slate-950 to-purple-950 p-10 shadow-2xl">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.4em] text-cyan-300">Hành trình triển khai</p>
                <h2 className="mt-4 text-4xl font-black text-white">3 bước để dựng một lớp học hoàn chỉnh</h2>
              </div>
              <Link href="/auth/register">
                <Button className="rounded-2xl bg-white/10 px-6 py-5 text-base text-white backdrop-blur-xl transition hover:bg-white/20">
                  Bắt đầu bản thử nghiệm
                </Button>
              </Link>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {workflowSteps.map((step, index) => {
                const Icon = step.icon
                return (
                  <div key={step.title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>Bước {index + 1}</span>
                      <Icon className="h-5 w-5 text-cyan-300" />
                    </div>
                    <h3 className="mt-6 text-2xl font-semibold text-white">{step.title}</h3>
                    <p className="mt-3 text-slate-300">{step.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="container mx-auto grid gap-10 px-6 pb-24 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-10 text-white backdrop-blur-3xl">
            <span className="text-sm font-semibold uppercase tracking-[0.4em] text-purple-200">Niềm tin từ cộng đồng</span>
            <h2 className="mt-4 text-3xl font-black md:text-4xl">Những câu chuyện thành công.</h2>
            <div className="mt-10 space-y-8">
              {testimonials.map((item) => (
                <div key={item.author} className="rounded-3xl border border-white/5 bg-white/5 p-6">
                  <p className="text-lg text-slate-200">“{item.quote}”</p>
                  <p className="mt-4 text-sm font-semibold text-white">{item.author}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[32px] border border-white/5 bg-gradient-to-br from-slate-900 to-slate-950 p-10 text-white shadow-2xl">
            <div className="flex items-center gap-3 text-sm uppercase tracking-[0.4em] text-slate-400">
              <Compass className="h-4 w-4" />
              Trải nghiệm trực quan
            </div>
            <h3 className="mt-6 text-3xl font-bold">Khám phá một dashboard sống động.</h3>
            <p className="mt-4 text-slate-300">
              Bố cục mới giúp bạn điều hướng giữa nhiều module mà không bị rối mắt. Các vùng nội dung đều có khoảng thở và chiều sâu riêng.
            </p>
            <div className="mt-10 space-y-6">
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <Cloud className="h-5 w-5 text-cyan-300" />
                Đồng bộ cloud tức thì cho mọi bài tập và tài liệu.
              </div>
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <Zap className="h-5 w-5 text-yellow-300" />
                Workflow tự động nhắc deadline và đề xuất phản hồi.
              </div>
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <Heart className="h-5 w-5 text-rose-300" />
                UI thân thiện, phù hợp cho cả giáo viên mới làm quen công nghệ.
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 pb-28">
          <div className="relative overflow-hidden rounded-[36px] border border-white/5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-10 text-white shadow-2xl">
            <div className="absolute -right-12 top-10 h-48 w-48 rounded-full bg-white/20 blur-3xl" />
            <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm uppercase tracking-[0.4em] text-white/70">Sẵn sàng xuất phát</p>
                <h2 className="mt-4 text-4xl font-black md:text-5xl">Tạo lớp đầu tiên chỉ trong 5 phút.</h2>
                <p className="mt-4 text-lg text-white/80">
                  Đội ngũ của chúng tôi sẽ đồng hành để giúp bạn chuyển đổi dữ liệu, đào tạo giáo viên và thiết lập chuẩn bảo mật.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {ctaHighlights.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="flex items-center gap-3 rounded-2xl bg-white/15 px-4 py-3 text-sm font-semibold">
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/auth/register" className="flex-1">
                <Button className="w-full rounded-2xl bg-white px-8 py-6 text-lg font-semibold text-slate-900">
                  Dùng thử miễn phí 30 ngày
                </Button>
              </Link>
              <Link href="/auth/login" className="flex-1">
                <Button variant="outline" className="w-full rounded-2xl border-white/40 bg-white/20 px-8 py-6 text-lg text-white hover:bg-white/30">
                  Đăng nhập ngay
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}




