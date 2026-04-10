import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { createPrismaErrorResponse } from '@/lib/prisma-error';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ fieldId: string }> }
) {
    try {
        const { fieldId } = await params;
        const token = req.headers.get('authorization')?.replace('Bearer ', '');
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = verifyToken(token);
        if (!payload) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        // Get latest soil data for the field
        const soilData = await prisma.soilData.findFirst({
            where: {
                fieldId,
                field: {
                    farm: {
                        userId: payload.userId,
                    },
                },
            },
            orderBy: { timestamp: 'desc' },
        });

        if (!soilData) {
            return NextResponse.json(null);
        }

        return NextResponse.json(soilData);
    } catch (error) {
        console.error('Soil data fetch error:', error);
        return createPrismaErrorResponse(error, 'Failed to fetch soil data');
    }
}
