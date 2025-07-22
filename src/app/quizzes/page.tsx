"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Clock, Users, CheckCircle, Play, Edit, Eye } from "lucide-react"

export default function QuizzesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [quizzes, setQuizzes] = useState([
    {
      id: 1,
      title: "Kiểm tra 15 phút - Hàm số",
      description: "Bài kiểm tra về định nghĩa và tính chất hàm số",
      className: "Toán 12A1",
      duration: 15,
      totalQuestions: 10,
      attempts: 25,
      totalStudents: 35,
      status: "active",
      createdAt: "2024-01-20",
      dueDate: "2024-01-25",
    },
    {
      id: 2,
      title: "Bài kiểm tra giữa kỳ",
      description: "Kiểm tra tổng hợp các chương đã học",
      className: "Toán 12A1",
      duration: 45,
      totalQuestions: 20,
      attempts: 30,
      totalStudents: 35,
      status: "completed",
      createdAt: "2024-01-15",
      dueDate: "2024-01-20",
    },
  ])

  const [newQuiz, setNewQuiz] = useState({
    title: "",
    description: "",
    className: "",
    duration: 15,
    dueDate: "",
    questions: [],
  })

  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    type: "multiple-choice",
    options: ["", "", "", ""],
    correctAnswer: "",
    points: 1,
  })

  const [activeQuiz, setActiveQuiz] = useState<any>(null)
  const [quizAnswers, setQuizAnswers] = useState<any>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [isQuizStarted, setIsQuizStarted] = useState(false)

  // Mock quiz data for taking quiz
  const mockQuizData = {
    id: 1,
    title: "Kiểm tra 15 phút - Hàm số",
    duration: 15,
    questions: [
      {
        id: 1,
        question: "Hàm số y = 2x + 1 có tập xác định là:",
        type: "multiple-choice",
        options: ["R", "[0, +∞)", "(-∞, 0]", "(0, +∞)"],
        points: 1,
      },
      {
        id: 2,
        question: "Đạo hàm của hàm số y = x² là:",
        type: "multiple-choice",
        options: ["2x", "x", "2", "x²"],
        points: 1,
      },
      {
        id: 3,
        question: "Hàm số y = x³ - 3x + 1 có bao nhiêu điểm cực trị?",
        type: "multiple-choice",
        options: ["0", "1", "2", "3"],
        points: 2,
      },
    ],
  }

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      setUser(user)
      if (user.role === "teacher") {
        router.push("/quizzes/teacher")
      } else {
        router.push("/quizzes/student")
      }
    } else {
      router.push("/auth/login")
    }
  }, [router])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isQuizStarted && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsQuizStarted(false)
            handleSubmitQuiz()
            return 0
          }
          return time - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isQuizStarted, timeLeft])

  const handleCreateQuiz = () => {
    const quizData = {
      id: Date.now(),
      ...newQuiz,
      totalQuestions: newQuiz.questions.length,
      attempts: 0,
      totalStudents: 35,
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
    }
    setQuizzes([...quizzes, quizData])
    setNewQuiz({
      title: "",
      description: "",
      className: "",
      duration: 15,
      dueDate: "",
      questions: [],
    })
  }

  const handleStartQuiz = (quiz: any) => {
    setActiveQuiz(mockQuizData)
    setTimeLeft(quiz.duration * 60) // Convert minutes to seconds
    setIsQuizStarted(true)
    setQuizAnswers({})
  }

  const handleSubmitQuiz = () => {
    setIsQuizStarted(false)
    setActiveQuiz(null)
    alert("Đã nộp bài kiểm tra!")
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getStatusBadge = (status: string, dueDate: string) => {
    const now = new Date()
    const due = new Date(dueDate)

    if (status === "completed") {
      return (
        <Badge className="bg-green-500">
          <CheckCircle className="h-3 w-3 mr-1" />
          Hoàn thành
        </Badge>
      )
    }
    if (due < now) {
      return (
        <Badge variant="destructive">
          <Clock className="h-3 w-3 mr-1" />
          Đã đóng
        </Badge>
      )
    }
    return (
      <Badge className="bg-blue-500">
        <Clock className="h-3 w-3 mr-1" />
        Đang mở
      </Badge>
    )
  }

  if (!user) {
    return <div>Loading...</div>
  }

  // Quiz Taking Interface
  if (activeQuiz && isQuizStarted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto py-6 px-4">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold">{activeQuiz.title}</h1>
                <p className="text-gray-600">
                  {activeQuiz.questions.length} câu hỏi • {activeQuiz.duration} phút
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-red-600">{formatTime(timeLeft)}</div>
                <p className="text-sm text-gray-600">Thời gian còn lại</p>
              </div>
            </div>

            <div className="space-y-8">
              {activeQuiz.questions.map((question: any, index: number) => (
                <Card key={question.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Câu {index + 1}: {question.question} ({question.points} điểm)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={quizAnswers[question.id] || ""}
                      onValueChange={(value) => setQuizAnswers({ ...quizAnswers, [question.id]: value })}
                    >
                      {question.options.map((option: string, optionIndex: number) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`q${question.id}_${optionIndex}`} />
                          <Label htmlFor={`q${question.id}_${optionIndex}`} className="cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <Button onClick={handleSubmitQuiz} size="lg">
                Nộp bài
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const TeacherQuizView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý trắc nghiệm</h1>
          <p className="text-gray-600">Tạo và theo dõi bài kiểm tra trắc nghiệm</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tạo bài kiểm tra mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tạo bài kiểm tra trắc nghiệm</DialogTitle>
              <DialogDescription>Nhập thông tin và câu hỏi cho bài kiểm tra</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quizTitle">Tiêu đề</Label>
                  <Input
                    id="quizTitle"
                    value={newQuiz.title}
                    onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                    placeholder="VD: Kiểm tra 15 phút"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="className">Lớp học</Label>
                  <Select onValueChange={(value) => setNewQuiz({ ...newQuiz, className: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn lớp" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Toán 12A1">Toán 12A1</SelectItem>
                      <SelectItem value="Toán 11B2">Toán 11B2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={newQuiz.description}
                  onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
                  placeholder="Mô tả về bài kiểm tra..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Thời gian (phút)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newQuiz.duration}
                    onChange={(e) => setNewQuiz({ ...newQuiz, duration: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Hạn làm bài</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newQuiz.dueDate}
                    onChange={(e) => setNewQuiz({ ...newQuiz, dueDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-4">Thêm câu hỏi</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Câu hỏi</Label>
                    <Textarea
                      value={currentQuestion.question}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                      placeholder="Nhập câu hỏi..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="space-y-2">
                        <Label>Đáp án {String.fromCharCode(65 + index)}</Label>
                        <Input
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...currentQuestion.options]
                            newOptions[index] = e.target.value
                            setCurrentQuestion({ ...currentQuestion, options: newOptions })
                          }}
                          placeholder={`Đáp án ${String.fromCharCode(65 + index)}`}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Đáp án đúng</Label>
                      <Select
                        onValueChange={(value) => setCurrentQuestion({ ...currentQuestion, correctAnswer: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn đáp án đúng" />
                        </SelectTrigger>
                        <SelectContent>
                          {currentQuestion.options
                            .map((option, index) => ({ option, index }))
                            .filter(({ option }) => option.trim() !== "")
                            .map(({ option, index }) => (
                              <SelectItem key={index} value={option}>
                                {String.fromCharCode(65 + index)}: {option}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Điểm</Label>
                      <Input
                        type="number"
                        value={currentQuestion.points}
                        onChange={(e) =>
                          setCurrentQuestion({ ...currentQuestion, points: Number.parseInt(e.target.value) })
                        }
                        min="1"
                        max="10"
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (currentQuestion.question && currentQuestion.correctAnswer) {
                        setNewQuiz({
                          ...newQuiz,
                          questions: [...newQuiz.questions, { ...currentQuestion, id: Date.now() }],
                        })
                        setCurrentQuestion({
                          question: "",
                          type: "multiple-choice",
                          options: ["", "", "", ""],
                          correctAnswer: "",
                          points: 1,
                        })
                      }
                    }}
                  >
                    Thêm câu hỏi
                  </Button>
                </div>
              </div>

              {newQuiz.questions.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Danh sách câu hỏi ({newQuiz.questions.length})</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {newQuiz.questions.map((q: any, index: number) => (
                      <div key={q.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">
                          {index + 1}. {q.question.substring(0, 50)}...
                        </span>
                        <Badge>{q.points} điểm</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button onClick={handleCreateQuiz} className="w-full" disabled={newQuiz.questions.length === 0}>
                Tạo bài kiểm tra
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {quizzes.map((quiz) => (
          <Card key={quiz.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{quiz.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {quiz.className} • {quiz.duration} phút • {quiz.totalQuestions} câu hỏi
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {getStatusBadge(quiz.status, quiz.dueDate)}
                  <Badge variant="outline">
                    {quiz.attempts}/{quiz.totalStudents} đã làm
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{quiz.description}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  Xem kết quả
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4 mr-1" />
                  Chỉnh sửa
                </Button>
                <Button size="sm" variant="outline">
                  <Users className="h-4 w-4 mr-1" />
                  Thống kê
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const StudentQuizView = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bài kiểm tra trắc nghiệm</h1>
        <p className="text-gray-600">Làm bài kiểm tra và xem kết quả</p>
      </div>

      <Tabs defaultValue="available" className="space-y-4">
        <TabsList>
          <TabsTrigger value="available">Có thể làm</TabsTrigger>
          <TabsTrigger value="completed">Đã hoàn thành</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          {quizzes
            .filter((q) => q.status === "active")
            .map((quiz) => (
              <Card key={quiz.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{quiz.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {quiz.className} • {quiz.duration} phút • {quiz.totalQuestions} câu hỏi
                      </CardDescription>
                    </div>
                    {getStatusBadge(quiz.status, quiz.dueDate)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{quiz.description}</p>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Thời gian: {quiz.duration} phút</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Số câu: {quiz.totalQuestions}</span>
                    </div>
                  </div>
                  <Button onClick={() => handleStartQuiz(quiz)}>
                    <Play className="h-4 w-4 mr-2" />
                    Bắt đầu làm bài
                  </Button>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {quizzes
            .filter((q) => q.status === "completed")
            .map((quiz) => (
              <Card key={quiz.id} className="border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{quiz.title}</CardTitle>
                      <CardDescription className="mt-1">{quiz.className} • Đã hoàn thành</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {getStatusBadge(quiz.status, quiz.dueDate)}
                      <Badge className="bg-green-500">Điểm: 8.5/10</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{quiz.description}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      Xem kết quả
                    </Button>
                    <Button size="sm" variant="outline">
                      Xem đáp án
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {user.role === "teacher" ? <TeacherQuizView /> : <StudentQuizView />}
      </div>
    </div>
  )
}
