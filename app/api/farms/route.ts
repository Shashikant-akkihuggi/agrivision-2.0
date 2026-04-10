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

        const farms = await prisma.farm.findMany({
            where: { userId: payload.userId },
            include: { fields: true },
        });

        return NextResponse.json(farms);
    } catch (error) {
        console.error('Fetch farms error:', error);
        return createPrismaErrorResponse(error, 'Failed to fetch farms');
    }
}

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

        const { name, location, latitude, longitude, totalArea, soilType } = await req.json();

        const farm = await prisma.farm.create({
            data: {
                userId: payload.userId,
                name,
                location,
                latitude,
                longitude,
                totalArea,
                soilType,
            },
        });

        return NextResponse.json(farm);
    } catch (error) {
        console.error('Create farm error:', error);
        return createPrismaErrorResponse(error, 'Failed to create farm');
    }
}
