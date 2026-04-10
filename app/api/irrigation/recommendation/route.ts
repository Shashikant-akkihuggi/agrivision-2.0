import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { createPrismaErrorResponse } from '@/lib/prisma-error';
import {
    getIrrigationRecommendation,
    IrrigationRecommendationError,
} from '@/lib/irrigation-recommendation';

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
        const fieldId = searchParams.get('fieldId');

        if (!fieldId) {
            return NextResponse.json({ error: 'fieldId is required' }, { status: 400 });
        }

        const recommendation = await getIrrigationRecommendation(payload.userId, fieldId);
        return NextResponse.json(recommendation);
    } catch (error) {
        console.error('Irrigation recommendation error:', error);

        if (error instanceof IrrigationRecommendationError) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }

        return createPrismaErrorResponse(error, 'Failed to generate irrigation recommendation');
    }
}
