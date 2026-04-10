import axios from 'axios';

export interface MandiPrice {
    commodity: string;
    market: string;
    state: string;
    district: string;
    minPrice: number;
    maxPrice: number;
    modalPrice: number;
    date: string;
}

interface AgmarknetRecord {
    commodity?: string;
    market?: string;
    state?: string;
    district?: string;
    min_price?: string;
    max_price?: string;
    modal_price?: string;
    arrival_date?: string;
}

interface AgmarknetResponse {
    records?: AgmarknetRecord[];
}

const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
let priceCache: { data: MandiPrice[]; expiresAt: number } | null = null;

export async function fetchMandiPrices(commodity?: string): Promise<MandiPrice[]> {
    const apiKey = process.env.AGMARKNET_API_KEY;

    if (!apiKey) {
        console.warn('🛒 AGMARKNET_API_KEY not configured. Marketplace prices unavailable.');
        return [];
    }

    // Check cache
    if (priceCache && priceCache.expiresAt > Date.now()) {
        console.log('🛒 [MANDI SERVICE] Returning cached data');
        return commodity
            ? priceCache.data.filter(p => p.commodity.toLowerCase().includes(commodity.toLowerCase()))
            : priceCache.data;
    }

    try {
        console.log('\n🛒 ═══════════════════════════════════════════');
        console.log('🛒 MANDI SERVICE - Fetching Market Prices');
        console.log('🛒 ═══════════════════════════════════════════');
        console.log('🛒 API Key:', apiKey ? `${apiKey.substring(0, 20)}...` : '❌ MISSING');
        console.log('🛒 Timestamp:', new Date().toISOString());

        // Fetch data from AGMARKNET API
        const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${apiKey}&format=json&filters[state]=Karnataka&limit=100`;

        console.log('🛒 Fetching from:', url.replace(apiKey, 'API_KEY_HIDDEN'));

        const response = await axios.get<AgmarknetResponse>(url, {
            timeout: 10000,
            headers: {
                'Accept': 'application/json',
            }
        });

        console.log('🛒 Response Status:', response.status);
        console.log('🛒 Records Received:', response.data.records?.length || 0);

        if (!response.data.records || response.data.records.length === 0) {
            console.warn('🛒 No records found in API response');
            return [];
        }

        // Clean and transform data
        const cleaned = response.data.records
            .filter((item: AgmarknetRecord) => {
                // Filter out invalid records
                const hasRequiredFields = item.commodity && item.modal_price && item.market;
                const modalPrice = Number(item.modal_price);
                const isValidPrice = !isNaN(modalPrice) && modalPrice > 0;

                return hasRequiredFields && isValidPrice;
            })
            .map((item: AgmarknetRecord) => ({
                commodity: item.commodity!,
                market: item.market!,
                state: item.state || 'Karnataka',
                district: item.district || 'Unknown',
                minPrice: Number(item.min_price) || 0,
                maxPrice: Number(item.max_price) || 0,
                modalPrice: Number(item.modal_price!),
                date: item.arrival_date || new Date().toISOString().split('T')[0],
            }));

        console.log('🛒 Records After Cleaning:', cleaned.length);

        // Remove duplicates (same commodity + market)
        const uniquePrices = cleaned.reduce((acc: MandiPrice[], current) => {
            const exists = acc.find(
                item => item.commodity === current.commodity && item.market === current.market
            );
            if (!exists) {
                acc.push(current);
            }
            return acc;
        }, []);

        console.log('🛒 Unique Records:', uniquePrices.length);

        // Sort by modal price (highest first)
        uniquePrices.sort((a, b) => b.modalPrice - a.modalPrice);

        // Cache the results
        priceCache = {
            data: uniquePrices,
            expiresAt: Date.now() + CACHE_TTL_MS,
        };

        console.log('✅ [MANDI SERVICE] Successfully fetched and cached market prices');
        console.log('🛒 Top 5 Commodities:', uniquePrices.slice(0, 5).map(p => `${p.commodity}: ₹${p.modalPrice}`));
        console.log('🛒 ═══════════════════════════════════════════\n');

        // Return filtered results if commodity specified
        return commodity
            ? uniquePrices.filter(p => p.commodity.toLowerCase().includes(commodity.toLowerCase()))
            : uniquePrices;

    } catch (error) {
        console.error('\n🛒 ═══════════════════════════════════════════');
        console.error('❌ MANDI SERVICE ERROR');
        console.error('🛒 ═══════════════════════════════════════════');

        if (axios.isAxiosError(error)) {
            console.error('❌ Error:', {
                message: error.message,
                status: error.response?.status,
                statusText: error.response?.statusText,
                code: error.code,
            });
        } else if (error instanceof Error) {
            console.error('❌ Error:', error.message);
        } else {
            console.error('❌ Unknown error:', error);
        }

        console.error('🛒 ═══════════════════════════════════════════\n');
        return [];
    }
}

export async function fetchCommodityTrend(commodity: string, days: number = 30): Promise<Array<{ date: string; price: number }>> {
    // TODO: Integrate with AGMARKNET API for historical data
    // This would require multiple API calls with date filters
    console.warn('AGMARKNET historical data not yet implemented. Price trends unavailable.');
    return [];
}
