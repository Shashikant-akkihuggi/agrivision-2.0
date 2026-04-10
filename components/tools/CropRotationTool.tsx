"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { suggestNextCrop } from "@/lib/farmer-tools/crop-rotation";
import { RefreshCw, TrendingUp, Calendar, Wrench } from "lucide-react";

export default function CropRotationTool() {
    const [currentCrop, setCurrentCrop] = useState<string>("rice");
    const [suggestions, setSuggestions] = useState<any[]>([]);

    const crops = ["rice", "wheat", "tomato", "potato", "maize", "cotton"];

    const handleGetSuggestions = () => {
        const result = suggestNextCrop(currentCrop);
        setSuggestions(result);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <RefreshCw className="w-6 h-6 text-teal-600" />
                        Crop Rotation Planner
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Crop
                        </label>
                        <select
                            value={currentCrop}
                            onChange={(e) => setCurrentCrop(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                            {crops.map(c => (
                                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={handleGetSuggestions}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                        Get Rotation Suggestions
                    </button>
                </CardContent>
            </Card>

            {suggestions.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {suggestions.map((suggestion, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow border-2 border-teal-200">
                            <CardHeader className="bg-teal-50">
                                <CardTitle className="text-xl text-teal-900">{suggestion.nextCrop}</CardTitle>
                                <p className="text-sm text-teal-700">{suggestion.reason}</p>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                <div>
                                    <h4 className="flex items-center gap-2 font-semibold text-green-700 mb-2">
                                        <TrendingUp className="w-4 h-4" />
                                        Benefits
                                    </h4>
                                    <ul className="space-y-1">
                                        {suggestion.benefits.map((benefit: string, idx: number) => (
                                            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                                <span className="text-green-600">✓</span>
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="flex items-center gap-2 font-semibold text-orange-700 mb-2">
                                        <Calendar className="w-4 h-4" />
                                        Timing
                                    </h4>
                                    <p className="text-sm text-gray-700">{suggestion.timing}</p>
                                </div>

                                <div>
                                    <h4 className="flex items-center gap-2 font-semibold text-blue-700 mb-2">
                                        <Wrench className="w-4 h-4" />
                                        Preparation
                                    </h4>
                                    <ul className="space-y-1">
                                        {suggestion.preparation.map((prep: string, idx: number) => (
                                            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                                <span className="text-blue-600">•</span>
                                                {prep}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
