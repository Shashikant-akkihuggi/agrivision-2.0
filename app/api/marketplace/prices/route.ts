import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { fetchMandiPrices } from '@/lib/mandi-service';

export async function GET(req: NextRequest) {
    console.log('\n🛒 ═══════════════════════════════════════════');
    console.log('🛒 MARKETPLACE API ROUTE - GET Request');
    console.log('🛒 ═══════════════════════════════════════════');
    console.log('🛒 URL:', req.url);
    console.log('🛒 Method:', req.method);
    console.log('🛒 Timestamp:', new Date().toISOString());

    try {
        const token = req.headers.get('authorization')?.replace('Bearer ', '');
        console.log('🔐 Token:', token ? `${token.substring(0, 20)}...` : '❌ MISSING');

        if (!token) {
            console.error('❌ Unauthorized - No token provided');
            console.log('🛒 ═══════════════════════════════════════════\n');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = verifyToken(token);
        console.log('✅ Token verified:', payload ? 'Valid' : 'Invalid');

        if (!payload) {
            console.error('❌ Invalid token');
            console.log('🛒 ═══════════════════════════════════════════\n');
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const commodity = searchParams.get('commodity') || undefined;

        console.log('📍 Request Parameters:', { commodity: commodity || 'All' });
        console.log('🔄 Fetching mandi prices...');

        const prices = await fetchMandiPrices(commodity);

        console.log('✅ Returning mandi prices:', {
            count: prices.length,
            commodities: [...new Set(prices.map(p => p.commodity))].length,
            markets: [...new Set(prices.map(p => p.market))].length,
        });
        console.log('🛒 ═══════════════════════════════════════════\n');

        return NextResponse.json(prices);
    } catch (error: any) {
        console.error('\n🛒 ═══════════════════════════════════════════');
        console.error('❌ MARKETPLACE API ROUTE ERROR');
        console.error('🛒 ═══════════════════════════════════════════');
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);
        console.error('🛒 ═══════════════════════════════════════════\n');
        return NextResponse.json({ error: 'Failed to fetch prices' }, { status: 500 });
    }
}
