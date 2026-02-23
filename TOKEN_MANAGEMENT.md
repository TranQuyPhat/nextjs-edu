# Token Management Guide

## Tổng quan
Từ nay, toàn bộ token được lưu trữ trong **Cookie** thay vì localStorage. Để lấy token, bạn chỉ cần import và sử dụng hàm utility từ `@/lib/auth.ts`.

## Cách sử dụng

### 1. Lấy Access Token
```typescript
import { getAccessToken } from "@/lib/auth";

// Trong component hoặc service
const token = getAccessToken();
// Hoặc trong SSR/API Route:
if (typeof window !== "undefined") {
  const token = getAccessToken();
}
```

### 2. Lưu Access Token (sau khi login)
```typescript
import { setAccessToken } from "@/lib/auth";

// Lưu token vào cookie với thời hạn 7 ngày
setAccessToken(token, 7);

// Hoặc mặc định 7 ngày
setAccessToken(token);
```

### 3. Xóa Access Token (sau khi logout)
```typescript
import { removeAccessToken } from "@/lib/auth";

// Xóa token khỏi cookie
removeAccessToken();
```

## Ưu điểm của Cookie
- ✅ Tự động gửi theo mỗi request (nếu `withCredentials: true`)
- ✅ Secure và HttpOnly (có thể cấu hình)
- ✅ Tự động quản lý expiration
- ✅ Bảo vệ tốt hơn XSS attacks
- ✅ API Interceptor tự động đính kèm token

## File được cập nhật
1. `src/lib/auth.ts` - Utility functions cho token management
2. `src/app/quizzes/api/api-client.ts` - API interceptor
3. `src/app/auth/login/page.tsx` - Login form
4. `src/app/dashboard/teacher/page.tsx` - Teacher dashboard
5. `src/app/dashboard/student/page.tsx` - Student dashboard
6. `src/app/schedule/teacher/page.tsx` - Teacher schedule
7. `src/app/schedule/student/page.tsx` - Student schedule
8. `src/app/quizzes/teacher/quizResult/[quizId]/page.tsx` - Quiz results
9. `src/app/quizzes/teacher/createQuiz/page.tsx` - Create quiz
10. `src/app/quizzes/student/[id]/page.tsx` - Quiz taking
11. `src/app/quizzes/student/page.tsx` - Quiz list
12. `src/services/scheduleService.ts` - Schedule service

## Lưu ý quan trọng
- Luôn import `getAccessToken` từ `@/lib/auth` thay vì sử dụng `localStorage.getItem("accessToken")`
- Không còn cần import `js-cookie` trực tiếp, hãy dùng utility functions
- Nếu cần token ở SSR context, kiểm tra `typeof window !== "undefined"` trước
