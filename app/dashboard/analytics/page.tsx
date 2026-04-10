"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Droplets, DollarSign, Activity } from "lucide-react";
import { formatNumber } from "@/lib/utils";

export default function AnalyticsPage() {
    const token = useAuthStore((state) => state.token);
    const [waterUsageData, setWaterUsageData] = useState<any[]>([]);
    const [summary, setSummary] = useState({
        totalWaterUsed: 0,
        waterSaved: 0,
        costSavings: 0,
        avgEfficiency: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const [waterRes, summaryRes] = await Promise.all([
                    fetch("/api/analytics/water-usage", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch("/api/analytics/summary", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                const waterData = await waterRes.json();
                const summaryData = await summaryRes.json();

                setWaterUsageData(waterData);

                const totalUsed = waterData.reduce((sum: number, d: any) => sum + d.usage, 0);
                const totalSaved = waterData.reduce((sum: number, d: any) => sum + d.saved, 0);

                setSummary({
                    totalWaterUsed: totalUsed,
                    waterSaved: totalSaved,
                    costSavings: Math.round(totalSaved * 0.5), // ₹0.5 per liter
                    avgEfficiency: summaryData.efficiency,
                });
            } catch (error) {
                console.error("Failed to fetch analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [token]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    const hasData = waterUsageData.length > 0;

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
                <p className="text-gray-500 mt-1">Track your farm performance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Water Used</CardTitle>
                        <Droplets className="w-4 h-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatNumber(summary.totalWaterUsed)} L</div>
                        {hasData ? (
                            <p className="text-xs text-gray-500 mt-1">Last 6 months</p>
                        ) : (
                            <p className="text-xs text-gray-500 mt-1">No data yet</p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Water Saved</CardTitle>
                        <TrendingUp className="w-4 h-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatNumber(summary.waterSaved)} L</div>
                        {hasData ? (
                            <p className="text-xs text-gray-500 mt-1">From smart irrigation</p>
                        ) : (
                            <p className="text-xs text-gray-500 mt-1">No data yet</p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Cost Savings</CardTitle>
                        <DollarSign className="w-4 h-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{formatNumber(summary.costSavings)}</div>
                        {hasData ? (
                            <p className="text-xs text-gray-500 mt-1">Estimated savings</p>
                        ) : (
                            <p className="text-xs text-gray-500 mt-1">No data yet</p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Avg Efficiency</CardTitle>
                        <Activity className="w-4 h-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summary.avgEfficiency}%</div>
                        {hasData ? (
                            <p className="text-xs text-gray-500 mt-1">Water efficiency</p>
                        ) : (
                            <p className="text-xs text-gray-500 mt-1">No data yet</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {hasData ? (
                <>
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Water Usage Trends</CardTitle>
                            <p className="text-sm text-gray-500">Monthly water consumption and savings</p>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={waterUsageData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="usage" stroke="#3b82f6" strokeWidth={2} name="Usage (L)" />
                                    <Line type="monotone" dataKey="saved" stroke="#10b981" strokeWidth={2} name="Saved (L)" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Key Insights</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {summary.waterSaved > 0 && (
                                    <div className="p-4 bg-green-50 rounded-lg">
                                        <p className="font-semibold text-green-900 mb-1">✓ Water Conservation Active</p>
                                        <p className="text-sm text-green-700">
                                            You've saved {formatNumber(summary.waterSaved)}L through smart irrigation
                                        </p>
                                    </div>
                                )}
                                {summary.avgEfficiency > 70 && (
                                    <div className="p-4 bg-blue-50 rounded-lg">
                                        <p className="font-semibold text-blue-900 mb-1">→ Good Efficiency</p>
                                        <p className="text-sm text-blue-700">
                                            Your irrigation efficiency is {summary.avgEfficiency}%
                                        </p>
                                    </div>
                                )}
                                {summary.avgEfficiency < 50 && summary.avgEfficiency > 0 && (
                                    <div className="p-4 bg-yellow-50 rounded-lg">
                                        <p className="font-semibold text-yellow-900 mb-1">⚠ Efficiency Can Improve</p>
                                        <p className="text-sm text-yellow-700">
                                            Consider following irrigation recommendations more closely
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </>
            ) : (
                <Card>
                    <CardContent className="p-12 text-center">
                        <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Analytics Data Yet</h3>
                        <p className="text-gray-500 mb-4">
                            Start using the irrigation system to generate analytics and insights
                        </p>
                        <p className="text-sm text-gray-400">
                            Data will appear here once you make irrigation decisions
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
