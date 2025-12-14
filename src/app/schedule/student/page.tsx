"use client";

import { useState, useEffect, useMemo } from "react";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ThumbsUp, Plus, Calendar, MapPin, User, Clock, Sparkles } from "lucide-react";
import Loading from "@/components/loading";
import { getScheduleByWeek, WeekSchedule, LessonItem, DaySchedule } from "@/services/scheduleService";

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
  
  // Modern gradient color palette
  const colors = [
    { 
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100', 
      border: 'border-blue-300/50', 
      text: 'text-blue-900', 
      accent: 'from-blue-400 to-blue-500',
      shadow: 'shadow-blue-200/50'
    },
    { 
      bg: 'bg-gradient-to-br from-purple-50 to-purple-100', 
      border: 'border-purple-300/50', 
      text: 'text-purple-900', 
      accent: 'from-purple-400 to-purple-500',
      shadow: 'shadow-purple-200/50'
    },
    { 
      bg: 'bg-gradient-to-br from-pink-50 to-pink-100', 
      border: 'border-pink-300/50', 
      text: 'text-pink-900', 
      accent: 'from-pink-400 to-pink-500',
      shadow: 'shadow-pink-200/50'
    },
    { 
      bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100', 
      border: 'border-indigo-300/50', 
      text: 'text-indigo-900', 
      accent: 'from-indigo-400 to-indigo-500',
      shadow: 'shadow-indigo-200/50'
    },
    { 
      bg: 'bg-gradient-to-br from-teal-50 to-teal-100', 
      border: 'border-teal-300/50', 
      text: 'text-teal-900', 
      accent: 'from-teal-400 to-teal-500',
      shadow: 'shadow-teal-200/50'
    },
    { 
      bg: 'bg-gradient-to-br from-cyan-50 to-cyan-100', 
      border: 'border-cyan-300/50', 
      text: 'text-cyan-900', 
      accent: 'from-cyan-400 to-cyan-500',
      shadow: 'shadow-cyan-200/50'
    },
    { 
      bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100', 
      border: 'border-emerald-300/50', 
      text: 'text-emerald-900', 
      accent: 'from-emerald-400 to-emerald-500',
      shadow: 'shadow-emerald-200/50'
    },
    { 
      bg: 'bg-gradient-to-br from-amber-50 to-amber-100', 
      border: 'border-amber-300/50', 
      text: 'text-amber-900', 
      accent: 'from-amber-400 to-amber-500',
      shadow: 'shadow-amber-200/50'
    },
    { 
      bg: 'bg-gradient-to-br from-orange-50 to-orange-100', 
      border: 'border-orange-300/50', 
      text: 'text-orange-900', 
      accent: 'from-orange-400 to-orange-500',
      shadow: 'shadow-orange-200/50'
    },
    { 
      bg: 'bg-gradient-to-br from-rose-50 to-rose-100', 
      border: 'border-rose-300/50', 
      text: 'text-rose-900', 
      accent: 'from-rose-400 to-rose-500',
      shadow: 'shadow-rose-200/50'
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

export default function SchedulePage() {
  const [user, setUser] = useState<any>(null);
  const [weekStartDate, setWeekStartDate] = useState<string | null>(null);
  const [weekData, setWeekData] = useState<WeekSchedule | null>(null);
  const [loadingWeek, setLoadingWeek] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    const token = localStorage.getItem("accessToken");
    console.log("🔑 Access token exists:", !!token);
    if (token) {
      try {
        // Decode JWT để xem user ID (không verify, chỉ decode)
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log("🔑 Token payload (user info):", payload);
        console.log("🔑 User ID from token:", payload?.sub || payload?.userId || payload?.id);
      } catch (e) {
        console.error("Error decoding token:", e);
      }
    }
  }, []);

  useEffect(() => {
    const fetchWeek = async () => {
      try {
        setLoadingWeek(true);
        setError(null);
        const data = await getScheduleByWeek(weekStartDate || undefined);
        console.log("📅 Schedule data received:", data);
        console.log("📚 Total lessons:", data.schedules.reduce((sum, day) => sum + day.lessons.length, 0));
        data.schedules.forEach((day, idx) => {
          if (day.lessons.length > 0) {
            console.log(`✅ ${day.day} (${day.date}): ${day.lessons.length} lesson(s)`, day.lessons);
          }
        });
        setWeekData(data);
      } catch (err: any) {
        console.error("Error fetching schedule:", err);
        setError(err?.message || "Không thể tải thời khóa biểu");
      } finally {
        setLoadingWeek(false);
      }
    };
    fetchWeek();
  }, [weekStartDate]);

  const periods = useMemo(() => {
    if (!weekData) return Array.from({ length: 12 }, (_, i) => i + 1);
    return getAllPeriods(weekData.schedules);
  }, [weekData]);

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <Navigation />
      <div className="max-w-[95vw] mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Modern Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Thời khóa biểu
                </h1>
                {weekData && (
                  <p className="text-sm text-gray-600 mt-1">
                    Tuần {weekData.weekNumber} • {formatDate(weekData.weekStartDate)} - {formatDate(weekData.weekEndDate)}
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
                className="shadow-sm hover:shadow-md transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setWeekStartDate(null)}
                disabled={!weekStartDate}
                className="shadow-sm hover:shadow-md transition-all"
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
                className="shadow-sm hover:shadow-md transition-all"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200/50 bg-gradient-to-r from-red-50 to-rose-50 p-4 text-sm text-red-700 shadow-sm backdrop-blur-sm">
            {error}
          </div>
        )}

        {/* Calendar Grid */}
        {loadingWeek ? (
          <div className="text-center py-16 text-gray-500">
            <div className="inline-flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span>Đang tải thời khóa biểu...</span>
            </div>
          </div>
        ) : !weekData ? (
          <div className="text-center py-16 text-gray-500">Không có dữ liệu</div>
        ) : (
          <>
            {/* Info about total lessons */}
            {weekData.schedules.reduce((sum, day) => sum + day.lessons.length, 0) === 0 && (
              <div className="mb-6 rounded-2xl border border-blue-200/50 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 text-sm text-blue-700 shadow-sm backdrop-blur-sm flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-blue-500" />
                <span>Tuần này không có môn học nào được lên lịch.</span>
              </div>
            )}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden shadow-2xl shadow-blue-500/10">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 border-b border-gray-200/50"></th>
                  {weekData.schedules.map((daySchedule, idx) => {
                    const dayAbbr = dayAbbreviationMap[daySchedule.day] || daySchedule.day;
                    const dateFormatted = formatDate(daySchedule.date);
                    const today = isToday(daySchedule.date);
                    return (
                      <th
                        key={idx}
                        className={`p-4 border-b border-gray-200/50 text-center transition-all ${
                          today
                            ? 'bg-gradient-to-br from-blue-100 to-indigo-100 border-blue-300/50 shadow-lg shadow-blue-200/30'
                            : 'bg-gradient-to-br from-gray-50 to-gray-100/50 hover:from-gray-100 hover:to-gray-150'
                        }`}
                      >
                        <div className={`text-sm font-bold ${today ? 'text-blue-900' : 'text-gray-700'}`}>
                          {dayAbbr}
                        </div>
                        <div className={`text-xs mt-1.5 font-medium ${today ? 'text-blue-700' : 'text-gray-600'}`}>
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
                  <tr key={period} className="border-b border-gray-200/30 last:border-b-0 hover:bg-gray-50/30 transition-colors">
                    {/* Period Label */}
                    <td className="p-3 bg-gradient-to-br from-gray-50 to-gray-100/50 border-r border-gray-200/50 text-center text-xs font-semibold text-gray-700 w-24">
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-gray-500" />
                        <span>Tiết {period}</span>
                      </div>
                    </td>

                    {/* Day Cells */}
                    {weekData.schedules.map((daySchedule, dayIdx) => {
                      const lesson = getLessonForPeriod(daySchedule, period);
                      const isFirst = lesson ? isFirstPeriodOfLesson(lesson, period) : false;
                      const spanRows = lesson ? lesson.endPeriod - lesson.startPeriod + 1 : 1;
                      const today = isToday(daySchedule.date);

                      // Check if this cell should be skipped (part of a multi-period lesson from a previous period)
                      if (lesson && !isFirst) {
                        return null;
                      }

                      // Get color for this subject
                      const colors = lesson ? getSubjectColor(lesson.subjectName) : null;

                      return (
                        <td
                          key={`${period}-${dayIdx}`}
                          rowSpan={lesson && isFirst ? spanRows : 1}
                          className={`border-r border-gray-200/30 min-h-[90px] align-top transition-all ${
                            lesson
                              ? `${colors?.bg} ${colors?.border} border-l-4 ${colors?.shadow} shadow-lg hover:shadow-xl hover:scale-[1.02]`
                              : today
                              ? "bg-gradient-to-br from-blue-50/40 to-indigo-50/20"
                              : "bg-white/50"
                          }`}
                        >
                          {lesson && isFirst && (
                            <div className="p-4 h-full flex flex-col justify-center relative group">
                              {/* Gradient accent bar on left */}
                              <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${colors?.accent} rounded-l shadow-lg`}></div>
                              
                              {/* Subject Name */}
                              <div className={`font-bold text-sm ${colors?.text} mb-2 flex items-center gap-2`}>
                                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${colors?.accent} shadow-sm`}></div>
                                <span className="line-clamp-1">{lesson.subjectName}</span>
                              </div>
                              
                              {/* Class Name */}
                              <div className={`text-xs ${colors?.text} opacity-90 mb-2 font-medium`}>
                                {lesson.className}
                              </div>
                              
                              {/* Location */}
                              <div className={`text-xs ${colors?.text} opacity-75 flex items-center gap-1.5 mb-1.5`}>
                                <MapPin className="h-3.5 w-3.5" />
                                <span>{lesson.location}</span>
                              </div>
                              
                              {/* Teacher */}
                              <div className={`text-xs ${colors?.text} opacity-70 flex items-center gap-1.5 mb-2`}>
                                <User className="h-3.5 w-3.5" />
                                <span className="line-clamp-1">{lesson.teacherName}</span>
                              </div>
                              
                              {/* Periods */}
                              <div className={`text-xs ${colors?.text} opacity-60 flex items-center gap-1.5 mt-auto pt-2 border-t ${colors?.border} border-opacity-30`}>
                                <Clock className="h-3 w-3" />
                                <span>Tiết {lesson.startPeriod}-{lesson.endPeriod}</span>
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
            <ThumbsUp className="h-5 w-5 relative z-10" />
            <Plus className="h-4 w-4 relative z-10" />
          </button>
        </div>
      </div>
    </div>
  );
}
