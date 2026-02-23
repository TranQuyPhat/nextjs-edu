"use client";

import { useState, useEffect, useMemo } from "react";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { getAccessToken } from "@/lib/auth";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Plus,
  Calendar,
  MapPin,
  User,
  Clock,
  Sparkles,
  Bell,
  FileText,
  X,
} from "lucide-react";
import Loading from "@/components/loading";
import {
  WeekSchedule,
  LessonItem,
  DaySchedule,
} from "@/services/scheduleService";
import { useSchedule } from "@/app/schedule/hooks/useSchedule";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// Mapping Vietnamese day names to abbreviations
const dayAbbreviationMap: Record<string, string> = {
  Monday: "HAI",
  Tuesday: "BA",
  Wednesday: "TƯ",
  Thursday: "NĂM",
  Friday: "SÁU",
  Saturday: "BẢY",
  Sunday: "CN",
};

// Format date to DD/MM/YYYY
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Get all periods that have lessons (typically 1-12)
const getAllPeriods = (schedules: DaySchedule[]): number[] => {
  const periods = new Set<number>();
  schedules.forEach((day) => {
    day.lessons.forEach((lesson) => {
      for (let p = lesson.startPeriod; p <= lesson.endPeriod; p++) {
        periods.add(p);
      }
    });
  });
  // If no lessons, return default periods 1-12
  if (periods.size === 0) {
    return Array.from({ length: 12 }, (_, i) => i + 1);
  }
  // Return sorted periods, ensuring we have at least 1-12
  const allPeriods = Array.from(periods).sort((a, b) => a - b);
  const maxPeriod = Math.max(...allPeriods, 12);
  return Array.from({ length: maxPeriod }, (_, i) => i + 1);
};

// Get lesson for a specific day and period
const getLessonForPeriod = (
  daySchedule: DaySchedule | undefined,
  period: number
): LessonItem | null => {
  if (!daySchedule) return null;
  return (
    daySchedule.lessons.find(
      (lesson) => period >= lesson.startPeriod && period <= lesson.endPeriod
    ) || null
  );
};

// Check if this is the first period of a multi-period lesson
const isFirstPeriodOfLesson = (lesson: LessonItem, period: number): boolean => {
  return lesson.startPeriod === period;
};

