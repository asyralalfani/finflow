import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';
import { createTransactionSchema } from '@/lib/validations';

// GET /api/transactions - Get all transactions
export async function GET(request: NextRequest) {
    try {
        const tokenData = await getUserFromToken();

        if (!tokenData) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const limit = searchParams.get('limit');

        const transactions = await prisma.transaction.findMany({
            where: {
                userId: tokenData.userId,
                ...(type && { type }),
                ...(startDate &&
                    endDate && {
                    date: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                }),
            },
            include: {
                incomeType: true,
                expenseCategory: true,
                bankAccount: true,
            },
            orderBy: { date: 'desc' },
            ...(limit && { take: parseInt(limit) }),
        });

        // Calculate totals
        const income = transactions
            .filter((t) => t.type === 'income')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        const expense = transactions
            .filter((t) => t.type === 'expense')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        return NextResponse.json({
            transactions,
            summary: {
                income,
                expense,
                balance: income - expense,
                count: transactions.length,
            },
        });
    } catch (error) {
        console.error('Get transactions error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/transactions - Create new transaction
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
        const validationResult = createTransactionSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { message: 'Validation failed', errors: validationResult.error.errors },
                { status: 400 }
            );
        }

        const data = validationResult.data;

        // Create transaction and update bank account balance
        const transaction = await prisma.$transaction(async (tx) => {
            // Create transaction
            const newTransaction = await tx.transaction.create({
                data: {
                    ...data,
                    userId: tokenData.userId,
                    date: data.date ? new Date(data.date) : new Date(),
                },
                include: {
                    incomeType: true,
                    expenseCategory: true,
                    bankAccount: true,
                },
            });

            // Update bank account balance if specified
            if (data.bankAccountId) {
                await tx.bankAccount.update({
                    where: { id: data.bankAccountId },
                    data: {
                        balance: {
                            increment:
                                data.type === 'income'
                                    ? data.amount
                                    : -data.amount,
                        },
                    },
                });
            }

            return newTransaction;
        });

        return NextResponse.json(
            {
                message: 'Transaction created successfully',
                transaction,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create transaction error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}