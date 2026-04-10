"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useFarmStore } from "@/store/useFarmStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Map, Sprout, Activity } from "lucide-react";
import { formatDecimal } from "@/lib/utils";

export default function FarmPage() {
    const token = useAuthStore((state) => state.token);
    const { selectedFarm } = useFarmStore();
    const [fields, setFields] = useState<any[]>([]);
    const [soilData, setSoilData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (selectedFarm) {
            setFields((selectedFarm as any).fields || []);

            // Fetch soil data for first field if available
            const fetchSoilData = async () => {
                const fieldIds = (selectedFarm as any).fields?.map((f: any) => f.id) || [];
                if (fieldIds.length > 0) {
                    try {
                        const res = await fetch(`/api/fields/${fieldIds[0]}/soil-data`, {
                            headers: { Authorization: `Bearer ${token}` },
                        });
                        const data = await res.json();
                        setSoilData(data);
                    } catch (error) {
                        console.error("Failed to fetch soil data:", error);
                    }
                }
                setLoading(false);
            };

            fetchSoilData();
        } else {
            setLoading(false);
        }
    }, [selectedFarm, token]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (!selectedFarm) {
        return (
            <div className="p-8">
                <Card>
                    <CardContent className="p-8 text-center">
                        <p className="text-gray-500">Please select a farm to view details</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Farm Management</h1>
                <p className="text-gray-500 mt-1">{selectedFarm.name}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Area</CardTitle>
                        <Map className="w-4 h-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{selectedFarm.totalArea} acres</div>
                        <p className="text-xs text-gray-500 mt-1">{fields.length} fields</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Soil Type</CardTitle>
                        <Activity className="w-4 h-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold capitalize">{selectedFarm.soilType}</div>
                        <p className="text-xs text-gray-500 mt-1">Primary soil composition</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Active Crops</CardTitle>
                        <Sprout className="w-4 h-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {fields.filter((f) => f.cropType).length}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Currently growing</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Farm Location</CardTitle>
                        <Button variant="outline" size="sm">
                            <Map className="w-4 h-4 mr-2" />
                            View on Map
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="bg-gray-100 rounded-lg p-8 text-center">
                        <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">{selectedFarm.location}</p>
                        <p className="text-sm text-gray-500">
                            Coordinates: {formatDecimal(selectedFarm.latitude, 4)}, {formatDecimal(selectedFarm.longitude, 4)}
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card className="mb-6">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Fields Overview</CardTitle>
                        <Button size="sm">Add Field</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {fields.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No fields added yet</p>
                            <Button className="mt-4">Add Your First Field</Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {fields.map((field) => (
                                <div key={field.id} className="p-4 border border-gray-200 rounded-lg hover:border-green-600 transition-all">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-semibold text-lg">{field.name}</h3>
                                            <p className="text-sm text-gray-500">{field.area} acres</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${field.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                            }`}>
                                            {field.status}
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">Crop:</span>
                                            <span className="font-medium">{field.cropType || "Not planted"}</span>
                                        </div>
                                        {field.plantingDate && (
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">Planted:</span>
                                                <span className="font-medium">
                                                    {new Date(field.plantingDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Soil Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {soilData ? (
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-medium">Moisture Level</span>
                                        <span className="text-sm font-semibold">{formatDecimal(soilData.moisture, 1)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min(soilData.moisture || 0, 100)}%` }}></div>
                                    </div>
                                </div>
                                {soilData.ph && (
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-sm font-medium">pH Level</span>
                                            <span className="text-sm font-semibold">{formatDecimal(soilData.ph, 1)}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-green-600 h-2 rounded-full" style={{ width: `${((soilData.ph || 0) / 14) * 100}%` }}></div>
                                        </div>
                                    </div>
                                )}
                                {soilData.nitrogen && (
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-sm font-medium">Nitrogen</span>
                                            <span className="text-sm font-semibold">{formatDecimal(soilData.nitrogen, 1)}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-green-600 h-2 rounded-full" style={{ width: `${Math.min(soilData.nitrogen || 0, 100)}%` }}></div>
                                        </div>
                                    </div>
                                )}
                                {soilData.phosphorus && (
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-sm font-medium">Phosphorus</span>
                                            <span className="text-sm font-semibold">{formatDecimal(soilData.phosphorus, 1)}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-yellow-600 h-2 rounded-full" style={{ width: `${Math.min(soilData.phosphorus || 0, 100)}%` }}></div>
                                        </div>
                                    </div>
                                )}
                                <p className="text-xs text-gray-500 mt-4">
                                    Last updated: {new Date(soilData.timestamp).toLocaleString()}
                                </p>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No soil data available</p>
                                <p className="text-xs text-gray-400 mt-1">Add soil sensors to track health metrics</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Crop Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {fields.length > 0 && fields.some(f => f.cropType) ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-green-50 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold">Overall Health</span>
                                        <span className="text-2xl font-bold text-green-600">Monitoring</span>
                                    </div>
                                    <p className="text-sm text-gray-600">Based on available data</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                        <span className="text-sm">Active Fields</span>
                                        <span className="text-sm font-semibold">{fields.filter(f => f.status === 'active').length}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                        <span className="text-sm">Crops Growing</span>
                                        <span className="text-sm font-semibold">{fields.filter(f => f.cropType).length}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No crops planted yet</p>
                                <p className="text-xs text-gray-400 mt-1">Plant crops to monitor health</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}