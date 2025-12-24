import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getScheduleByWeek, WeekSchedule } from '@/services/scheduleService';

/**
 * Custom hook để fetch schedule bằng React Query
 * @param weekStartDate - Ngày bắt đầu tuần (format: YYYY-MM-DD), nếu không có thì lấy tuần hiện tại
 * @returns Query result với data, isLoading, error, isFetching
 */
export const useSchedule = (weekStartDate?: string | null): UseQueryResult<WeekSchedule, Error> => {
    return useQuery({
        queryKey: ['schedule', weekStartDate ?? 'current'],
        queryFn: () => getScheduleByWeek(weekStartDate || undefined),
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
};
