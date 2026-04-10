import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, generateToken } from '@/lib/auth';
import { createPrismaErrorResponse } from '@/lib/prisma-error';

export async function POST(req: NextRequest) {
    try {
        const { phone, password } = await req.json();

        const user = await prisma.user.findUnique({ where: { phone } });
        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isValid = await verifyPassword(password, user.password);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const token = generateToken({ userId: user.id, phone: user.phone });

        return NextResponse.json({
            user: { id: user.id, phone: user.phone, name: user.name, language: user.language },
            token,
        });
    } catch (error) {
        console.error('Login error:', error);
        return createPrismaErrorResponse(error, 'Login failed');
    }
}
