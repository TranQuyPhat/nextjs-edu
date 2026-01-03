import Cookies from "js-cookie";

/**
 * Lấy access token từ cookie
 * @returns Token hoặc null nếu không tìm thấy
 */
export const getAccessToken = (): string | null => {
    if (typeof window === "undefined") {
        return null;
    }
    return Cookies.get("accessToken") || null;
};

/**
 * Lưu access token vào cookie
 * @param token Token cần lưu
 * @param expiryDays Số ngày hết hạn (mặc định 7)
 */
export const setAccessToken = (token: string, expiryDays: number = 7): void => {
    Cookies.set("accessToken", token, {
        expires: expiryDays,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
    });
};

/**
 * Xóa access token khỏi cookie
 */
export const removeAccessToken = (): void => {
    Cookies.remove("accessToken");
};
