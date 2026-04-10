import { NextRequest, NextResponse } from 'next/server';
import { fetchMandiPrices } from '@/lib/mandi-service';

export async function POST(req: NextRequest) {
    let requestBody: any = null;

    try {
        requestBody = await req.json();
        const { crop, location } = requestBody;

        if (!crop) {
            return NextResponse.json(
                { error: 'Crop name is required' },
                { status: 400 }
            );
        }

        // Fetch real market prices
        let marketPrices = await fetchMandiPrices(crop);

        // If no real data, use fallback
        if (!marketPrices || marketPrices.length === 0) {
            console.warn('No market data found, using fallback');
            marketPrices = [
                {
                    commodity: crop,
                    market: `${location || 'Local'} Market`,
                    state: 'Karnataka',
                    district: location || 'Local',
                    minPrice: 2000,
                    maxPrice: 2800,
                    modalPrice: 2400,
                    date: new Date().toISOString(),
                },
                {
                    commodity: crop,
                    market: 'District Market',
                    state: 'Karnataka',
                    district: 'Nearby',
                    minPrice: 1900,
                    maxPrice: 2700,
                    modalPrice: 2300,
                    date: new Date().toISOString(),
                },
            ];
        }

        // Calculate transport costs (simplified formula: ₹10 per km)
        const calculateTransportCost = (distance: number) => {
            return Math.round(distance * 10);
        };

        // Assign distances (in production, use actual distance calculation)
        const marketsWithDistance = marketPrices.slice(0, 5).map((market, idx) => ({
            name: `${market.market}, ${market.district}`,
            price: market.modalPrice,
            distance: 20 + (idx * 15), // Simulated distances
            transportCost: calculateTransportCost(20 + (idx * 15)),
            netProfit: 0, // Will calculate below
        }));

        // Calculate net profit
        marketsWithDistance.forEach(market => {
            market.netProfit = market.price - market.transportCost;
        });

        // Sort by net profit
        marketsWithDistance.sort((a, b) => b.netProfit - a.netProfit);

        const bestMarket = marketsWithDistance[0];
        const alternatives = marketsWithDistance.slice(1, 4);

        // Generate recommendation
        const priceDiff = bestMarket.price - (alternatives[0]?.price || bestMarket.price);
        let recommendation = '';

        if (priceDiff > 200) {
            recommendation = `${bestMarket.name} offers significantly better prices (₹${priceDiff} more per quintal). Worth the extra transport cost for bulk sales (10+ quintals).`;
        } else if (bestMarket.distance > 50) {
            recommendation = `${bestMarket.name} has the best net profit, but consider ${alternatives[0]?.name} if you prefer shorter distance and lower transport risk.`;
        } else {
            recommendation = `${bestMarket.name} provides the best balance of price and transport cost. Recommended for immediate sale.`;
        }

        return NextResponse.json({
            bestMarket,
            alternatives,
            recommendation,
            metadata: {
                crop,
                location: location || 'Not specified',
                marketsAnalyzed: marketsWithDistance.length,
                generatedAt: new Date().toISOString(),
            },
        });
    } catch (error: any) {
        console.error('Supply chain API error:', error);

        // Fallback response with safe defaults
        return NextResponse.json({
            bestMarket: {
                name: 'Local Market',
                price: 2400,
                distance: 20,
                transportCost: 200,
                netProfit: 2200,
            },
            alternatives: [
                {
                    name: 'District Market',
                    price: 2300,
                    distance: 35,
                    transportCost: 350,
                    netProfit: 1950,
                },
            ],
            recommendation: 'Local Market provides the best net profit. Recommended for immediate sale.',
            metadata: {
                crop: requestBody?.crop || 'Unknown',
                location: requestBody?.location || 'Not specified',
                marketsAnalyzed: 2,
                generatedAt: new Date().toISOString(),
                note: 'Using fallback data due to API unavailability',
            },
        });
    }
}
