"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { checkPestRisk } from "@/lib/farmer-tools/pest-risk";
import { Bug, AlertTriangle, Shield, Leaf } from "lucide-react";

export default function PestRiskTool() {
    const [crop, setCrop] = useState<string>("rice");
    const [season, setSeason] = useState<'summer' | 'monsoon' | 'winter' | 'spring'>('monsoon');
    const [risk, setRisk] = useState<any>(null);

    const crops = ["rice", "wheat", "tomato", "potato", "maize", "cotton"];

    const handleCheckRisk = () => {
        const result = checkPestRisk(crop, season);
        setRisk(result);
    };

    const getRiskColor = (level: string) => {
        if (level === 'High') return 'bg-red-50 border-red-300 text-red-700';
        if (level === 'Medium') return 'bg-yellow-50 border-yellow-300 text-yellow-700';
        return 'bg-green-50 border-green-300 text-green-700';
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bug className="w-6 h-6 text-red-600" />
                        Pest Risk Checker
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Crop
                            </label>
                            <select
                                value={crop}
                                onChange={(e) => setCrop(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                                {crops.map(c => (
                                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Season
                            </label>
                            <select
                                value={season}
                                onChange={(e) => setSeason(e.target.value as any)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                                <option value="summer">Summer</option>
                                <option value="monsoon">Monsoon</option>
                                <option value="winter">Winter</option>
                                <option value="spring">Spring</option>
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={handleCheckRisk}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                        Check Pest Risk
                    </button>
                </CardContent>
            </Card>

            {risk && (
                <>
                    <Card className={`border-2 ${getRiskColor(risk.riskLevel)}`}>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3 mb-2">
                                <AlertTriangle className="w-8 h-8" />
                                <div>
                                    <p className="text-sm font-medium">Overall Risk Level</p>
                                    <p className="text-3xl font-bold">{risk.riskLevel}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bug className="w-5 h-5 text-red-600" />
                                Common Pests
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {risk.commonPests.map((pest: string, index: number) => (
                                    <span key={index} className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800 font-medium">
                                        {pest}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>⚠️ Symptoms to Watch For</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {risk.symptoms.map((symptom: string, index: number) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                                        <span className="text-red-600 font-bold">•</span>
                                        {symptom}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-blue-600" />
                                Prevention Methods
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {risk.preventionMethods.map((method: string, index: number) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                                        <span className="text-blue-600 font-bold">✓</span>
                                        {method}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Leaf className="w-5 h-5 text-green-600" />
                                Organic Control Methods
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {risk.organicControl.map((control: string, index: number) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                                        <span className="text-green-600 font-bold">🌿</span>
                                        {control}
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
