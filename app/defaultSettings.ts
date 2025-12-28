import type { CategoryItem } from './types';

// Default Income Types
export const defaultIncomeTypes: Omit<CategoryItem, 'id'>[] = [
    { name: 'Salary', icon: 'Briefcase', color: '#10B981', sortOrder: 0, enabled: true },
    { name: 'Freelance', icon: 'Zap', color: '#8B5CF6', sortOrder: 1, enabled: true },
    { name: 'Business', icon: 'TrendingUp', color: '#F59E0B', sortOrder: 2, enabled: true },
    { name: 'Investment', icon: 'PieChart', color: '#3B82F6', sortOrder: 3, enabled: true },
    { name: 'Gift', icon: 'Gift', color: '#EC4899', sortOrder: 4, enabled: true },
    { name: 'Bonus', icon: 'Award', color: '#10B981', sortOrder: 5, enabled: true },
    { name: 'Rental Income', icon: 'Home', color: '#6366F1', sortOrder: 6, enabled: true },
    { name: 'Other Income', icon: 'DollarSign', color: '#10B981', sortOrder: 7, enabled: true },
];

// Default Expense Categories
export const defaultExpenseCategories: Omit<CategoryItem, 'id'>[] = [
    { name: 'Food & Dining', icon: 'UtensilsCrossed', color: '#EF4444', sortOrder: 0, enabled: true },
    { name: 'Transportation', icon: 'Car', color: '#F59E0B', sortOrder: 1, enabled: true },
    { name: 'Shopping', icon: 'ShoppingCart', color: '#EC4899', sortOrder: 2, enabled: true },
    { name: 'Entertainment', icon: 'Gamepad2', color: '#8B5CF6', sortOrder: 3, enabled: true },
    { name: 'Bills & Utilities', icon: 'Receipt', color: '#EF4444', sortOrder: 4, enabled: true },
    { name: 'Healthcare', icon: 'Heart', color: '#DC2626', sortOrder: 5, enabled: true },
    { name: 'Education', icon: 'GraduationCap', color: '#3B82F6', sortOrder: 6, enabled: true },
    { name: 'Housing', icon: 'Home', color: '#F59E0B', sortOrder: 7, enabled: true },
    { name: 'Insurance', icon: 'Shield', color: '#6366F1', sortOrder: 8, enabled: true },
    { name: 'Personal Care', icon: 'Sparkles', color: '#EC4899', sortOrder: 9, enabled: true },
    { name: 'Gifts & Donations', icon: 'Gift', color: '#8B5CF6', sortOrder: 10, enabled: true },
    { name: 'Travel', icon: 'Plane', color: '#0EA5E9', sortOrder: 11, enabled: true },
    { name: 'Subscriptions', icon: 'Smartphone', color: '#EF4444', sortOrder: 12, enabled: true },
    { name: 'Other Expense', icon: 'MoreHorizontal', color: '#6B7280', sortOrder: 13, enabled: true },
];

// Bank Account Types
export const bankAccountTypes = [
    { value: 'checking', label: 'Checking Account', icon: 'Wallet' },
    { value: 'savings', label: 'Savings Account', icon: 'PiggyBank' },
    { value: 'ewallet', label: 'E-Wallet', icon: 'Smartphone' },
    { value: 'investment', label: 'Investment', icon: 'TrendingUp' },
    { value: 'credit_card', label: 'Credit Card', icon: 'CreditCard' },
];

// Default Bank Account Colors
export const bankAccountColors = [
    '#6366F1', // Indigo
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#F59E0B', // Amber
    '#10B981', // Emerald
    '#3B82F6', // Blue
    '#EF4444', // Red
    '#14B8A6', // Teal
    '#F97316', // Orange
    '#06B6D4', // Cyan
];

// Currency Options
export const currencies = [
    { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
    { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
];

// Locale Options
export const locales = [
    { code: 'id-ID', name: 'Indonesia' },
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'ja-JP', name: 'Japanese' },
    { code: 'zh-CN', name: 'Chinese (Simplified)' },
];

// Transaction Tags
export const commonTags = [
    'Personal',
    'Business',
    'Family',
    'Investment',
    'Emergency',
    'Recurring',
    'One-time',
    'Tax-deductible',
];

// Recurring Periods
export const recurringPeriods = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' },
];