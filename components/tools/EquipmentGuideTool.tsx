"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { suggestEquipment } from "@/lib/farmer-tools/equipment-suggestion";
import { Tractor, CheckCircle, Star, Info } from "lucide-react";

export default function EquipmentGuideTool() {
    const [landSize, setLandSize] = useState<number>(2);
    const [suggestion, setSuggestion] = useState<any>(null);

    const handleGetSuggestion = () => {
        const result = suggestEquipment(landSize);
        setSuggestion(result);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Tractor className="w-6 h-6 text-gray-700" />
                        Equipment Suggestion Tool
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Land Size (acres)
                        </label>
                        <input
                            type="number"
                            value={landSize}
                            onChange={(e) => setLandSize(Number(e.target.value))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                            min="0.5"
                            step="0.5"
                        />
                    </div>
                    <button
                        onClick={handleGetSuggestion}
                        className="w-full bg-gray-700 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                        Get Equipment Suggestions
                    </button>
                </CardContent>
            </Card>

            {suggestion && (
                <>
                    <Card className="bg-gray-50 border-gray-300">
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <p className="text-sm text-gray-600 mb-1">Recommended Category</p>
                                <p className="text-3xl font-bold text-gray-900">{suggestion.category}</p>
                                <p className="text-lg text-gray-700 mt-2">Est. Cost: {suggestion.estimatedCost}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-red-600" />
                                Essential Equipment
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {suggestion.essential.map((item: string, index: number) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700 p-2 bg-red-50 rounded-lg">
                                        <CheckCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Star className="w-5 h-5 text-yellow-600" />
                                Recommended Equipment
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {suggestion.recommended.map((item: string, index: number) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                                        <span className="text-yellow-600 font-bold">•</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Info className="w-5 h-5 text-blue-600" />
                                Optional Equipment
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {suggestion.optional.map((item: string, index: number) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                                        <span className="text-blue-600 font-bold">•</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>💡 Tips</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {suggestion.tips.map((tip: string, index: number) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                                        <span className="text-gray-600 font-bold">•</span>
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
