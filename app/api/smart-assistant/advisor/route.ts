import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { crop, location } = body;

        if (!crop) {
            return NextResponse.json(
                { error: 'Crop name is required' },
                { status: 400 }
            );
        }

        // Simulate AI advisory generation with realistic data
        // In production, this would call an actual AI service or use the AgriAdvisor class
        const advisory = {
            immediateActions: [
                `Monitor ${crop} crop for pest activity in next 3 days`,
                `Check soil moisture levels—irrigate if below 40%`,
                `Weather forecast shows rain in 2 days—adjust irrigation schedule`,
            ],
            riskAlerts: {
                weather: [
                    'Moderate rain expected in 48 hours. Ensure proper drainage.',
                ],
                disease: [
                    `${crop} is susceptible to fungal diseases in humid conditions. Monitor closely.`,
                ],
                market: [
                    'Market prices showing slight volatility. Consider timing your sale carefully.',
                ],
            },
            marketDecision: {
                action: 'HOLD',
                reasoning: `Current ${crop} prices are stable. Hold for 3-5 days and monitor daily rates. Sell if prices rise 5%+.`,
                confidence: 'medium',
            },
            whereToSell: {
                recommended: {
                    market: `${location || 'Local'} APMC Market`,
                    price: 2500,
                    netProfit: 2000,
                },
                alternatives: [
                    {
                        market: 'Nearby District Market',
                        price: 2400,
                        netProfit: 1950,
                        reason: '₹50 less profit but closer (lower transport risk)',
                    },
                ],
            },
            profitOptimization: `Grade your ${crop} produce before selling. Premium quality can fetch 15-20% higher prices. Separate damaged produce for local sale.`,
        };

        return NextResponse.json({
            advisory,
            metadata: {
                crop,
                location: location || 'Not specified',
                generatedAt: new Date().toISOString(),
            },
        });
    } catch (error: any) {
        console.error('Advisor API error:', error);
        return NextResponse.json(
            { error: 'Failed to generate advisory. Please try again.' },
            { status: 500 }
        );
    }
}
