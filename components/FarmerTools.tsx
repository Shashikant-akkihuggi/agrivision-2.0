"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Sprout,
    Droplets,
    TestTube,
    Bug,
    Calendar,
    DollarSign,
    Package,
    Tractor,
    RefreshCw,
    Activity,
    AlertTriangle,
    Lightbulb
} from "lucide-react";

export default function FarmerTools() {
    const [activeTab, setActiveTab] = useState<string>("overview");

    const tools = [
        { id: "crop-rec", name: "Crop Recommendation", icon: Sprout, color: "green" },
        { id: "irrigation", name: "Irrigation Planner", icon: Droplets, color: "blue" },
        { id: "fertilizer", name: "Fertilizer Guide", icon: TestTube, color: "purple" },
        { id: "pest", name: "Pest Risk Checker", icon: Bug, color: "red" },
        { id: "calendar", name: "Farming Calendar", icon: Calendar, color: "orange" },
        { id: "profit", name: "Profit Estimator", icon: DollarSign, color: "yellow" },
        { id: "storage", name: "Storage Advisor", icon: Package, color: "indigo" },
        { id: "equipment", name: "Equipment Guide", icon: Tractor, color: "gray" },
        { id: "rotation", name: "Crop Rotation", icon: RefreshCw, color: "teal" },
        { id: "health", name: "Farm Health Score", icon: Activity, color: "pink" },
        { id: "risk", name: "Risk Indicator", icon: AlertTriangle, color: "amber" },
        { id: "tips", name: "Smart Tips", icon: Lightbulb, color: "cyan" }
    ];

    return (
        <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100/50 min-h-screen">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Farmer Tools</h1>
                <p className="text-gray-600 text-lg">
                    Practical tools to help you increase yield, reduce costs, and make better decisions
                </p>
            </div>

            {activeTab === "overview" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {tools.map((tool, index) => {
                        const Icon = tool.icon;
                        const colorClasses = {
                            green: "bg-green-50 hover:bg-green-100 border-green-200 text-green-700",
                            blue: "bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700",
                            purple: "bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700",
                            red: "bg-red-50 hover:bg-red-100 border-red-200 text-red-700",
                            orange: "bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-700",
                            yellow: "bg-yellow-50 hover:bg-yellow-100 border-yellow-200 text-yellow-700",
                            indigo: "bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700",
                            gray: "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700",
                            teal: "bg-teal-50 hover:bg-teal-100 border-teal-200 text-teal-700",
                            pink: "bg-pink-50 hover:bg-pink-100 border-pink-200 text-pink-700",
                            amber: "bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700",
                            cyan: "bg-cyan-50 hover:bg-cyan-100 border-cyan-200 text-cyan-700"
                        };

                        return (
                            <button
                                key={tool.id}
                                onClick={() => setActiveTab(tool.id)}
                                className={`${colorClasses[tool.color as keyof typeof colorClasses]} 
                                    border-2 rounded-xl p-6 transition-all duration-300 
                                    hover:shadow-lg hover:scale-105 text-left group`}
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-4 
                                        group-hover:scale-110 transition-transform">
                                        <Icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="font-semibold text-sm">{tool.name}</h3>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}

            {activeTab !== "overview" && (
                <div className="mb-6">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                    >
                        ← Back to Tools
                    </button>
                </div>
            )}

            {/* Tool Components will be rendered here */}
            {activeTab === "crop-rec" && <CropRecommendationTool />}
            {activeTab === "irrigation" && <IrrigationPlannerTool />}
            {activeTab === "fertilizer" && <FertilizerGuideTool />}
            {activeTab === "pest" && <PestRiskTool />}
            {activeTab === "calendar" && <FarmingCalendarTool />}
            {activeTab === "profit" && <ProfitEstimatorTool />}
            {activeTab === "storage" && <StorageAdvisorTool />}
            {activeTab === "equipment" && <EquipmentGuideTool />}
            {activeTab === "rotation" && <CropRotationTool />}
            {activeTab === "health" && <FarmHealthTool />}
            {activeTab === "risk" && <RiskIndicatorTool />}
            {activeTab === "tips" && <SmartTipsTool />}
        </div>
    );
}

// Individual tool components will be imported from separate files
import CropRecommendationTool from "./tools/CropRecommendationTool";
import IrrigationPlannerTool from "./tools/IrrigationPlannerTool";
import FertilizerGuideTool from "./tools/FertilizerGuideTool";
import PestRiskTool from "./tools/PestRiskTool";
import FarmingCalendarTool from "./tools/FarmingCalendarTool";
import ProfitEstimatorTool from "./tools/ProfitEstimatorTool";
import StorageAdvisorTool from "./tools/StorageAdvisorTool";
import EquipmentGuideTool from "./tools/EquipmentGuideTool";
import CropRotationTool from "./tools/CropRotationTool";
import FarmHealthTool from "./tools/FarmHealthTool";
import RiskIndicatorTool from "./tools/RiskIndicatorTool";
import SmartTipsTool from "./tools/SmartTipsTool";
