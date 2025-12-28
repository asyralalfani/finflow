// User Types
export interface User {
    id: string;
    email: string;
    username: string;
    fullName?: string;
    avatar?: string;
    themeId: string;
    currency: string;
    locale: string;
    createdAt: string;
    lastLoginAt?: string;
}

// Bank Account Types
export interface BankAccount {
    id: string;
    name: string;
    type: 'checking' | 'savings' | 'ewallet' | 'investment' | 'credit_card';
    balance: number;
    currency: string;
    color: string;
    icon?: string;
    enabled: boolean;
    createdAt: string;
    updatedAt: string;
}

// Transaction Types
export interface Transaction {
    id: string;
    type: 'income' | 'expense';
    amount: number;
    description?: string;
    notes?: string;
    date: string;
    tags: string[];
    isRecurring: boolean;
    recurringPeriod?: string;
    incomeTypeId?: string;
    incomeType?: IncomeType;
    expenseCategoryId?: string;
    expenseCategory?: ExpenseCategory;
    bankAccountId?: string;
    bankAccount?: BankAccount;
    createdAt: string;
    updatedAt: string;
}

// Category Types
export interface CategoryItem {
    id: string;
    name: string;
    icon: string;
    color: string;
    sortOrder: number;
    enabled: boolean;
}

export interface IncomeType extends CategoryItem {
    createdAt: string;
    updatedAt: string;
}

export interface ExpenseCategory extends CategoryItem {
    createdAt: string;
    updatedAt: string;
}

// Budget Types
export interface Budget {
    id: string;
    month: number;
    year: number;
    planned: number;
    actual: number;
    categoryId: string;
    category?: ExpenseCategory;
    createdAt: string;
    updatedAt: string;
}

// App Settings
export interface AppSettings {
    themeId: string;
    currency: string;
    locale: string;
    incomeTypes: CategoryItem[];
    expenseCategories: CategoryItem[];
}

// Summary Types
export interface Summary {
    income: number;
    expense: number;
    balance: number;
    count: number;
}

// Filter Types
export interface TransactionFilter {
    type?: 'income' | 'expense';
    startDate?: string;
    endDate?: string;
    categoryId?: string;
    bankAccountId?: string;
    limit?: number;
}