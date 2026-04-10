"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateDailyTips } from "@/lib/farmer-tools/smart-tips";
import { Lightbulb, RefreshCw } from "lucide-react";

export default function SmartTipsTool() {
    const [tips, setTips] = useState<any[]>([]);

    useEffect(() => {
        loadTips();
    }, []);

    const loadTips = () => {
        const newTips = generateDailyTips();
        setTips(newTips);
    };

    const categoryColors: Record<string, string> = {
        'Water Management': 'bg-blue-50 border-blue-200 text-blue-700',
        'Soil Health': 'bg-green-50 border-green-200 text-green-700',
        'Pest Control': 'bg-red-50 border-red-200 text-red-700',
        'Fertilizer': 'bg-purple-50 border-purple-200 text-purple-700',
        'Harvesting': 'bg-yellow-50 border-yellow-200 text-yellow-700',
        'General': 'bg-gray-50 border-gray-200 text-gray-700',
        'Cost Saving': 'bg-orange-50 border-orange-200 text-orange-700'
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Lightbulb className="w-6 h-6 text-cyan-600" />
                            Smart Tips for Today
                        </CardTitle>
                        <button
                            onClick={loadTips}
                            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                            New Tips
                        </button>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-600">
                        Get daily farming tips to improve your practices and increase productivity
                    </p>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tips.map((tip, index) => (
                    <Card
                        key={index}
                        className={`border-2 ${categoryColors[tip.category]} hover:shadow-lg transition-all duration-300 hover:scale-105`}
                    >
                        <CardContent className="pt-6">
                            <div className="text-center mb-4">
                                <span className="text-5xl">{tip.icon}</span>
                            </div>
                            <div className="space-y-3">
                                <div className="text-center">
                                    <span className="px-3 py-1 bg-white rounded-full text-xs font-semibold">
                                        {tip.category}
                                    </span>
                                </div>
                                <p className="text-center text-gray-800 font-medium">
                                    {tip.tip}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="bg-gradient-to-r from-cyan-50 to-blue-50">
                <CardHeader>
                    <CardTitle>💡 Why Follow These Tips?</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4">
                            <p className="text-3xl font-bold text-green-600 mb-2">↑ 30%</p>
                            <p className="text-sm text-gray-700">Increase in Yield</p>
                        </div>
                        <div className="text-center p-4">
                            <p className="text-3xl font-bold text-blue-600 mb-2">↓ 40%</p>
                            <p className="text-sm text-gray-700">Reduction in Costs</p>
                        </div>
                        <div className="text-center p-4">
                            <p className="text-3xl font-bold text-purple-600 mb-2">↑ 50%</p>
                            <p className="text-sm text-gray-700">Better Soil Health</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>📚 Tip Categories</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.keys(categoryColors).map((category) => (
                            <div
                                key={category}
                                className={`${categoryColors[category]} border-2 rounded-lg p-3 text-center text-sm font-medium`}
                            >
                                {category}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
