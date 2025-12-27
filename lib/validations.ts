import { z } from 'zod';

// Auth Schemas
export const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must not exceed 20 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(100, 'Password is too long'),
    fullName: z.string().min(1, 'Full name is required').optional(),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

// Bank Account Schemas
export const createBankAccountSchema = z.object({
    name: z.string().min(1, 'Account name is required'),
    type: z.enum(['checking', 'savings', 'ewallet', 'investment', 'credit_card']),
    balance: z.number().default(0),
    currency: z.string().default('IDR'),
    color: z.string().default('#6366F1'),
    icon: z.string().optional(),
});

export const updateBankAccountSchema = createBankAccountSchema.partial();

// Transaction Schemas
export const createTransactionSchema = z.object({
    type: z.enum(['income', 'expense']),
    amount: z.number().positive('Amount must be positive'),
    description: z.string().optional(),
    notes: z.string().optional(),
    date: z.string().or(z.date()).optional(),
    incomeTypeId: z.string().uuid().optional(),
    expenseCategoryId: z.string().uuid().optional(),
    bankAccountId: z.string().uuid().optional(),
    tags: z.array(z.string()).default([]),
    isRecurring: z.boolean().default(false),
    recurringPeriod: z.string().optional(),
});

export const updateTransactionSchema = createTransactionSchema.partial();

// Category Schemas
export const createCategorySchema = z.object({
    name: z.string().min(1, 'Category name is required'),
    icon: z.string().default('DollarSign'),
    color: z.string().default('#10B981'),
    sortOrder: z.number().default(0),
    enabled: z.boolean().default(true),
});

export const updateCategorySchema = createCategorySchema.partial();

// Budget Schemas
export const createBudgetSchema = z.object({
    month: z.number().min(1).max(12),
    year: z.number().min(2000),
    planned: z.number().positive('Budget amount must be positive'),
    categoryId: z.string().uuid(),
});

export const updateBudgetSchema = createBudgetSchema.partial().extend({
    actual: z.number().optional(),
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateBankAccountInput = z.infer<typeof createBankAccountSchema>;
export type UpdateBankAccountInput = z.infer<typeof updateBankAccountSchema>;
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;