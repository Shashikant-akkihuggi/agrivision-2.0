"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { assessRisk } from "@/lib/farmer-tools/risk-indicator";
import { AlertTriangle, Cloud, Bug, TrendingUp, Shield } from "lucide-react";

export default function RiskIndicatorTool() {
    const [crop, setCrop] = useState<string>("rice");
    const [season, setSeason] = useState<'summer' | 'monsoon' | 'winter' | 'spring'>('monsoon');
    const [assessment, setAssessment] = useState<any>(null);

    const crops = ["rice", "wheat", "tomato", "potato", "maize", "cotton"];

    const handleAssess = () => {
        const result = assessRisk(crop, season);
        setAssessment(result);
    };

    const getRiskColor = (level: string) => {
        if (level === 'High') return { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700' };
        if (level === 'Medium') return { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-700' };
        return { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-700' };
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-6 h-6 text-amber-600" />
                        Risk Indicator
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            >
                                <option value="summer">Summer</option>
                                <option value="monsoon">Monsoon</option>
                                <option value="winter">Winter</option>
                                <option value="spring">Spring</option>
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={handleAssess}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                        Assess Risk
                    </button>
                </CardContent>
            </Card>

            {assessment && (
                <>
                    <Card className={`border-2 ${getRiskColor(assessment.overallRisk).bg} ${getRiskColor(assessment.overallRisk).border}`}>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <p className="text-sm text-gray-600 mb-2">Overall Risk Level</p>
                                <div className="flex items-center justify-center gap-3">
                                    <AlertTriangle className={`w-12 h-12 ${getRiskColor(assessment.overallRisk).text}`} />
                                    <p className={`text-5xl font-bold ${getRiskColor(assessment.overallRisk).text}`}>
                                        {assessment.overallRisk}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className={`${getRiskColor(assessment.factors.weather.risk).bg} border-2 ${getRiskColor(assessment.factors.weather.risk).border}`}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Cloud className="w-5 h-5" />
                                    Weather Risk
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className={`text-2xl font-bold mb-2 ${getRiskColor(assessment.factors.weather.risk).text}`}>
                                    {assessment.factors.weather.risk}
                                </p>
                                <p className="text-sm text-gray-700">{assessment.factors.weather.reason}</p>
                            </CardContent>
                        </Card>

                        <Card className={`${getRiskColor(assessment.factors.pest.risk).bg} border-2 ${getRiskColor(assessment.factors.pest.risk).border}`}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Bug className="w-5 h-5" />
                                    Pest Risk
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className={`text-2xl font-bold mb-2 ${getRiskColor(assessment.factors.pest.risk).text}`}>
                                    {assessment.factors.pest.risk}
                                </p>
                                <p className="text-sm text-gray-700">{assessment.factors.pest.reason}</p>
                            </CardContent>
                        </Card>

                        <Card className={`${getRiskColor(assessment.factors.market.risk).bg} border-2 ${getRiskColor(assessment.factors.market.risk).border}`}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <TrendingUp className="w-5 h-5" />
                                    Market Risk
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className={`text-2xl font-bold mb-2 ${getRiskColor(assessment.factors.market.risk).text}`}>
                                    {assessment.factors.market.risk}
                                </p>
                                <p className="text-sm text-gray-700">{assessment.factors.market.reason}</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-blue-600" />
                                Risk Mitigation Strategies
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {assessment.mitigation.map((strategy: string, index: number) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700 p-3 bg-blue-50 rounded-lg">
                                        <span className="text-blue-600 font-bold">✓</span>
                                        {strategy}
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
