import { NextResponse } from 'next/server';

type PrismaLikeError = {
    code?: string;
    message?: string;
};

function usesSupabasePooler(url?: string) {
    return Boolean(url?.includes('.pooler.supabase.com'));
}

function getConnectionHint() {
    if (usesSupabasePooler(process.env.DATABASE_URL)) {
        return 'DATABASE_URL is using a Supabase pooler host. Verify the pooler username and password exactly, or switch to the direct db.<project-ref>.supabase.co connection string from SUPABASE_SETUP.md for local Prisma access.';
    }

    return 'Verify DATABASE_URL points to a reachable PostgreSQL database and that the credentials are correct.';
}

export function createPrismaErrorResponse(error: unknown, fallbackMessage: string) {
    const prismaError = error as PrismaLikeError;
    const message = prismaError?.message || '';
    const details = message || fallbackMessage;
    const debugDetails = process.env.NODE_ENV !== 'production' ? { details } : {};

    if (prismaError?.code === 'P2002') {
        return NextResponse.json({ error: 'A record with this value already exists' }, { status: 400 });
    }

    if (prismaError?.code === 'P2021' || message.includes('does not exist')) {
        return NextResponse.json({
            error: 'Database schema is missing or out of date.',
            ...debugDetails,
            setupHint: 'Run `npm run db:push` against the correct database, or create the tables in Supabase SQL Editor using SUPABASE_SETUP.md.',
        }, { status: 500 });
    }

    if (
        prismaError?.code === 'P1000' ||
        message.includes('Tenant or user not found') ||
        message.includes('authentication failed')
    ) {
        return NextResponse.json({
            error: 'Database authentication failed.',
            ...debugDetails,
            setupHint: getConnectionHint(),
        }, { status: 503 });
    }

    if (
        prismaError?.code === 'P1001' ||
        message.includes("Can't reach database server") ||
        message.toLowerCase().includes('connect')
    ) {
        return NextResponse.json({
            error: 'Cannot reach the database server.',
            ...debugDetails,
            setupHint: getConnectionHint(),
        }, { status: 503 });
    }

    return NextResponse.json({ error: fallbackMessage, ...debugDetails }, { status: 500 });
}
