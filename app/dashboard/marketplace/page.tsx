"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Activity, ShoppingCart } from "lucide-react";
import { formatDecimal } from "@/lib/utils";

export default function MarketplacePage() {
    const token = useAuthStore((state) => state.token);
    const [prices, setPrices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCommodity, setSelectedCommodity] = useState<string | null>(null);

    useEffect(() => {
        const fetchPrices = async () => {
            setLoading(true);
            try {
                console.log('🛒 [FRONTEND] Fetching marketplace prices...');

                const res = await fetch("/api/marketplace/prices", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log('🛒 [FRONTEND] API Status:', res.status);

                if (!res.ok) {
                    console.error('🛒 [FRONTEND] API returned error status');
                    setPrices([]);
                    return;
                }

                const data = await res.json();
                console.log('🛒 [FRONTEND] Prices received:', data.length);

                setPrices(data);
            } catch (error) {
                console.error("🛒 [FRONTEND] Failed to fetch prices:", error);
                setPrices([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPrices();
    }, [token]);

    if (loading) {
        return (
            <div className="p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
                    <p className="text-gray-500 mt-1">Live Mandi Data & Price Trends</p>
                </div>
                <Card>
                    <CardContent className="p-12 text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
                        <h3 className="text-lg font-semibold mb-2">Fetching Real Market Prices</h3>
                        <p className="text-gray-500">
                            Loading live mandi data from AGMARKNET API...
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                            This may take a few seconds
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const commodities = [...new Set(prices.map((p) => p.commodity))];
    const filteredPrices = selectedCommodity
        ? prices.filter(p => p.commodity === selectedCommodity)
        : prices;

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
                <p className="text-gray-500 mt-1">Live Mandi Data & Price Trends</p>
                <p className="text-xs text-gray-400 mt-1">
                    Last updated: {new Date().toLocaleTimeString()}
                </p>
            </div>

            {prices.length > 0 ? (
                <>
                    <div className="mb-6">
                        <div className="flex gap-2 flex-wrap">
                            <Button
                                variant={selectedCommodity === null ? "default" : "outline"}
                                onClick={() => setSelectedCommodity(null)}
                            >
                                All Commodities
                            </Button>
                            {commodities.map((commodity) => (
                                <Button
                                    key={commodity}
                                    variant={selectedCommodity === commodity ? "default" : "outline"}
                                    onClick={() => setSelectedCommodity(commodity)}
                                >
                                    {commodity}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500">Avg Market Price</CardTitle>
                                <Activity className="w-4 h-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    ₹{formatDecimal(prices.reduce((sum, p) => sum + p.modalPrice, 0) / prices.length, 0)}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Per quintal</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500">Highest Price</CardTitle>
                                <TrendingUp className="w-4 h-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    ₹{formatDecimal(Math.max(...prices.map((p) => p.maxPrice)), 0)}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    {prices.find((p) => p.maxPrice === Math.max(...prices.map((p) => p.maxPrice)))?.commodity}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500">Markets Tracked</CardTitle>
                                <Activity className="w-4 h-4 text-purple-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{new Set(prices.map((p) => p.market)).size}</div>
                                <p className="text-xs text-gray-500 mt-1">Across India</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Live Mandi Prices</CardTitle>
                            <p className="text-sm text-gray-500">Updated: {new Date().toLocaleDateString()}</p>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 font-semibold text-sm">Commodity</th>
                                            <th className="text-left py-3 px-4 font-semibold text-sm">Market</th>
                                            <th className="text-left py-3 px-4 font-semibold text-sm">State</th>
                                            <th className="text-right py-3 px-4 font-semibold text-sm">Min Price</th>
                                            <th className="text-right py-3 px-4 font-semibold text-sm">Max Price</th>
                                            <th className="text-right py-3 px-4 font-semibold text-sm">Modal Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredPrices.map((price, idx) => (
                                            <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-3 px-4 font-medium">{price.commodity}</td>
                                                <td className="py-3 px-4 text-sm">{price.market}</td>
                                                <td className="py-3 px-4 text-sm">{price.state}</td>
                                                <td className="py-3 px-4 text-right">₹{formatDecimal(price.minPrice, 0)}</td>
                                                <td className="py-3 px-4 text-right">₹{formatDecimal(price.maxPrice, 0)}</td>
                                                <td className="py-3 px-4 text-right font-semibold">₹{formatDecimal(price.modalPrice, 0)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mt-6 bg-yellow-50 border-yellow-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg mb-1">Sell Your Produce</h3>
                                    <p className="text-sm text-gray-600">List your crops and connect with buyers</p>
                                </div>
                                <Button size="lg">Create Listing</Button>
                            </div>
                        </CardContent>
                    </Card>
                </>
            ) : (
                <Card>
                    <CardContent className="p-12 text-center">
                        <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Marketplace Data Unavailable</h3>
                        <p className="text-gray-500 mb-4">
                            Mandi price data is not currently available
                        </p>
                        <p className="text-sm text-gray-400 mb-6">
                            Configure AGMARKNET API key in settings to enable live market prices
                        </p>
                        <div className="bg-blue-50 p-4 rounded-lg text-left max-w-md mx-auto">
                            <p className="text-sm font-medium mb-2">To enable marketplace:</p>
                            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                                <li>Get API key from data.gov.in</li>
                                <li>Add AGMARKNET_API_KEY to .env</li>
                                <li>Restart the application</li>
                            </ol>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
