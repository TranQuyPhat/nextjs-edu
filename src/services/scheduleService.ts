// services/scheduleService.ts
import { ApiResp } from '../lib/type';
import { getAccessToken } from '../lib/auth';

export type LessonItem = {
  sessionId: number;
  className: string;
  subjectName: string;
  teacherName: string;
  startPeriod: number;
  endPeriod: number;
  location: string;
  sessionStatus: string;
  sessionDate: string;
};

export type DaySchedule = {
  day: string;
  date: string;
  lessons: LessonItem[];
};

export type WeekSchedule = {
  weekNumber: number;
  weekStartDate: string;
  weekEndDate: string;
  previousWeekStartDate?: string;
  nextWeekStartDate?: string;
  schedules: DaySchedule[];
};

/**
 * Lấy thời khóa biểu theo tuần
 * @param date - Ngày bất kỳ trong tuần (format: YYYY-MM-DD), nếu không có thì lấy tuần hiện tại
 * @returns WeekSchedule
 */
export const getScheduleByWeek = async (date?: string): Promise<WeekSchedule> => {
  try {
    // Tạo URL với query parameter nếu có date
    let url = 'http://localhost:8080/api/schedules/week';
    if (date) {
      url += `?date=${encodeURIComponent(date)}`;
    }

    // Lấy token từ cookie
    const token = getAccessToken();

    // Log để debug
    console.log('🔑 Token exists:', !!token);
    console.log('🔑 Token length:', token?.length || 0);
    if (token) {
      console.log('🔑 Token preview:', token.substring(0, 20) + '...');
    }

    // Tạo headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn('⚠️ No token found in localStorage!');
    }

    console.log('📤 Request URL:', url);
    console.log('📤 Request headers:', headers);

    // Gọi API trực tiếp bằng fetch
    const response = await fetch(url, {
      method: 'GET',
      headers,
      credentials: 'include', // Để gửi cookies nếu có
    });

    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
        errorData.error ||
        `HTTP error! status: ${response.status}`
      );
    }

    // Đọc response text trước để debug
    const responseText = await response.text();
    console.log('📄 Raw response text (first 500 chars):', responseText.substring(0, 500));

    let payload: ApiResp<WeekSchedule>;
    try {
      payload = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Failed to parse JSON:', parseError);
      console.error('❌ Response text:', responseText);
      throw new Error('Invalid JSON response from server');
    }

    console.log('📦 Raw API response (full):', JSON.stringify(payload, null, 2));
    console.log('✅ Success:', payload?.success);
    console.log('📊 Data exists:', !!payload?.data);

    if (payload && payload.success && payload.data) {
      // Log chi tiết từng ngày
      console.log('📅 Schedules array length:', payload.data.schedules?.length);
      payload.data.schedules?.forEach((day, index) => {
        console.log(`  📆 Day ${index + 1}: ${day.day} (${day.date}) - ${day.lessons?.length || 0} lesson(s)`);
        if (day.lessons && day.lessons.length > 0) {
          console.log(`    ✅ Lessons:`, day.lessons);
        }
      });

      // Log số lượng lessons
      const totalLessons = payload.data.schedules.reduce(
        (sum, day) => sum + (day.lessons?.length || 0),
        0
      );
      console.log(`📚 Total lessons in week: ${totalLessons}`);

      if (totalLessons === 0) {
        console.warn('⚠️ No lessons found in schedule data');
        console.warn('⚠️ This might be because:');
        console.warn('   1. User in web is different from user in Postman');
        console.warn('   2. User has no classes or sessions assigned');
        console.warn('   3. Sessions are not in this week range');
      }

      return payload.data;
    } else {
      throw new Error(payload?.message || 'Invalid response format');
    }
  } catch (error: any) {
    console.error('Error fetching schedule:', error);
    throw error;
  }
};

