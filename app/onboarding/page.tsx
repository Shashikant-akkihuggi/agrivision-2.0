"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Sprout, Mountain } from "lucide-react";

export default function OnboardingPage() {
    const router = useRouter();
    const token = useAuthStore((state) => state.token);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [farmData, setFarmData] = useState({
        name: "",
        location: "",
        latitude: 0,
        longitude: 0,
        totalArea: 0,
        soilType: "",
    });

    const soilTypes = ["clay", "loam", "sandy", "sandy-loam", "clay-loam"];

    const handleLocationDetect = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFarmData({
                        ...farmData,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Location error:", error);
                }
            );
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/farms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(farmData),
            });

            if (!res.ok) throw new Error("Failed to create farm");

            router.push("/dashboard");
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl">Setup Your Farm</CardTitle>
                    <p className="text-sm text-gray-500">Step {step} of 3</p>
                </CardHeader>
                <CardContent>
                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-6">
                                <MapPin className="w-6 h-6 text-green-600" />
                                <h3 className="text-lg font-semibold">Farm Location</h3>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Farm Name</label>
                                <Input
                                    placeholder="e.g., Green Valley Farm"
                                    value={farmData.name}
                                    onChange={(e) => setFarmData({ ...farmData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Location</label>
                                <Input
                                    placeholder="e.g., Village, District, State"
                                    value={farmData.location}
                                    onChange={(e) => setFarmData({ ...farmData, location: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium">Latitude</label>
                                    <Input
                                        type="number"
                                        step="any"
                                        value={farmData.latitude}
                                        onChange={(e) => setFarmData({ ...farmData, latitude: parseFloat(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Longitude</label>
                                    <Input
                                        type="number"
                                        step="any"
                                        value={farmData.longitude}
                                        onChange={(e) => setFarmData({ ...farmData, longitude: parseFloat(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <Button variant="outline" onClick={handleLocationDetect} className="w-full">
                                <MapPin className="w-4 h-4 mr-2" />
                                Detect My Location
                            </Button>
                            <Button onClick={() => setStep(2)} className="w-full">
                                Next
                            </Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-6">
                                <Mountain className="w-6 h-6 text-green-600" />
                                <h3 className="text-lg font-semibold">Soil Type</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {soilTypes.map((soil) => (
                                    <button
                                        key={soil}
                                        onClick={() => setFarmData({ ...farmData, soilType: soil })}
                                        className={`p-4 rounded-lg border-2 transition-all ${farmData.soilType === soil
                                                ? "border-green-600 bg-green-50"
                                                : "border-gray-200 hover:border-green-300"
                                            }`}
                                    >
                                        <div className="font-medium capitalize">{soil}</div>
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                                    Back
                                </Button>
                                <Button onClick={() => setStep(3)} className="flex-1" disabled={!farmData.soilType}>
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-6">
                                <Sprout className="w-6 h-6 text-green-600" />
                                <h3 className="text-lg font-semibold">Land Size</h3>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Total Area (acres)</label>
                                <Input
                                    type="number"
                                    step="0.1"
                                    placeholder="Enter total area"
                                    value={farmData.totalArea || ""}
                                    onChange={(e) => setFarmData({ ...farmData, totalArea: parseFloat(e.target.value) })}
                                />
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-sm text-blue-900">
                                    Your farm area determines loan eligibility and irrigation recommendations.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                                    Back
                                </Button>
                                <Button onClick={handleSubmit} className="flex-1" disabled={loading || !farmData.totalArea}>
                                    {loading ? "Creating..." : "Complete Setup"}
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
