"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  Crown,
  Medal,
  Award,
  BookOpen,
  Target,
  AlertCircle,
  CheckCircle,
} from "lucide-react"

export default function TeacherGradesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [selectedClass, setSelectedClass] = useState("all")
  const [selectedSubject, setSelectedSubject] = useState("all")

  // Mock data for students and grades
  const [students] = useState([
    {
      id: 1,
      name: "Nguyễn Văn An",
      email: "an@student.com",
      class: "Toán 12A1",
      avgGrade: 9.2,
      trend: "up",
      completionRate: 95,
      subjects: {
        math: 9.2,
        literature: 8.8,
        english: 9.0,
      },
    },
    {
      id: 2,
      name: "Trần Thị Bình",
      email: "binh@student.com",
      class: "Toán 12A1",
      avgGrade: 8.9,
      trend: "up",
      completionRate: 92,
      subjects: {
        math: 8.9,
        literature: 9.1,
        english: 8.7,
      },
    },
    {
      id: 3,
      name: "Lê Văn Cường",
      email: "cuong@student.com",
      class: "Văn 12A1",
      avgGrade: 8.7,
      trend: "stable",
      completionRate: 88,
      subjects: {
        math: 8.2,
        literature: 9.5,
        english: 8.4,
      },
    },
    {
      id: 4,
      name: "Phạm Thị Dung",
      email: "dung@student.com",
      class: "Toán 12A1",
      avgGrade: 8.5,
      trend: "up",
      completionRate: 90,
      subjects: {
        math: 8.8,
        literature: 8.0,
        english: 8.7,
      },
    },
    {
      id: 5,
      name: "Hoàng Văn Em",
      email: "em@student.com",
      class: "Văn 12A1",
      avgGrade: 7.8,
      trend: "down",
      completionRate: 75,
      subjects: {
        math: 7.5,
        literature: 8.2,
        english: 7.7,
      },
    },
    {
      id: 6,
      name: "Võ Thị Phương",
      email: "phuong@student.com",
      class: "Toán 11B2",
      avgGrade: 9.5,
      trend: "up",
      completionRate: 98,
      subjects: {
        math: 9.8,
        literature: 9.0,
        english: 9.7,
      },
    },
    {
      id: 7,
      name: "Đặng Văn Quang",
      email: "quang@student.com",
      class: "Toán 11B2",
      avgGrade: 6.8,
      trend: "down",
      completionRate: 65,
      subjects: {
        math: 6.5,
        literature: 7.2,
        english: 6.7,
      },
    },
  ])

  const [classes] = useState([
    { id: "all", name: "Tất cả lớp", avgGrade: 8.5, studentCount: 7 },
    { id: "math12a1", name: "Toán 12A1", avgGrade: 8.9, studentCount: 3 },
    { id: "lit12a1", name: "Văn 12A1", avgGrade: 8.3, studentCount: 2 },
    { id: "math11b2", name: "Toán 11B2", avgGrade: 8.2, studentCount: 2 },
  ])

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)

      // Redirect if not teacher
      if (parsedUser.role !== "teacher") {
        router.push("/grades/student")
        return
      }
    } else {
      router.push("/auth/login")
    }
  }, [router])

  const getFilteredStudents = () => {
    let filtered = students

    if (selectedClass !== "all") {
      const classMap = {
        math12a1: "Toán 12A1",
        lit12a1: "Văn 12A1",
        math11b2: "Toán 11B2",
      }
      filtered = filtered.filter((student) => student.class === classMap[selectedClass])
    }

    return filtered.sort((a, b) => b.avgGrade - a.avgGrade)
  }

  const getGradeDistribution = () => {
    const filtered = getFilteredStudents()
    const distribution = {
      excellent: filtered.filter((s) => s.avgGrade >= 9).length,
      good: filtered.filter((s) => s.avgGrade >= 8 && s.avgGrade < 9).length,
      average: filtered.filter((s) => s.avgGrade >= 6.5 && s.avgGrade < 8).length,
      needsImprovement: filtered.filter((s) => s.avgGrade < 6.5).length,
    }
    return distribution
  }

  const getSubjectAverages = () => {
    const filtered = getFilteredStudents()
    if (filtered.length === 0) return {}

    const subjects = ["math", "literature", "english"]
    const averages = {}

    subjects.forEach((subject) => {
      const total = filtered.reduce((sum, student) => sum + student.subjects[subject], 0)
      averages[subject] = (total / filtered.length).toFixed(1)
    })

    return averages
  }

  const getTrendStats = () => {
    const filtered = getFilteredStudents()
    return {
      improving: filtered.filter((s) => s.trend === "up").length,
      stable: filtered.filter((s) => s.trend === "stable").length,
      declining: filtered.filter((s) => s.trend === "down").length,
    }
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-gray-500 font-bold">#{rank}</span>
    }
  }

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-400" />
    }
  }

  const getGradeBadge = (grade) => {
    if (grade >= 9) return <Badge className="bg-green-500">Xuất sắc</Badge>
    if (grade >= 8) return <Badge className="bg-blue-500">Giỏi</Badge>
    if (grade >= 6.5) return <Badge className="bg-yellow-500">Khá</Badge>
    return <Badge variant="destructive">Cần cố gắng</Badge>
  }

  const getGradeColor = (grade) => {
    if (grade >= 9) return "text-green-600"
    if (grade >= 8) return "text-blue-600"
    if (grade >= 6.5) return "text-yellow-600"
    return "text-red-600"
  }

  if (!user) {
    return <div>Loading...</div>
  }

  const filteredStudents = getFilteredStudents()
  const distribution = getGradeDistribution()
  const subjectAverages = getSubjectAverages()
  const trendStats = getTrendStats()
  const overallAverage =
    filteredStudents.length > 0
      ? (filteredStudents.reduce((sum, s) => sum + s.avgGrade, 0) / filteredStudents.length).toFixed(1)
      : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bảng xếp hạng học sinh</h1>
              <p className="text-gray-600">Theo dõi và đánh giá sự tiến bộ của học sinh</p>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Chọn lớp" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Chọn môn học" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả môn</SelectItem>
                  <SelectItem value="math">Toán học</SelectItem>
                  <SelectItem value="literature">Ngữ văn</SelectItem>
                  <SelectItem value="english">Tiếng Anh</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="ranking">Xếp hạng</TabsTrigger>
              <TabsTrigger value="analysis">Phân tích</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tổng học sinh</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{filteredStudents.length}</div>
                    <p className="text-xs text-muted-foreground">Đang theo dõi</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Điểm TB chung</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overallAverage}</div>
                    <p className="text-xs text-muted-foreground">Trên thang điểm 10</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Học sinh giỏi</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {distribution.excellent + distribution.good}
                    </div>
                    <p className="text-xs text-muted-foreground">≥ 8.0 điểm</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tiến bộ</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{trendStats.improving}</div>
                    <p className="text-xs text-muted-foreground">Học sinh cải thiện</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Cần chú ý</CardTitle>
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">{distribution.needsImprovement}</div>
                    <p className="text-xs text-muted-foreground">&lt;6.5 điểm</p>
                  </CardContent>
                </Card>
              </div>

              {/* Top 3 Students */}
              <Card>
                <CardHeader>
                  <CardTitle>Top 3 học sinh xuất sắc</CardTitle>
                  <CardDescription>Những học sinh có thành tích cao nhất</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filteredStudents.slice(0, 3).map((student, index) => (
                      <div key={student.id} className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-center mb-3">{getRankIcon(index + 1)}</div>
                        <Avatar className="h-16 w-16 mx-auto mb-3">
                          <AvatarFallback className="text-lg">{student.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h3 className="font-medium">{student.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">{student.class}</p>
                        <div className="flex items-center justify-center space-x-2">
                          <span className={`text-xl font-bold ${getGradeColor(student.avgGrade)}`}>
                            {student.avgGrade}
                          </span>
                          {getTrendIcon(student.trend)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Grade Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Phân bố điểm số</CardTitle>
                    <CardDescription>Số lượng học sinh theo từng mức điểm</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Xuất sắc (9.0-10)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${(distribution.excellent / filteredStudents.length) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-8">{distribution.excellent}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Target className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">Giỏi (8.0-8.9)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(distribution.good / filteredStudents.length) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-8">{distribution.good}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <BookOpen className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm">Khá (6.5-7.9)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-500 h-2 rounded-full"
                              style={{ width: `${(distribution.average / filteredStudents.length) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-8">{distribution.average}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="h-4 w-4 text-red-500" />
                          <span className="text-sm">Cần cố gắng (&lt;6.5)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-red-500 h-2 rounded-full"
                              style={{ width: `${(distribution.needsImprovement / filteredStudents.length) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-8">{distribution.needsImprovement}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Class Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Thống kê theo lớp</CardTitle>
                    <CardDescription>Điểm trung bình từng lớp học</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {classes
                        .filter((cls) => cls.id !== "all")
                        .map((cls) => (
                          <div key={cls.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <h4 className="font-medium">{cls.name}</h4>
                              <p className="text-sm text-gray-500">{cls.studentCount} học sinh</p>
                            </div>
                            <div className="text-right">
                              <div className={`text-lg font-bold ${getGradeColor(cls.avgGrade)}`}>{cls.avgGrade}</div>
                              <p className="text-xs text-gray-500">Điểm TB</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="ranking" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bảng xếp hạng chi tiết</CardTitle>
                  <CardDescription>Danh sách tất cả học sinh được sắp xếp theo điểm trung bình</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Hạng</TableHead>
                        <TableHead>Học sinh</TableHead>
                        <TableHead>Lớp</TableHead>
                        <TableHead className="text-center">Điểm TB</TableHead>
                        <TableHead className="text-center">Xu hướng</TableHead>
                        <TableHead className="text-center">Hoàn thành</TableHead>
                        <TableHead className="text-center">Đánh giá</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student, index) => (
                        <TableRow key={student.id}>
                          <TableCell className="text-center">{getRankIcon(index + 1)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{student.name}</div>
                                <div className="text-sm text-gray-500">{student.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{student.class}</TableCell>
                          <TableCell className="text-center">
                            <span className={`text-lg font-bold ${getGradeColor(student.avgGrade)}`}>
                              {student.avgGrade}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">{getTrendIcon(student.trend)}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{ width: `${student.completionRate}%` }}
                                ></div>
                              </div>
                              <span className="text-sm">{student.completionRate}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">{getGradeBadge(student.avgGrade)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6">
              {/* Trend Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Xu hướng học tập</CardTitle>
                    <CardDescription>Phân tích sự tiến bộ của học sinh</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <TrendingUp className="h-8 w-8 text-green-500" />
                        <div>
                          <h4 className="font-medium text-green-800">Tiến bộ</h4>
                          <p className="text-sm text-green-600">Điểm số cải thiện</p>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-green-600">{trendStats.improving}</div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Minus className="h-8 w-8 text-gray-500" />
                        <div>
                          <h4 className="font-medium text-gray-800">Ổn định</h4>
                          <p className="text-sm text-gray-600">Duy trì mức độ hiện tại</p>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-gray-600">{trendStats.stable}</div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <TrendingDown className="h-8 w-8 text-red-500" />
                        <div>
                          <h4 className="font-medium text-red-800">Cần chú ý</h4>
                          <p className="text-sm text-red-600">Điểm số giảm</p>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-red-600">{trendStats.declining}</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Subject Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle>Thành tích theo môn</CardTitle>
                    <CardDescription>Điểm trung bình từng môn học</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Toán học</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-blue-500 h-3 rounded-full"
                              style={{ width: `${(subjectAverages.math / 10) * 100}%` }}
                            ></div>
                          </div>
                          <span className={`font-bold ${getGradeColor(subjectAverages.math)}`}>
                            {subjectAverages.math}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-medium">Ngữ văn</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-green-500 h-3 rounded-full"
                              style={{ width: `${(subjectAverages.literature / 10) * 100}%` }}
                            ></div>
                          </div>
                          <span className={`font-bold ${getGradeColor(subjectAverages.literature)}`}>
                            {subjectAverages.literature}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-medium">Tiếng Anh</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-purple-500 h-3 rounded-full"
                              style={{ width: `${(subjectAverages.english / 10) * 100}%` }}
                            ></div>
                          </div>
                          <span className={`font-bold ${getGradeColor(subjectAverages.english)}`}>
                            {subjectAverages.english}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Phân tích chi tiết</CardTitle>
                  <CardDescription>Thống kê toàn diện về thành tích học tập</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-600">{distribution.excellent}</div>
                      <p className="text-sm text-green-700">Xuất sắc (9.0+)</p>
                    </div>

                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-600">{distribution.good}</div>
                      <p className="text-sm text-blue-700">Giỏi (8.0-8.9)</p>
                    </div>

                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <BookOpen className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-yellow-600">{distribution.average}</div>
                      <p className="text-sm text-yellow-700">Khá (6.5-7.9)</p>
                    </div>

                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-red-600">{distribution.needsImprovement}</div>
                      <p className="text-sm text-red-700">Cần cố gắng (&lt;6.5)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
