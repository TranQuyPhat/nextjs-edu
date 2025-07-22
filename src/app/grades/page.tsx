"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, TrendingDown, Award, BookOpen, FileText, Target } from "lucide-react"

export default function GradesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  const [grades] = useState([
    {
      id: 1,
      subject: "Toán học",
      className: "Toán 12A1",
      assignments: [
        { name: "Bài tập Chương 1", grade: 8.5, maxGrade: 10, type: "assignment", date: "2024-01-15" },
        { name: "Kiểm tra 15 phút", grade: 9.0, maxGrade: 10, type: "quiz", date: "2024-01-18" },
        { name: "Bài tập Chương 2", grade: 7.5, maxGrade: 10, type: "assignment", date: "2024-01-20" },
        { name: "Kiểm tra giữa kỳ", grade: 8.8, maxGrade: 10, type: "exam", date: "2024-01-22" },
      ],
      average: 8.45,
      trend: "up",
    },
    {
      id: 2,
      subject: "Vật lý",
      className: "Vật lý 12A1",
      assignments: [
        { name: "Bài tập Động học", grade: 7.0, maxGrade: 10, type: "assignment", date: "2024-01-16" },
        { name: "Thí nghiệm 1", grade: 8.5, maxGrade: 10, type: "lab", date: "2024-01-19" },
        { name: "Kiểm tra 1 tiết", grade: 8.2, maxGrade: 10, type: "exam", date: "2024-01-21" },
      ],
      average: 7.9,
      trend: "up",
    },
    {
      id: 3,
      subject: "Hóa học",
      className: "Hóa 12A1",
      assignments: [
        { name: "Bài tập Hóa hữu cơ", grade: 9.0, maxGrade: 10, type: "assignment", date: "2024-01-17" },
        { name: "Thí nghiệm 2", grade: 8.0, maxGrade: 10, type: "lab", date: "2024-01-20" },
        { name: "Kiểm tra 15 phút", grade: 8.5, maxGrade: 10, type: "quiz", date: "2024-01-23" },
      ],
      average: 8.5,
      trend: "stable",
    },
  ])

  const [overallStats] = useState({
    totalAssignments: 10,
    completedAssignments: 10,
    averageGrade: 8.28,
    rank: 5,
    totalStudents: 35,
    improvement: "+0.3",
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      setUser(user)
      if (user.role === "student") {
        router.push("/grades/student")
      } else {
        router.push("/grades/teacher") // Teachers don't have grades page
      }
    } else {
      router.push("/auth/login")
    }
  }, [router])

  const getGradeBadge = (grade: number, maxGrade: number) => {
    const percentage = (grade / maxGrade) * 100
    if (percentage >= 90) return <Badge className="bg-green-500">Xuất sắc</Badge>
    if (percentage >= 80) return <Badge className="bg-blue-500">Giỏi</Badge>
    if (percentage >= 65) return <Badge className="bg-yellow-500">Khá</Badge>
    if (percentage >= 50) return <Badge className="bg-orange-500">Trung bình</Badge>
    return <Badge variant="destructive">Yếu</Badge>
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "assignment":
        return <FileText className="h-4 w-4" />
      case "quiz":
        return <BookOpen className="h-4 w-4" />
      case "exam":
        return <Target className="h-4 w-4" />
      case "lab":
        return <Award className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getTypeName = (type: string) => {
    switch (type) {
      case "assignment":
        return "Bài tập"
      case "quiz":
        return "Trắc nghiệm"
      case "exam":
        return "Kiểm tra"
      case "lab":
        return "Thí nghiệm"
      default:
        return "Khác"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <div className="h-4 w-4" />
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang chuyển hướng...</p>
        </div>
      </div>
    )
  }

  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Điểm trung bình</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.averageGrade}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{overallStats.improvement}</span> từ kỳ trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Xếp hạng lớp</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#{overallStats.rank}</div>
            <p className="text-xs text-muted-foreground">Trong {overallStats.totalStudents} học sinh</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bài tập hoàn thành</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overallStats.completedAssignments}/{overallStats.totalAssignments}
            </div>
            <Progress
              value={(overallStats.completedAssignments / overallStats.totalAssignments) * 100}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Môn học</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{grades.length}</div>
            <p className="text-xs text-muted-foreground">Đang theo học</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tiến độ theo môn học</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {grades.map((subject) => (
              <div key={subject.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">{subject.subject}</p>
                    <p className="text-sm text-muted-foreground">{subject.assignments.length} bài tập</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold">{subject.average}</span>
                  {getTrendIcon(subject.trend)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bài tập gần đây</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {grades
              .flatMap((subject) =>
                subject.assignments.map((assignment) => ({
                  ...assignment,
                  subject: subject.subject,
                })),
              )
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 5)
              .map((assignment, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon(assignment.type)}
                    <div>
                      <p className="font-medium">{assignment.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {assignment.subject} • {assignment.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">
                      {assignment.grade}/{assignment.maxGrade}
                    </span>
                    {getGradeBadge(assignment.grade, assignment.maxGrade)}
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const SubjectGradesTab = () => (
    <div className="space-y-6">
      {grades.map((subject) => (
        <Card key={subject.id}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl">{subject.subject}</CardTitle>
                <CardDescription>{subject.className}</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{subject.average}</div>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">Điểm TB</span>
                  {getTrendIcon(subject.trend)}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bài tập</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Điểm</TableHead>
                  <TableHead>Đánh giá</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subject.assignments.map((assignment, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{assignment.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(assignment.type)}
                        <span className="text-sm">{getTypeName(assignment.type)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{assignment.date}</TableCell>
                    <TableCell className="font-bold">
                      {assignment.grade}/{assignment.maxGrade}
                    </TableCell>
                    <TableCell>{getGradeBadge(assignment.grade, assignment.maxGrade)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const StatisticsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Phân bố điểm số</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Xuất sắc (9-10)</span>
                <div className="flex items-center gap-2">
                  <Progress value={30} className="w-20" />
                  <span className="text-sm font-medium">30%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Giỏi (8-8.9)</span>
                <div className="flex items-center gap-2">
                  <Progress value={50} className="w-20" />
                  <span className="text-sm font-medium">50%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Khá (6.5-7.9)</span>
                <div className="flex items-center gap-2">
                  <Progress value={20} className="w-20" />
                  <span className="text-sm font-medium">20%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Trung bình (5-6.4)</span>
                <div className="flex items-center gap-2">
                  <Progress value={0} className="w-20" />
                  <span className="text-sm font-medium">0%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thống kê theo loại bài</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">Bài tập</span>
                </div>
                <span className="font-medium">8.0</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-sm">Trắc nghiệm</span>
                </div>
                <span className="font-medium">8.75</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span className="text-sm">Kiểm tra</span>
                </div>
                <span className="font-medium">8.5</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  <span className="text-sm">Thí nghiệm</span>
                </div>
                <span className="font-medium">8.25</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Xu hướng điểm số theo thời gian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-2" />
              <p>Biểu đồ xu hướng điểm số</p>
              <p className="text-sm">Sẽ được cập nhật trong phiên bản tiếp theo</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Kết quả học tập</h1>
          <p className="text-gray-600">Theo dõi điểm số và tiến độ học tập của bạn</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="subjects">Theo môn học</TabsTrigger>
            <TabsTrigger value="statistics">Thống kê</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="subjects">
            <SubjectGradesTab />
          </TabsContent>

          <TabsContent value="statistics">
            <StatisticsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
