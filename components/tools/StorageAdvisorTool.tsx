"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStorageAdvice } from "@/lib/farmer-tools/storage-advisor";
import { Package, Thermometer, Droplets, Clock, AlertCircle } from "lucide-react";

export default function StorageAdvisorTool() {
    const [crop, setCrop] = useState<string>("rice");
    const [advice, setAdvice] = useState<any>(null);

    const crops = ["rice", "wheat", "tomato", "potato", "maize", "cotton"];

    const handleGetAdvice = () => {
        const result = getStorageAdvice(crop);
        setAdvice(result);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="w-6 h-6 text-indigo-600" />
                        Storage Advisor
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            {crops.map(c => (
                                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={handleGetAdvice}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                        Get Storage Advice
                    </button>
                </CardContent>
            </Card>

            {advice && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="bg-indigo-50 border-indigo-200">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <Package className="w-5 h-5 text-indigo-600" />
                                    <h3 className="font-semibold text-indigo-900">Method</h3>
                                </div>
                                <p className="text-sm text-gray-700">{advice.method}</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-green-50 border-green-200">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock className="w-5 h-5 text-green-600" />
                                    <h3 className="font-semibold text-green-900">Shelf Life</h3>
                                </div>
                                <p className="text-sm text-gray-700">{advice.shelfLife}</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-red-50 border-red-200">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <Thermometer className="w-5 h-5 text-red-600" />
                                    <h3 className="font-semibold text-red-900">Temperature</h3>
                                </div>
                                <p className="text-sm text-gray-700">{advice.temperature}</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-blue-50 border-blue-200">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <Droplets className="w-5 h-5 text-blue-600" />
                                    <h3 className="font-semibold text-blue-900">Humidity</h3>
                                </div>
                                <p className="text-sm text-gray-700">{advice.humidity}</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>💡 Storage Tips</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {advice.tips.map((tip: string, index: number) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                                        <span className="text-indigo-600 font-bold">•</span>
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-red-600" />
                                Common Storage Issues
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {advice.commonIssues.map((issue: string, index: number) => (
                                    <span key={index} className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                                        {issue}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
