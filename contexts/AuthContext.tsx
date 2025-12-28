'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';

interface User {
    id: string;
    email: string;
    username: string;
    fullName?: string;
    avatar?: string;
    themeId: string;
    currency: string;
    locale: string;
    createdAt: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: {
        email: string;
        username: string;
        password: string;
        fullName?: string;
    }) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Check if user is logged in on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const { user: userData } = await api.getProfile();
            setUser(userData);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const { user: userData } = await api.login({ email, password });
            setUser(userData);
            router.push('/dashboard');
        } catch (error: any) {
            throw new Error(error.message || 'Login failed');
        }
    };

    const register = async (data: {
        email: string;
        username: string;
        password: string;
        fullName?: string;
    }) => {
        try {
            const { user: userData } = await api.register(data);
            setUser(userData);
            router.push('/dashboard');
        } catch (error: any) {
            throw new Error(error.message || 'Registration failed');
        }
    };

    const logout = async () => {
        try {
            await api.logout();
            setUser(null);
            router.push('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const updateUser = (data: Partial<User>) => {
        if (user) {
            setUser({ ...user, ...data });
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}