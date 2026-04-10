"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFertilizerGuide } from "@/lib/farmer-tools/fertilizer-guide";
import { TestTube, Leaf, Sparkles } from "lucide-react";

export default function FertilizerGuideTool() {
    const [crop, setCrop] = useState<string>("rice");
    const [guide, setGuide] = useState<any>(null);

    const crops = ["rice", "wheat", "tomato", "potato", "maize", "cotton"];

    const handleGetGuide = () => {
        const result = getFertilizerGuide(crop);
        setGuide(result);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TestTube className="w-6 h-6 text-purple-600" />
                        Fertilizer Guide
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Crop
                        </label>
                        <select
                            value={crop}
                            onChange={(e) => setCrop(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            {crops.map(c => (
                                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={handleGetGuide}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                        Get Fertilizer Guide
                    </button>
                </CardContent>
            </Card>

            {guide && (
                <>
                    <Card className="bg-purple-50 border-purple-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TestTube className="w-5 h-5 text-purple-600" />
                                Basal Dose (At Planting)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg font-semibold text-purple-900">{guide.basalDose}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Top Dressing Schedule</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {guide.topDressing.map((dose: string, index: number) => (
                                    <div key={index} className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                                        <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                            {index + 1}
                                        </div>
                                        <p className="text-gray-700 pt-1">{dose}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Leaf className="w-5 h-5 text-green-600" />
                                Organic Options
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {guide.organicOptions.map((option: string, index: number) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                                        <span className="text-green-600 font-bold">🌿</span>
                                        {option}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-yellow-600" />
                                Micronutrients
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {guide.micronutrients.map((nutrient: string, index: number) => (
                                    <span key={index} className="px-3 py-1 bg-yellow-50 border border-yellow-200 rounded-full text-sm text-yellow-800">
                                        {nutrient}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>💡 Application Tips</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {guide.applicationTips.map((tip: string, index: number) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                                        <span className="text-purple-600 font-bold">•</span>
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
