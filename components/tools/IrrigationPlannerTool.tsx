"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getIrrigationSchedule } from "@/lib/farmer-tools/irrigation-planner";
import { Droplets, Clock, Thermometer, AlertCircle } from "lucide-react";

export default function IrrigationPlannerTool() {
    const [crop, setCrop] = useState<string>("rice");
    const [schedule, setSchedule] = useState<any>(null);

    const crops = ["rice", "wheat", "tomato", "potato", "maize", "cotton"];

    const handleGetSchedule = () => {
        const result = getIrrigationSchedule(crop);
        setSchedule(result);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Droplets className="w-6 h-6 text-blue-600" />
                        Irrigation Planner
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {crops.map(c => (
                                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={handleGetSchedule}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                        Get Irrigation Schedule
                    </button>
                </CardContent>
            </Card>

            {schedule && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-blue-50 border-blue-200">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock className="w-5 h-5 text-blue-600" />
                                    <h3 className="font-semibold text-blue-900">Frequency</h3>
                                </div>
                                <p className="text-gray-700">{schedule.frequency}</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-blue-50 border-blue-200">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <Droplets className="w-5 h-5 text-blue-600" />
                                    <h3 className="font-semibold text-blue-900">Amount</h3>
                                </div>
                                <p className="text-gray-700">{schedule.amount}</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-blue-50 border-blue-200">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <Thermometer className="w-5 h-5 text-blue-600" />
                                    <h3 className="font-semibold text-blue-900">Best Timing</h3>
                                </div>
                                <p className="text-gray-700">{schedule.timing}</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-blue-50 border-blue-200">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertCircle className="w-5 h-5 text-blue-600" />
                                    <h3 className="font-semibold text-blue-900">Method</h3>
                                </div>
                                <p className="text-gray-700">{schedule.method}</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Critical Irrigation Stages</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {schedule.criticalStages.map((stage: string, index: number) => (
                                    <div key={index} className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                                        <span className="text-sm text-gray-700">{stage}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>💡 Pro Tips</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {schedule.tips.map((tip: string, index: number) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                                        <span className="text-green-600 font-bold">•</span>
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
