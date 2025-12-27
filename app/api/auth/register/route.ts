import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, createToken, setAuthCookie } from '@/lib/auth';
import { registerSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const validationResult = registerSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { message: 'Validation failed', errors: validationResult.error.errors },
                { status: 400 }
            );
        }

        const { email, username, password, fullName } = validationResult.data;

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }],
            },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: 'Email or username already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user with default categories
        const user = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                fullName,
                // Create default income types
                incomeTypes: {
                    create: [
                        { name: 'Salary', icon: 'Briefcase', color: '#10B981', sortOrder: 0 },
                        { name: 'Freelance', icon: 'Zap', color: '#8B5CF6', sortOrder: 1 },
                        { name: 'Business', icon: 'TrendingUp', color: '#F59E0B', sortOrder: 2 },
                        { name: 'Investment', icon: 'PieChart', color: '#3B82F6', sortOrder: 3 },
                        { name: 'Other Income', icon: 'DollarSign', color: '#10B981', sortOrder: 4 },
                    ],
                },
                // Create default expense categories
                expenseCategories: {
                    create: [
                        { name: 'Food & Dining', icon: 'UtensilsCrossed', color: '#EF4444', sortOrder: 0 },
                        { name: 'Transportation', icon: 'Car', color: '#F59E0B', sortOrder: 1 },
                        { name: 'Shopping', icon: 'ShoppingCart', color: '#EC4899', sortOrder: 2 },
                        { name: 'Entertainment', icon: 'Gamepad2', color: '#8B5CF6', sortOrder: 3 },
                        { name: 'Bills & Utilities', icon: 'Receipt', color: '#EF4444', sortOrder: 4 },
                        { name: 'Healthcare', icon: 'Heart', color: '#DC2626', sortOrder: 5 },
                        { name: 'Education', icon: 'GraduationCap', color: '#3B82F6', sortOrder: 6 },
                        { name: 'Other Expense', icon: 'MoreHorizontal', color: '#6B7280', sortOrder: 7 },
                    ],
                },
                // Create default bank account
                bankAccounts: {
                    create: {
                        name: 'Cash',
                        type: 'checking',
                        balance: 0,
                        color: '#6366F1',
                        icon: 'Wallet',
                    },
                },
            },
            select: {
                id: true,
                email: true,
                username: true,
                fullName: true,
                themeId: true,
                currency: true,
                locale: true,
                createdAt: true,
            },
        });

        // Create JWT token
        const token = await createToken({
            userId: user.id,
            email: user.email,
        });

        // Set cookie
        await setAuthCookie(token);

        return NextResponse.json(
            {
                message: 'User registered successfully',
                user,
                token,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}