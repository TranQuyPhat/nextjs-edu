// hooks/useAuth.ts - FIXED VERSION (đã đổi id -> userId)
import { useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import apiClient from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';

async function validateToken(token: string): Promise<boolean> {
    const res = await apiClient.get('/auth/validate', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.status === 200;
}

// ✅ đổi field id -> userId để khớp với dữ liệu bạn lưu ở localStorage
type UserData = {
    userId: number;
    username: string;
    fullName?: string;   // nếu bạn có lưu fullName
    email: string;
    roles: string[];
};

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [user, setUser] = useState<UserData | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);

    const router = useRouter();
    const pathname = usePathname();

    const clearAuthData = useCallback(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        setUser(null);
        setUserRole(null);
        setIsAuthenticated(false);
    }, []);

    const redirectUser = useCallback((userData: UserData, role?: string) => {
        // Chỉ redirect nếu đang ở trang login/register/home
        const shouldRedirect = ['/login', '/register', '/'].includes(pathname);
        if (!shouldRedirect) return;

        if (role) {
            router.replace(`/dashboard/${role}`);
        } else {
            if (userData.roles?.length > 1) {
                router.replace('/select-role');
            } else if (userData.roles?.length === 1) {
                const r = userData.roles[0].toLowerCase();
                localStorage.setItem('role', r);
                setUserRole(r);
                router.replace(`/dashboard/${r}`);
            }
        }
    }, [pathname, router]);

    const { isLoading: loading } = useQuery<UserData | null>({
        queryKey: ['auth', typeof window !== 'undefined' && localStorage.getItem('accessToken')],
        queryFn: async () => {
            const token = localStorage.getItem('accessToken');
            const userData = localStorage.getItem('user');
            const role = localStorage.getItem('role');
            if (!token || !userData) {
                setIsAuthenticated(false);
                return null;
            }

            const valid = await validateToken(token);
            if (!valid) throw new Error('Token invalid');

            const parsedUser: UserData = JSON.parse(userData);
            setUser(parsedUser);
            setUserRole(role);
            setIsAuthenticated(true);
            redirectUser(parsedUser, role || undefined);
            return parsedUser;
        },
        retry: false,
        meta: {
            onError: () => {
                clearAuthData();
            },
        },
    });


    const login = (userData: any) => {
        localStorage.setItem('accessToken', userData.accessToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setIsAuthenticated(true);
        setUser(userData);

        if (userData.roles?.length === 1) {
            const r = userData.roles[0].toLowerCase();
            localStorage.setItem('role', r);
            setUserRole(r);
        }
    };

    const logout = () => {
        clearAuthData();
        router.push('/auth/login');
    };

    return {
        isAuthenticated,
        loading,
        user,
        userRole,
        login,
        logout,
    };
};
