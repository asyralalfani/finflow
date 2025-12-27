import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';
import { createCategorySchema } from '@/lib/validations';

// GET /api/categories/income - Get all income types
export async function GET(request: NextRequest) {
    try {
        const tokenData = await getUserFromToken();

        if (!tokenData) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const incomeTypes = await prisma.incomeType.findMany({
            where: { userId: tokenData.userId },
            orderBy: { sortOrder: 'asc' },
        });

        return NextResponse.json({ incomeTypes });
    } catch (error) {
        console.error('Get income types error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/categories/income - Create new income type
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

        const incomeType = await prisma.incomeType.create({
            data: {
                ...validationResult.data,
                userId: tokenData.userId,
            },
        });

        return NextResponse.json(
            {
                message: 'Income type created successfully',
                incomeType,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create income type error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}