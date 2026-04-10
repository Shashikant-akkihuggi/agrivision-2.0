import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { fetchWeatherData, fetchForecastData } from '@/lib/weather-service';

export async function GET(req: NextRequest) {
    console.log('\n🌐 ═══════════════════════════════════════════');
    console.log('🌐 WEATHER API ROUTE - GET Request');
    console.log('🌐 ═══════════════════════════════════════════');
    console.log('🌐 URL:', req.url);
    console.log('🌐 Method:', req.method);
    console.log('🌐 Timestamp:', new Date().toISOString());

    try {
        const token = req.headers.get('authorization')?.replace('Bearer ', '');
        console.log('🔐 Token:', token ? `${token.substring(0, 20)}...` : '❌ MISSING');

        if (!token) {
            console.error('❌ Unauthorized - No token provided');
            console.log('🌐 ═══════════════════════════════════════════\n');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = verifyToken(token);
        console.log('✅ Token verified:', payload ? 'Valid' : 'Invalid');

        if (!payload) {
            console.error('❌ Invalid token');
            console.log('🌐 ═══════════════════════════════════════════\n');
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const lat = parseFloat(searchParams.get('lat') || '0');
        const lon = parseFloat(searchParams.get('lon') || '0');
        const type = searchParams.get('type') || 'current';

        console.log('📍 Request Parameters:', { lat, lon, type });

        if (type === 'forecast') {
            console.log('🔄 Fetching forecast data...');
            const forecast = await fetchForecastData(lat, lon);

            if (!forecast) {
                console.error('❌ Forecast data is null');
                console.log('🌐 ═══════════════════════════════════════════\n');
                return NextResponse.json({ error: 'Failed to fetch forecast' }, { status: 500 });
            }

            console.log('✅ Returning forecast data:', {
                hourlyCount: forecast.hourly.length,
                dailyCount: forecast.daily.length,
            });
            console.log('🌐 ═══════════════════════════════════════════\n');
            return NextResponse.json(forecast);
        }

        console.log('🔄 Fetching current weather data...');
        const weather = await fetchWeatherData(lat, lon);

        if (!weather) {
            console.error('❌ Weather data is null');
            console.log('🌐 ═══════════════════════════════════════════\n');
            return NextResponse.json({ error: 'Failed to fetch weather' }, { status: 500 });
        }

        console.log('✅ Returning weather data:', JSON.stringify(weather, null, 2));
        console.log('🌐 ═══════════════════════════════════════════\n');
        return NextResponse.json(weather);
    } catch (error: any) {
        console.error('\n🌐 ═══════════════════════════════════════════');
        console.error('❌ WEATHER API ROUTE ERROR');
        console.error('🌐 ═══════════════════════════════════════════');
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);
        console.error('🌐 ═══════════════════════════════════════════\n');
        return NextResponse.json({ error: 'Failed to fetch weather' }, { status: 500 });
    }
}
