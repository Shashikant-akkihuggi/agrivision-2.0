"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateFarmHealth } from "@/lib/farmer-tools/farm-health-score";
import { Activity, Droplets, Sprout, Leaf, Bug } from "lucide-react";

export default function FarmHealthTool() {
    const [irrigation, setIrrigation] = useState<'regular' | 'irregular' | 'none'>('regular');
    const [cropSuitability, setCropSuitability] = useState<'high' | 'medium' | 'low'>('high');
    const [organicMatter, setOrganicMatter] = useState<'yes' | 'no'>('yes');
    const [pestControl, setPestControl] = useState<'integrated' | 'chemical' | 'none'>('integrated');
    const [health, setHealth] = useState<any>(null);

    const handleCalculate = () => {
        const result = calculateFarmHealth(irrigation, cropSuitability, organicMatter, pestControl);
        setHealth(result);
    };

    const getRatingColor = (rating: string) => {
        if (rating === 'Excellent') return 'text-green-600';
        if (rating === 'Good') return 'text-blue-600';
        if (rating === 'Fair') return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="w-6 h-6 text-pink-600" />
                        Farm Health Score Calculator
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Irrigation Frequency
                        </label>
                        <select
                            value={irrigation}
                            onChange={(e) => setIrrigation(e.target.value as any)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        >
                            <option value="regular">Regular & Scheduled</option>
                            <option value="irregular">Irregular</option>
                            <option value="none">No Irrigation System</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Crop Suitability for Your Region
                        </label>
                        <select
                            value={cropSuitability}
                            onChange={(e) => setCropSuitability(e.target.value as any)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        >
                            <option value="high">Highly Suitable</option>
                            <option value="medium">Moderately Suitable</option>
                            <option value="low">Not Suitable</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Use of Organic Matter
                        </label>
                        <select
                            value={organicMatter}
                            onChange={(e) => setOrganicMatter(e.target.value as any)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        >
                            <option value="yes">Yes, Regularly</option>
                            <option value="no">No</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pest Control Method
                        </label>
                        <select
                            value={pestControl}
                            onChange={(e) => setPestControl(e.target.value as any)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        >
                            <option value="integrated">Integrated Pest Management (IPM)</option>
                            <option value="chemical">Chemical Only</option>
                            <option value="none">No Pest Control</option>
                        </select>
                    </div>

                    <button
                        onClick={handleCalculate}
                        className="w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                        Calculate Farm Health
                    </button>
                </CardContent>
            </Card>

            {health && (
                <>
                    <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-300">
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <p className="text-sm text-gray-600 mb-2">Overall Farm Health Score</p>
                                <p className="text-6xl font-bold text-pink-600 mb-2">{health.totalScore}</p>
                                <p className={`text-2xl font-semibold ${getRatingColor(health.rating)}`}>
                                    {health.rating}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Droplets className="w-5 h-5 text-blue-600" />
                                    Irrigation ({health.breakdown.irrigation.score}/25)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-700">{health.breakdown.irrigation.feedback}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Sprout className="w-5 h-5 text-green-600" />
                                    Crop Choice ({health.breakdown.cropChoice.score}/25)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-700">{health.breakdown.cropChoice.feedback}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Leaf className="w-5 h-5 text-teal-600" />
                                    Soil Health ({health.breakdown.soilHealth.score}/25)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-700">{health.breakdown.soilHealth.feedback}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Bug className="w-5 h-5 text-red-600" />
                                    Pest Management ({health.breakdown.pestManagement.score}/25)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-700">{health.breakdown.pestManagement.feedback}</p>
                            </CardContent>
                        </Card>
                    </div>

                    {health.recommendations.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>📋 Recommendations for Improvement</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {health.recommendations.map((rec: string, index: number) => (
                                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700 p-3 bg-yellow-50 rounded-lg">
                                            <span className="text-yellow-600 font-bold">⚠️</span>
                                            {rec}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}
                </>
            )}
        </div>
    );
}
