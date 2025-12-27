import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken, clearAuthCookie } from '@/lib/auth';

// GET /api/auth/me - Get current user profile
export async function GET(request: NextRequest) {
    try {
        const tokenData = await getUserFromToken();

        if (!tokenData) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: tokenData.userId },
            select: {
                id: true,
                email: true,
                username: true,
                fullName: true,
                avatar: true,
                themeId: true,
                currency: true,
                locale: true,
                createdAt: true,
                lastLoginAt: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Get profile error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/auth/me - Logout (clear cookie)
export async function DELETE(request: NextRequest) {
    try {
        await clearAuthCookie();

        return NextResponse.json({
            message: 'Logged out successfully',
        });
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PATCH /api/auth/me - Update user profile
export async function PATCH(request: NextRequest) {
    try {
        const tokenData = await getUserFromToken();

        if (!tokenData) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { fullName, avatar, themeId, currency, locale } = body;

        const user = await prisma.user.update({
            where: { id: tokenData.userId },
            data: {
                ...(fullName !== undefined && { fullName }),
                ...(avatar !== undefined && { avatar }),
                ...(themeId !== undefined && { themeId }),
                ...(currency !== undefined && { currency }),
                ...(locale !== undefined && { locale }),
            },
            select: {
                id: true,
                email: true,
                username: true,
                fullName: true,
                avatar: true,
                themeId: true,
                currency: true,
                locale: true,
                createdAt: true,
            },
        });

        return NextResponse.json({
            message: 'Profile updated successfully',
            user,
        });
    } catch (error) {
        console.error('Update profile error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}