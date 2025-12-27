import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';
import { createCategorySchema } from '@/lib/validations';

// GET /api/categories/expense - Get all expense categories
export async function GET(request: NextRequest) {
    try {
        const tokenData = await getUserFromToken();

        if (!tokenData) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const expenseCategories = await prisma.expenseCategory.findMany({
            where: { userId: tokenData.userId },
            orderBy: { sortOrder: 'asc' },
        });

        return NextResponse.json({ expenseCategories });
    } catch (error) {
        console.error('Get expense categories error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/categories/expense - Create new expense category
export async function POST(request: NextRequest) {
    try {
        const tokenData = await getUserFromToken();

        if (!tokenData) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();

        // Validate input
        const validationResult = createCategorySchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { message: 'Validation failed', errors: validationResult.error.errors },
                { status: 400 }
            );
        }

        const expenseCategory = await prisma.expenseCategory.create({
            data: {
                ...validationResult.data,
                userId: tokenData.userId,
            },
        });

        return NextResponse.json(
            {
                message: 'Expense category created successfully',
                expenseCategory,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create expense category error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}