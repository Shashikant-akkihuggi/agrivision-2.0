import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { createPrismaErrorResponse } from '@/lib/prisma-error';

export async function POST(req: NextRequest) {
    try {
        const token = req.headers.get('authorization')?.replace('Bearer ', '');
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = verifyToken(token);
        if (!payload) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const farms = await prisma.farm.findMany({
            where: { userId: payload.userId },
        });

        const totalArea = farms.reduce((sum, farm) => sum + farm.totalArea, 0);

        let eligible = false;
        let maxAmount = 0;
        let interestRate = 7;
        let reason = '';

        if (totalArea >= 5) {
            eligible = true;
            maxAmount = 100000;
            interestRate = 5;
            reason = 'Large farm holder - Premium eligibility';
        } else if (totalArea >= 2) {
            eligible = true;
            maxAmount = 50000;
            interestRate = 6;
            reason = 'Medium farm holder - Standard eligibility';
        } else if (totalArea >= 0.5) {
            eligible = true;
            maxAmount = 25000;
            interestRate = 7;
            reason = 'Small farm holder - Basic eligibility';
        } else {
            eligible = false;
            reason = 'Minimum 0.5 acres required';
        }

        return NextResponse.json({
            eligible,
            maxAmount,
            interestRate,
            reason,
            totalArea,
        });
    } catch (error) {
        console.error('Loan eligibility error:', error);
        return createPrismaErrorResponse(error, 'Failed to check eligibility');
    }
}
