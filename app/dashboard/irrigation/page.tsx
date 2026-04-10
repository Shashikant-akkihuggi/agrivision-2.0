"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useFarmStore } from "@/store/useFarmStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, CloudRain, Droplets, Thermometer, TrendingDown } from "lucide-react";
import { formatDateTime, formatDecimal } from "@/lib/utils";

interface IrrigationRecommendation {
    decision: string;
    soilMoisture: number;
    confidence: number;
    reasons: string[];
    field: {
        id: string;
        name: string;
        soilType: string;
        cropType: string;
    };
    weather: {
        temperature: number;
        humidity: number;
        rainfall: number;
        rainProbability: number;
    };
    lastIrrigationAt: string | null;
    loggedAt: string;
}

interface FarmField {
    id: string;
    name: string;
    area: number;
    cropType: string | null;
    status: string;
}

export default function IrrigationPage() {
    const token = useAuthStore((state) => state.token);
    const selectedFarm = useFarmStore((state) => state.selectedFarm);
    const [recommendation, setRecommendation] = useState<IrrigationRecommendation | null>(null);
    const [loadingFieldId, setLoadingFieldId] = useState<string | null>(null);
    const [fields, setFields] = useState<FarmField[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

    useEffect(() => {
        if (selectedFarm) {
            setFields(selectedFarm.fields || []);
            return;
        }

        setFields([]);
    }, [selectedFarm]);

    const getRecommendation = async (fieldId: string) => {
        setLoadingFieldId(fieldId);
        setError(null);
        setSaveStatus("idle");
        try {
            const res = await fetch(`/api/irrigation/recommendation?fieldId=${fieldId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (!res.ok) {
                setRecommendation(null);
                setError(data.error || "Failed to fetch irrigation recommendation");
                return;
            }

            setRecommendation(data);
        } catch (error) {
            console.error("Failed to get irrigation recommendation:", error);
            setRecommendation(null);
            setError("Failed to fetch irrigation recommendation");
        } finally {
            setLoadingFieldId(null);
        }
    };

    const saveRecommendation = async () => {
        if (!recommendation) {
            return;
        }

        setSaveStatus("saving");
        setError(null);

        try {
            const res = await fetch("/api/irrigation/decision", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ fieldId: recommendation.field.id }),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Failed to save irrigation recommendation");
                setSaveStatus("idle");
                return;
            }

            setRecommendation(data);
            setSaveStatus("saved");
        } catch (error) {
            console.error("Failed to save irrigation recommendation:", error);
            setError("Failed to save irrigation recommendation");
            setSaveStatus("idle");
        }
    };

    const getDecisionColor = (dec: string) => {
        if (dec === "IRRIGATE") return "bg-green-50 border-green-200 text-green-900";
        if (dec === "DO NOT IRRIGATE") return "bg-red-50 border-red-200 text-red-900";
        return "bg-yellow-50 border-yellow-200 text-yellow-900";
    };

    const getDecisionIcon = (dec: string) => {
        if (dec === "IRRIGATE") return <CheckCircle className="w-6 h-6 text-green-600" />;
        if (dec === "DO NOT IRRIGATE") return <AlertCircle className="w-6 h-6 text-red-600" />;
        return <TrendingDown className="w-6 h-6 text-yellow-600" />;
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Smart Irrigation</h1>
                <p className="text-gray-500 mt-1">Deterministic recommendations from weather data and farm records</p>
            </div>

            {!selectedFarm && (
                <Card>
                    <CardContent className="p-8 text-center">
                        <p className="text-gray-500">Please select a farm to view irrigation recommendations</p>
                    </CardContent>
                </Card>
            )}

            {selectedFarm && fields.length === 0 && (
                <Card>
                    <CardContent className="p-8 text-center">
                        <p className="text-gray-500">No fields found. Add fields to your farm to get started.</p>
                    </CardContent>
                </Card>
            )}

            {selectedFarm && fields.length > 0 && (
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Select Field</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {fields.map((field) => (
                                    <button
                                        key={field.id}
                                        onClick={() => getRecommendation(field.id)}
                                        className={`p-4 border-2 rounded-lg transition-all text-left ${
                                            recommendation?.field.id === field.id
                                                ? "border-green-600 bg-green-50"
                                                : "border-gray-200 hover:border-green-600"
                                        }`}
                                    >
                                        <h3 className="font-semibold">{field.name}</h3>
                                        <p className="text-sm text-gray-500">{field.area} acres</p>
                                        <p className="text-sm text-gray-500">{field.cropType || "No crop"}</p>
                                        {loadingFieldId === field.id && (
                                            <p className="text-xs text-green-700 mt-2">Calculating recommendation...</p>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {error && (
                        <Card className="border-red-200 bg-red-50">
                            <CardContent className="p-4">
                                <p className="text-sm text-red-700">{error}</p>
                            </CardContent>
                        </Card>
                    )}

                    {recommendation && (
                        <>
                            <Card className={`border-2 ${getDecisionColor(recommendation.decision)}`}>
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        {getDecisionIcon(recommendation.decision)}
                                        <div className="flex-1">
                                            <h2 className="text-2xl font-bold mb-2">
                                                {recommendation.decision}
                                            </h2>
                                            <p className="text-lg mb-4">
                                                Estimated soil moisture is {formatDecimal(recommendation.soilMoisture, 1)}%.
                                            </p>
                                            <div className="flex flex-wrap items-center gap-6">
                                                <div>
                                                    <p className="text-sm font-medium">Confidence</p>
                                                    <p className="text-2xl font-bold">{formatDecimal(recommendation.confidence, 0)}%</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">Crop</p>
                                                    <p className="text-xl font-bold">{recommendation.field.cropType}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">Soil Type</p>
                                                    <p className="text-xl font-bold capitalize">{recommendation.field.soilType}</p>
                                                </div>
                                            </div>
                                            <div className="mt-6 flex flex-wrap items-center gap-3">
                                                <Button onClick={saveRecommendation} disabled={saveStatus === "saving"}>
                                                    {saveStatus === "saving" ? "Saving..." : "Save Decision"}
                                                </Button>
                                                {saveStatus === "saved" && (
                                                    <span className="text-sm text-green-700">Recommendation saved to history.</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Explanation</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        {recommendation.reasons.map((reason, index) => (
                                            <li key={`${reason}-${index}`} className="p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
                                                {reason}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Weather Inputs</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Thermometer className="w-4 h-4 text-red-500" />
                                                <span className="text-sm text-gray-600">Temperature</span>
                                            </div>
                                            <span className="font-semibold">{formatDecimal(recommendation.weather.temperature, 1)}°C</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Droplets className="w-4 h-4 text-blue-500" />
                                                <span className="text-sm text-gray-600">Humidity</span>
                                            </div>
                                            <span className="font-semibold">{formatDecimal(recommendation.weather.humidity, 0)}%</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <CloudRain className="w-4 h-4 text-cyan-600" />
                                                <span className="text-sm text-gray-600">Recent Rainfall</span>
                                            </div>
                                            <span className="font-semibold">{formatDecimal(recommendation.weather.rainfall, 1)} mm</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <CloudRain className="w-4 h-4 text-indigo-600" />
                                                <span className="text-sm text-gray-600">Rain Probability</span>
                                            </div>
                                            <span className="font-semibold">{formatDecimal(recommendation.weather.rainProbability, 0)}%</span>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Farm Inputs</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Field</span>
                                            <span className="font-semibold">{recommendation.field.name}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Crop Type</span>
                                            <span className="font-semibold">{recommendation.field.cropType}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Soil Type</span>
                                            <span className="font-semibold capitalize">{recommendation.field.soilType}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Last Irrigation</span>
                                            <span className="font-semibold text-right">
                                                {recommendation.lastIrrigationAt
                                                    ? formatDateTime(recommendation.lastIrrigationAt)
                                                    : "No record available"}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Recommendation Logged</span>
                                            <span className="font-semibold text-right">{formatDateTime(recommendation.loggedAt)}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
