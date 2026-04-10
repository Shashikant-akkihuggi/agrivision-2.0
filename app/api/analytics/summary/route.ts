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

        // Get user's farms
        const farms = await prisma.farm.findMany({
            where: { userId: payload.userId },
            include: { fields: true },
        });

        if (farms.length === 0) {
            return NextResponse.json({
                waterSaved: 0,
                efficiency: 0,
                alerts: 0,
                revenue: 0,
            });
        }

        // Get irrigation logs for water calculations
        const fieldIds = farms.flatMap(f => f.fields.map(field => field.id));

        const irrigationLogs = await prisma.irrigationLog.findMany({
            where: {
                fieldId: { in: fieldIds },
                createdAt: {
                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
                },
            },
        });

        // Calculate real metrics
        const waterSaved = irrigationLogs.reduce((sum, log) => sum + (log.waterSaved || 0), 0);
        const waterUsed = irrigationLogs.reduce((sum, log) => sum + (log.waterAmount || 0), 0);
        const totalWater = waterSaved + waterUsed;
        const efficiency = totalWater > 0 ? Math.round((waterSaved / totalWater) * 100) : 0;

        // Get active alerts count
        const alertsCount = await prisma.alert.findMany({
            where: {
                userId: payload.userId,
                isRead: false,
            },
        });

        return NextResponse.json({
            waterSaved: Math.round(waterSaved),
            efficiency,
            alerts: alertsCount.length,
            revenue: 0, // TODO: Calculate from marketplace transactions
        });
    } catch (error) {
        console.error('Analytics summary error:', error);
        return createPrismaErrorResponse(error, 'Failed to fetch analytics');
    }
}
