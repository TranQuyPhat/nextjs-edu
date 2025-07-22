"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Users, CheckCircle, Play, Eye } from "lucide-react"

export default function StudentQuizzesPage() {
  const [user, setUser] = useState<any>(null)
  const [quizzes] = useState([
    {
      id: 1,
      title: "Kiểm tra 15 phút - Hàm số",
      description: "Bài kiểm tra về định nghĩa và tính chất hàm số",
      className: "Toán 12A1",
      duration: 15,
      totalQuestions: 10,
      status: "active",
      dueDate: "2024-01-25",
    },
    {
      id: 2,
      title: "Bài kiểm tra giữa kỳ",
      description: "Kiểm tra tổng hợp các chương đã học",
      className: "Toán 12A1",
      duration: 45,
      totalQuestions: 20,
      status: "completed",
      dueDate: "2024-01-20",
    },
  ])

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
      setUser(JSON.parse(userData))
    }
  }, [])

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
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
      </div>
    </div>
  )
}
