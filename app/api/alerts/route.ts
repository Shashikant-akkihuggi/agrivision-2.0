import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { createPrismaErrorResponse } from '@/lib/prisma-error';

export async function GET(req: NextRequest) {
    try {
        const token = req.headers.get('authorization')?.replace('Bearer ', '');
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = verifyToken(token);
        if (!payload) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const alerts = await prisma.alert.findMany({
            where: { userId: payload.userId },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });

        return NextResponse.json(alerts);
    } catch (error) {
        console.error('Alerts fetch error:', error);
        return createPrismaErrorResponse(error, 'Failed to fetch alerts');
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const token = req.headers.get('authorization')?.replace('Bearer ', '');
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = verifyToken(token);
        if (!payload) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const { alertId, isRead } = await req.json();

        const alert = await prisma.alert.update({
            where: { id: alertId, userId: payload.userId },
            data: { isRead },
        });

        return NextResponse.json(alert);
    } catch (error) {
        console.error('Alert update error:', error);
        return createPrismaErrorResponse(error, 'Failed to update alert');
    }
}
