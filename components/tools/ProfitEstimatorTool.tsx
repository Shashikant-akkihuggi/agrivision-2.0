"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { estimateProfit, ProfitEstimate } from "@/lib/farmer-tools/profit-estimator";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { formatNumber, formatCurrency } from "@/lib/utils";

export default function ProfitEstimatorTool() {
    const [landSize, setLandSize] = useState<number>(2);
    const [crop, setCrop] = useState<string>("rice");
    const [estimate, setEstimate] = useState<ProfitEstimate | null>(null);

    const handleEstimate = () => {
        const result = estimateProfit(landSize, crop);
        setEstimate(result);
    };

    const crops = ["rice", "wheat", "tomato", "potato", "maize", "cotton"];

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="w-6 h-6 text-yellow-600" />
                        Profit Estimator
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Land Size (acres)
                            </label>
                            <input
                                type="number"
                                value={landSize}
                                onChange={(e) => setLandSize(Number(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                min="0.5"
                                step="0.5"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Crop
                            </label>
                            <select
                                value={crop}
                                onChange={(e) => setCrop(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            >
                                {crops.map(c => (
                                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={handleEstimate}
                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                        Calculate Profit
                    </button>
                </CardContent>
            </Card>

            {estimate && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="pt-6">
                            <p className="text-sm text-blue-700 mb-1">Expected Yield</p>
                            <p className="text-3xl font-bold text-blue-900">
                                {formatNumber(estimate.expectedYield)}
                            </p>
                            <p className="text-sm text-blue-600">{estimate.yieldUnit}</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-green-50 border-green-200">
                        <CardContent className="pt-6">
                            <p className="text-sm text-green-700 mb-1 flex items-center gap-1">
                                <TrendingUp className="w-4 h-4" />
                                Estimated Revenue
                            </p>
                            <p className="text-3xl font-bold text-green-900">
                                {formatCurrency(estimate.estimatedRevenue)}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-red-50 border-red-200">
                        <CardContent className="pt-6">
                            <p className="text-sm text-red-700 mb-1 flex items-center gap-1">
                                <TrendingDown className="w-4 h-4" />
                                Estimated Cost
                            </p>
                            <p className="text-3xl font-bold text-red-900">
                                {formatCurrency(estimate.estimatedCost)}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className={`${estimate.netProfit > 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <CardContent className="pt-6">
                            <p className={`text-sm mb-1 ${estimate.netProfit > 0 ? 'text-green-700' : 'text-red-700'}`}>
                                Net Profit
                            </p>
                            <p className={`text-3xl font-bold ${estimate.netProfit > 0 ? 'text-green-900' : 'text-red-900'}`}>
                                {formatCurrency(estimate.netProfit)}
                            </p>
                            <p className={`text-sm ${estimate.netProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(estimate.profitPerAcre)}/acre
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {estimate && (
                <Card>
                    <CardHeader>
                        <CardTitle>Cost Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Object.entries(estimate.breakdownCosts).map(([key, value]) => (
                                <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span className="text-sm text-gray-700 capitalize">{key}:</span>
                                    <span className="font-semibold">{formatCurrency(value)}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
