"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { recommendCrops, CropRecommendation } from "@/lib/farmer-tools/crop-recommendation";
import { Sprout, TrendingUp, Droplets, Clock } from "lucide-react";

export default function CropRecommendationTool() {
    const [landSize, setLandSize] = useState<number>(2);
    const [season, setSeason] = useState<'summer' | 'monsoon' | 'winter' | 'spring'>('monsoon');
    const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);

    const handleRecommend = () => {
        const results = recommendCrops(landSize, season);
        setRecommendations(results);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sprout className="w-6 h-6 text-green-600" />
                        Crop Recommendation Tool
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                min="0.5"
                                step="0.5"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Season
                            </label>
                            <select
                                value={season}
                                onChange={(e) => setSeason(e.target.value as any)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                                <option value="summer">Summer</option>
                                <option value="monsoon">Monsoon</option>
                                <option value="winter">Winter</option>
                                <option value="spring">Spring</option>
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={handleRecommend}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                        Get Recommendations
                    </button>
                </CardContent>
            </Card>

            {recommendations.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recommendations.map((rec, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-xl">{rec.name}</CardTitle>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <TrendingUp className="w-4 h-4" />
                                    <span>{rec.suitability}% Suitable</span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Expected Yield:</span>
                                    <span className="font-semibold">{rec.expectedYield}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 flex items-center gap-1">
                                        <Droplets className="w-4 h-4" />
                                        Water Need:
                                    </span>
                                    <span className={`font-semibold ${rec.waterRequirement === 'High' ? 'text-blue-600' :
                                            rec.waterRequirement === 'Medium' ? 'text-yellow-600' :
                                                'text-green-600'
                                        }`}>
                                        {rec.waterRequirement}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Profit Potential:</span>
                                    <span className={`font-semibold ${rec.profitPotential === 'High' ? 'text-green-600' :
                                            rec.profitPotential === 'Medium' ? 'text-yellow-600' :
                                                'text-gray-600'
                                        }`}>
                                        {rec.profitPotential}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        Duration:
                                    </span>
                                    <span className="font-semibold">{rec.growthDuration}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
