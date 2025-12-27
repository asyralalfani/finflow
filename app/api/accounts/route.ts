import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';
import { createBankAccountSchema } from '@/lib/validations';

// GET /api/accounts - Get all bank accounts
export async function GET(request: NextRequest) {
    try {
        const tokenData = await getUserFromToken();

        if (!tokenData) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const accounts = await prisma.bankAccount.findMany({
            where: { userId: tokenData.userId },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ accounts });
    } catch (error) {
        console.error('Get accounts error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/accounts - Create new bank account
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
        const validationResult = createBankAccountSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { message: 'Validation failed', errors: validationResult.error.errors },
                { status: 400 }
            );
        }

        const account = await prisma.bankAccount.create({
            data: {
                ...validationResult.data,
                userId: tokenData.userId,
            },
        });

        return NextResponse.json(
            {
                message: 'Bank account created successfully',
                account,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create account error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}