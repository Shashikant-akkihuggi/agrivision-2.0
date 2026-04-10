"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFarmingCalendar, getCurrentMonthTasks } from "@/lib/farmer-tools/farming-calendar";
import { Calendar, Sprout, Droplets, Scissors, Wrench } from "lucide-react";

export default function FarmingCalendarTool() {
    const [viewMode, setViewMode] = useState<'current' | 'full'>('current');
    const currentMonth = getCurrentMonthTasks();
    const fullCalendar = getFarmingCalendar();

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-orange-600" />
                        Farming Calendar
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setViewMode('current')}
                            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${viewMode === 'current'
                                    ? 'bg-orange-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            This Month
                        </button>
                        <button
                            onClick={() => setViewMode('full')}
                            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${viewMode === 'full'
                                    ? 'bg-orange-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Full Year
                        </button>
                    </div>
                </CardContent>
            </Card>

            {viewMode === 'current' && (
                <Card className="bg-orange-50 border-orange-200">
                    <CardHeader>
                        <CardTitle className="text-2xl">{currentMonth.month} Tasks</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="flex items-center gap-2 font-semibold text-green-700 mb-3">
                                <Sprout className="w-5 h-5" />
                                Sowing
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {currentMonth.tasks.sowing.map((crop, index) => (
                                    <span key={index} className="px-3 py-1 bg-green-100 border border-green-300 rounded-full text-sm text-green-800">
                                        {crop}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="flex items-center gap-2 font-semibold text-blue-700 mb-3">
                                <Droplets className="w-5 h-5" />
                                Maintenance
                            </h3>
                            <ul className="space-y-1">
                                {currentMonth.tasks.maintenance.map((task, index) => (
                                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                        <span className="text-blue-600">•</span>
                                        {task}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="flex items-center gap-2 font-semibold text-yellow-700 mb-3">
                                <Scissors className="w-5 h-5" />
                                Harvesting
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {currentMonth.tasks.harvesting.map((crop, index) => (
                                    <span key={index} className="px-3 py-1 bg-yellow-100 border border-yellow-300 rounded-full text-sm text-yellow-800">
                                        {crop}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="flex items-center gap-2 font-semibold text-gray-700 mb-3">
                                <Wrench className="w-5 h-5" />
                                Preparation
                            </h3>
                            <ul className="space-y-1">
                                {currentMonth.tasks.preparation.map((task, index) => (
                                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                        <span className="text-gray-600">•</span>
                                        {task}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            )}

            {viewMode === 'full' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {fullCalendar.map((monthData, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-lg">{monthData.month}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div>
                                    <p className="font-semibold text-green-700 mb-1">🌱 Sowing:</p>
                                    <p className="text-gray-600 text-xs">{monthData.tasks.sowing.slice(0, 3).join(", ")}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-yellow-700 mb-1">✂️ Harvesting:</p>
                                    <p className="text-gray-600 text-xs">{monthData.tasks.harvesting.slice(0, 3).join(", ")}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