// Generate consistent color for a subject (based on subjectName hash)
const getSubjectColor = (subjectName: string) => {
  // Hash function để tạo số từ string
  let hash = 0;
  for (let i = 0; i < subjectName.length; i++) {
    hash = subjectName.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Modern vibrant color palette with better contrast
  const colors = [
    {
      bg: "bg-blue-100",
      border: "border-blue-400",
      text: "text-blue-900",
      accent: "from-blue-500 to-blue-600",
      shadow: "shadow-blue-300/40",
    },
    {
      bg: "bg-purple-100",
      border: "border-purple-400",
      text: "text-purple-900",
      accent: "from-purple-500 to-purple-600",
      shadow: "shadow-purple-300/40",
    },
    {
      bg: "bg-pink-100",
      border: "border-pink-400",
      text: "text-pink-900",
      accent: "from-pink-500 to-pink-600",
      shadow: "shadow-pink-300/40",
    },
    {
      bg: "bg-indigo-100",
      border: "border-indigo-400",
      text: "text-indigo-900",
      accent: "from-indigo-500 to-indigo-600",
      shadow: "shadow-indigo-300/40",
    },
    {
      bg: "bg-teal-100",
      border: "border-teal-400",
      text: "text-teal-900",
      accent: "from-teal-500 to-teal-600",
      shadow: "shadow-teal-300/40",
    },
    {
      bg: "bg-cyan-100",
      border: "border-cyan-400",
      text: "text-cyan-900",
      accent: "from-cyan-500 to-cyan-600",
      shadow: "shadow-cyan-300/40",
    },
    {
      bg: "bg-emerald-100",
      border: "border-emerald-400",
      text: "text-emerald-900",
      accent: "from-emerald-500 to-emerald-600",
      shadow: "shadow-emerald-300/40",
    },
    {
      bg: "bg-amber-100",
      border: "border-amber-400",
      text: "text-amber-900",
      accent: "from-amber-500 to-amber-600",
      shadow: "shadow-amber-300/40",
    },
    {
      bg: "bg-orange-100",
      border: "border-orange-400",
      text: "text-orange-900",
      accent: "from-orange-500 to-orange-600",
      shadow: "shadow-orange-300/40",
    },
    {
      bg: "bg-rose-100",
      border: "border-rose-400",
      text: "text-rose-900",
      accent: "from-rose-500 to-rose-600",
      shadow: "shadow-rose-300/40",
    },
  ];

  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

// Check if a date is today
const isToday = (dateString: string): boolean => {
  const today = new Date();
  const date = new Date(dateString);
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

// Type for lesson notes
type LessonNote = {
  sessionId: number;
  subjectName: string;
  note: string;
  weekStartDate: string;
};

export default function SchedulePage() {
  const [user, setUser] = useState<any>(null);
  const [weekStartDate, setWeekStartDate] = useState<string | null>(null);

  // Use React Query hook
  const {
    data: weekData,
    isLoading: loadingWeek,
    error,
  } = useSchedule(weekStartDate);

  // Note management
  const [notes, setNotes] = useState<Record<string, LessonNote>>({});
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<LessonItem | null>(null);
  const [noteText, setNoteText] = useState("");

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem("scheduleNotes");
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error("Error loading notes:", e);
      }
    }
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      console.log("👤 Current user:", parsedUser);
      console.log("👤 User ID:", parsedUser?.id);
    } else {
      console.warn("⚠️ No user data in localStorage");
    }

    // Log token để debug
    const token = getAccessToken();
    console.log("🔑 Access token exists:", !!token);
    if (token) {
      try {
        // Decode JWT để xem user ID (không verify, chỉ decode)
        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log("🔑 Token payload (user info):", payload);
        console.log(
          "🔑 User ID from token:",
          payload?.sub || payload?.userId || payload?.id
        );
      } catch (e) {
        console.error("Error decoding token:", e);
      }
    }
  }, []);

  useEffect(() => {
    const fetchWeek = async () => {
      try {
        console.log("📅 Schedule data received:", weekData);
        console.log(
          "📚 Total lessons:",
          weekData?.schedules.reduce((sum, day) => sum + day.lessons.length, 0)
        );
        weekData?.schedules.forEach((day, idx) => {
          if (day.lessons.length > 0) {
            console.log(
              `✅ ${day.day} (${day.date}): ${day.lessons.length} lesson(s)`,
              day.lessons
            );
          }
        });
      } catch (err: any) {
        console.error("Error with schedule data:", err);
      }
    };
    fetchWeek();
  }, [weekData]);

  const periods = useMemo(() => {
    if (!weekData) return Array.from({ length: 12 }, (_, i) => i + 1);
    return getAllPeriods(weekData.schedules);
  }, [weekData]);

  // Get note key for a lesson
  const getNoteKey = (lesson: LessonItem, weekStart: string) => {
    return `${lesson.sessionId}-${weekStart}`;
  };

  // Check if lesson has note
  const hasNote = (lesson: LessonItem) => {
    if (!weekData) return false;
    const key = getNoteKey(lesson, weekData.weekStartDate);
    return !!notes[key]?.note;
  };

  // Get note for lesson
  const getNote = (lesson: LessonItem) => {
    if (!weekData) return "";
    const key = getNoteKey(lesson, weekData.weekStartDate);
    return notes[key]?.note || "";
  };

  // Open note modal
  const openNoteModal = (lesson: LessonItem) => {
    setCurrentLesson(lesson);
    const existingNote = getNote(lesson);
    setNoteText(existingNote);
    setNoteModalOpen(true);
  };

  // Save note
  const saveNote = () => {
    if (!currentLesson || !weekData) return;

    const key = getNoteKey(currentLesson, weekData.weekStartDate);
    const newNotes = {
      ...notes,
      [key]: {
        sessionId: currentLesson.sessionId,
        subjectName: currentLesson.subjectName,
        note: noteText.trim(),
        weekStartDate: weekData.weekStartDate,
      },
    };

    // Remove note if empty
    if (!noteText.trim()) {
      delete newNotes[key];
    }

    setNotes(newNotes);
    localStorage.setItem("scheduleNotes", JSON.stringify(newNotes));
    setNoteModalOpen(false);
    setCurrentLesson(null);
    setNoteText("");
  };

  // Cancel note
  const cancelNote = () => {
    setNoteModalOpen(false);
    setCurrentLesson(null);
    setNoteText("");
  };

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-indigo-600/35 via-slate-900 to-slate-950 blur-3xl" />
        <div className="absolute -right-16 top-28 h-64 w-64 rounded-full bg-blue-500/25 blur-[130px]" />
        <div className="absolute -left-14 bottom-0 h-72 w-72 rounded-full bg-violet-500/25 blur-[140px]" />
      </div>
      <Navigation />
      <div className="relative z-10 max-w-[95vw] mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Modern Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Thời khóa biểu
                </h1>
                {weekData && (
                  <p className="text-sm text-slate-300 mt-1">
                    Tuần {weekData.weekNumber} •{" "}
                    {formatDate(weekData.weekStartDate)} -{" "}
                    {formatDate(weekData.weekEndDate)}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  weekData?.previousWeekStartDate &&
                  setWeekStartDate(weekData.previousWeekStartDate)
                }
                disabled={!weekData?.previousWeekStartDate}
                className="border-white/10 bg-white/5 text-white hover:bg-white/10 shadow-sm hover:shadow-md transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setWeekStartDate(null)}
                disabled={!weekStartDate}
                className="border-white/10 bg-white/5 text-white hover:bg-white/10 shadow-sm hover:shadow-md transition-all"
              >
                Tuần này
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  weekData?.nextWeekStartDate &&
                  setWeekStartDate(weekData.nextWeekStartDate)
                }
                disabled={!weekData?.nextWeekStartDate}
                className="border-white/10 bg-white/5 text-white hover:bg-white/10 shadow-sm hover:shadow-md transition-all"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/50 bg-red-900/20 p-4 text-sm text-red-200 shadow-sm backdrop-blur-sm">
            {error instanceof Error
              ? error.message
              : "Không thể tải thời khóa biểu"}
          </div>
        )}

        {/* Calendar Grid */}
        {loadingWeek ? (
          <div className="rounded-[32px] border border-white/10 bg-slate-900/60 overflow-hidden shadow-2xl backdrop-blur-2xl">
            <div className="p-8 space-y-4">
              {/* Header skeleton */}
              <div className="flex gap-4">
                <div className="h-12 w-24 bg-slate-800/50 rounded-lg animate-pulse" />
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div
                    key={i}
                    className="flex-1 h-12 bg-slate-800/50 rounded-lg animate-pulse"
                  />
                ))}
              </div>
              {/* Rows skeleton */}
              {[1, 2, 3, 4, 5, 6].map((row) => (
                <div key={row} className="flex gap-4">
                  <div className="h-20 w-24 bg-slate-800/50 rounded-lg animate-pulse" />
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div
                      key={i}
                      className="flex-1 h-20 bg-slate-800/30 rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : !weekData ? (
          <div className="text-center py-16 text-slate-300">
            Không có dữ liệu
          </div>
        ) : (
          <>
            {/* Info about total lessons */}
            {weekData.schedules.reduce(
              (sum, day) => sum + day.lessons.length,
              0
            ) === 0 && (
              <div className="mb-6 rounded-2xl border border-blue-500/30 bg-blue-900/20 p-5 text-sm text-blue-200 shadow-sm backdrop-blur-sm flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-blue-400" />
                <span>Tuần này không có môn học nào được lên lịch.</span>
              </div>
            )}
            <div className="rounded-[32px] border border-white/10 bg-slate-900/60 overflow-hidden shadow-2xl backdrop-blur-2xl">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-4 bg-slate-800/50 border-b-2 border-r-2 border-white/10"></th>
                    {weekData.schedules.map((daySchedule, idx) => {
                      const dayAbbr =
                        dayAbbreviationMap[daySchedule.day] || daySchedule.day;
                      const dateFormatted = formatDate(daySchedule.date);
                      const today = isToday(daySchedule.date);
                      return (
                        <th
                          key={idx}
                          className={`p-4 border-b-2 border-r-2 border-white/10 text-center transition-all ${
                            today
                              ? "bg-blue-500/20 border-blue-400/50"
                              : "bg-slate-800/30 hover:bg-slate-800/50"
                          }`}
                        >
                          <div
                            className={`text-sm font-bold ${
                              today ? "text-blue-300" : "text-slate-200"
                            }`}
                          >
                            {dayAbbr}
                          </div>
                          <div
                            className={`text-xs mt-1.5 font-medium ${
                              today ? "text-blue-200" : "text-slate-400"
                            }`}
                          >
                            {dateFormatted}
                          </div>
                          {today && (
                            <div className="mt-2 flex justify-center">
                              <span className="inline-block w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></span>
                            </div>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {periods.map((period) => (
                    <tr
                      key={period}
                      className="border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors"
                    >
                      {/* Period Label */}
                      <td className="p-3 bg-slate-800/30 border-r-2 border-b border-white/10 text-center text-xs font-semibold text-slate-200 w-24">
                        <div className="flex items-center justify-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          <span>Tiết {period}</span>
                        </div>
                      </td>

                      {/* Day Cells */}
                      {weekData.schedules.map((daySchedule, dayIdx) => {
                        const lesson = getLessonForPeriod(daySchedule, period);
                        const isFirst = lesson
                          ? isFirstPeriodOfLesson(lesson, period)
                          : false;
                        const spanRows = lesson
                          ? lesson.endPeriod - lesson.startPeriod + 1
                          : 1;
                        const today = isToday(daySchedule.date);

                        // Check if this cell should be skipped (part of a multi-period lesson from a previous period)
                        if (lesson && !isFirst) {
                          return null;
                        }

                        // Get color for this subject
                        const colors = lesson
                          ? getSubjectColor(lesson.subjectName)
                          : null;

                        return (
                          <td
                            key={`${period}-${dayIdx}`}
                            rowSpan={lesson && isFirst ? spanRows : 1}
                            className={`border-r-2 border-b border-white/10 min-h-[90px] align-top transition-all ${
                              lesson
                                ? `${colors?.bg} ${colors?.border} border-l-[6px] ${colors?.shadow} shadow-md hover:shadow-lg`
                                : today
                                ? "bg-blue-500/10"
                                : "bg-slate-800/20"
                            }`}
                          >
                            {lesson && isFirst && (
                              <div className="p-4 h-full flex flex-col justify-center relative group">
                                {/* Accent indicator dot */}
                                <div
                                  className={`absolute left-2 top-2 w-3 h-3 rounded-full bg-gradient-to-br ${colors?.accent} shadow-md`}
                                ></div>

                                {/* Note indicator and button */}
                                <div className="absolute top-2 right-2 flex items-center gap-1">
                                  {hasNote(lesson) && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openNoteModal(lesson);
                                      }}
                                      className="p-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-700 transition-all hover:scale-110 shadow-sm"
                                      title="Xem ghi chú"
                                    >
                                      <Bell className="h-3.5 w-3.5 fill-amber-500" />
                                    </button>
                                  )}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openNoteModal(lesson);
                                    }}
                                    className={`p-1.5 rounded-lg transition-all hover:scale-110 shadow-sm ${
                                      hasNote(lesson)
                                        ? "bg-blue-100 hover:bg-blue-200 text-blue-700"
                                        : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                                    }`}
                                    title={
                                      hasNote(lesson)
                                        ? "Chỉnh sửa ghi chú"
                                        : "Thêm ghi chú"
                                    }
                                  >
                                    <FileText className="h-3.5 w-3.5" />
                                  </button>
                                </div>

                                {/* Subject Name */}
                                <div
                                  className={`font-bold text-sm ${colors?.text} mb-2 flex items-center gap-2 pr-16`}
                                >
                                  <div
                                    className={`w-2 h-2 rounded-full bg-gradient-to-r ${colors?.accent} shadow-sm`}
                                  ></div>
                                  <span className="line-clamp-1">
                                    {lesson.subjectName}
                                  </span>
                                </div>

                                {/* Class Name */}
                                <div
                                  className={`text-xs ${colors?.text} opacity-90 mb-2 font-medium`}
                                >
                                  {lesson.className}
                                </div>

                                {/* Location */}
                                <div
                                  className={`text-xs ${colors?.text} opacity-75 flex items-center gap-1.5 mb-1.5`}
                                >
                                  <MapPin className="h-3.5 w-3.5" />
                                  <span>{lesson.location}</span>
                                </div>

                                {/* Teacher */}
                                <div
                                  className={`text-xs ${colors?.text} opacity-70 flex items-center gap-1.5 mb-2`}
                                >
                                  <User className="h-3.5 w-3.5" />
                                  <span className="line-clamp-1">
                                    {lesson.teacherName}
                                  </span>
                                </div>

                                {/* Periods */}
                                <div
                                  className={`text-xs ${colors?.text} opacity-60 flex items-center gap-1.5 mt-auto pt-2 border-t ${colors?.border} border-opacity-30`}
                                >
                                  <Clock className="h-3 w-3" />
                                  <span>
                                    Tiết {lesson.startPeriod}-{lesson.endPeriod}
                                  </span>
                                </div>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Modern Floating Action Button */}
        <div className="fixed bottom-8 right-8 z-50">
          <button className="group relative bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-2xl p-4 shadow-2xl shadow-blue-500/40 border border-white/20 flex items-center gap-2 transition-all hover:scale-110 hover:shadow-blue-500/50">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Heart className="h-5 w-5 relative z-10" />
            <Plus className="h-4 w-4 relative z-10" />
          </button>
        </div>

        {/* Note Modal */}
        <Dialog open={noteModalOpen} onOpenChange={setNoteModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Ghi chú môn học
              </DialogTitle>
              <DialogDescription>
                {currentLesson && (
                  <div className="mt-2">
                    <div className="font-semibold text-gray-900">
                      {currentLesson.subjectName}
                    </div>
                    <div className="text-sm text-gray-600">
                      {currentLesson.className}
                    </div>
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label
                htmlFor="note"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Ghi chú quan trọng (ví dụ: có tiết kiểm tra, bài tập về nhà...)
              </Label>
              <Textarea
                id="note"
                placeholder="Nhập ghi chú của bạn ở đây..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="min-h-[120px] resize-none"
                rows={5}
              />
            </div>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={cancelNote}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Hủy
              </Button>
              <Button
                onClick={saveNote}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Lưu
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
