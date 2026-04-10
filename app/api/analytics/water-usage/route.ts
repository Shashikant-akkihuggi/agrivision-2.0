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

        const { searchParams } = new URL(req.url);
        const months = parseInt(searchParams.get('months') || '6');

        // Get user's farms and fields
        const farms = await prisma.farm.findMany({
            where: { userId: payload.userId },
            include: { fields: true },
        });

        if (farms.length === 0) {
            return NextResponse.json([]);
        }

        const fieldIds = farms.flatMap(f => f.fields.map(field => field.id));

        // Get irrigation logs grouped by month
        const logs = await prisma.irrigationLog.findMany({
            where: {
                fieldId: { in: fieldIds },
                createdAt: {
                    gte: new Date(Date.now() - months * 30 * 24 * 60 * 60 * 1000),
                },
            },
            orderBy: { createdAt: 'asc' },
        });

        // Group by month
        const monthlyData: { [key: string]: { usage: number; saved: number } } = {};

        logs.forEach(log => {
            const monthKey = new Date(log.createdAt).toLocaleDateString('en-US', { month: 'short' });
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { usage: 0, saved: 0 };
            }
            monthlyData[monthKey].usage += log.waterAmount || 0;
            monthlyData[monthKey].saved += log.waterSaved || 0;
        });

        // Convert to array format
        const result = Object.entries(monthlyData).map(([month, data]) => ({
            month,
            usage: Math.round(data.usage),
            saved: Math.round(data.saved),
        }));

        return NextResponse.json(result);
    } catch (error) {
        console.error('Water usage error:', error);
        return createPrismaErrorResponse(error, 'Failed to fetch water usage');
    }
}
