// API Client for Frontend
// Usage: import { api } from '@/lib/api-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class APIClient {
    private async request<T>(
        endpoint: string,
        options?: RequestInit
    ): Promise<T> {
        const url = `${API_URL}${endpoint}`;

        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
            credentials: 'include', // Include cookies
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({
                message: 'An error occurred',
            }));
            throw new Error(error.message || 'Request failed');
        }

        return response.json();
    }

    // Auth
    async register(data: {
        email: string;
        username: string;
        password: string;
        fullName?: string;
    }) {
        return this.request('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async login(data: { email: string; password: string }) {
        return this.request<{ user: any }>('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async logout() {
        return this.request('/api/auth/me', {
            method: 'DELETE',
        });
    }

    async getProfile() {
        return this.request<{ user: any }>('/api/auth/me');
    }

    async updateProfile(data: {
        fullName?: string;
        avatar?: string;
        themeId?: string;
        currency?: string;
        locale?: string;
    }) {
        return this.request('/api/auth/me', {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    // Bank Accounts
    async getAccounts() {
        return this.request<{ accounts: any[] }>('/api/accounts');
    }

    async createAccount(data: {
        name: string;
        type: string;
        balance?: number;
        color?: string;
    }) {
        return this.request('/api/accounts', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateAccount(id: string, data: any) {
        return this.request(`/api/accounts/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    async deleteAccount(id: string) {
        return this.request(`/api/accounts/${id}`, {
            method: 'DELETE',
        });
    }

    // Transactions
    async getTransactions(params?: {
        type?: 'income' | 'expense';
        startDate?: string;
        endDate?: string;
        limit?: number;
    }) {
        const queryParams = new URLSearchParams(
            params as Record<string, string>
        ).toString();
        return this.request<{
            transactions: any[];
            summary: {
                income: number;
                expense: number;
                balance: number;
                count: number;
            };
        }>(
            `/api/transactions${queryParams ? `?${queryParams}` : ''}`
        );
    }

    async createTransaction(data: {
        type: 'income' | 'expense';
        amount: number;
        description?: string;
        date?: string;
        incomeTypeId?: string;
        expenseCategoryId?: string;
        bankAccountId?: string;
    }) {
        return this.request('/api/transactions', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateTransaction(id: string, data: any) {
        return this.request(`/api/transactions/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    async deleteTransaction(id: string) {
        return this.request(`/api/transactions/${id}`, {
            method: 'DELETE',
        });
    }

    // Categories
    async getIncomeTypes() {
        return this.request<{ incomeTypes: any[] }>('/api/categories/income');
    }

    async createIncomeType(data: {
        name: string;
        icon?: string;
        color?: string;
    }) {
        return this.request('/api/categories/income', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getExpenseCategories() {
        return this.request<{ expenseCategories: any[] }>(
            '/api/categories/expense'
        );
    }

    async createExpenseCategory(data: {
        name: string;
        icon?: string;
        color?: string;
    }) {
        return this.request('/api/categories/expense', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
}

export const api = new APIClient();