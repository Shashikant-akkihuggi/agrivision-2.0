import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';
import { createPrismaErrorResponse } from '@/lib/prisma-error';

export async function POST(req: NextRequest) {
    try {
        const { phone, name, password, language } = await req.json();

        // Validate input
        if (!phone || !name || !password) {
            return NextResponse.json({
                error: 'Missing required fields: phone, name, and password are required'
            }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({
                error: 'Password must be at least 6 characters long'
            }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ where: { phone } });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);
        const user = await prisma.user.create({
            data: { phone, name, password: hashedPassword, language: language || 'en' },
        });

        const token = generateToken({ userId: user.id, phone: user.phone });

        return NextResponse.json({
            user: { id: user.id, phone: user.phone, name: user.name, language: user.language },
            token,
        });
    } catch (error: any) {
        console.error('Registration error:', error);

        // Provide more specific error messages
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Phone number already registered' }, { status: 400 });
        }

        return createPrismaErrorResponse(
            error,
            error.message || 'Registration failed. Please check server logs.'
        );
    }
}
