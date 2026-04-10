"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Droplets, Cloud, Bug, CheckCircle } from "lucide-react";

export default function AlertsPage() {
    const token = useAuthStore((state) => state.token);
    const [alerts, setAlerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const res = await fetch("/api/alerts", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setAlerts(data);
            } catch (error) {
                console.error("Failed to fetch alerts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAlerts();
    }, [token]);

    const handleMarkAsRead = async (alertId: string) => {
        try {
            await fetch("/api/alerts", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ alertId, isRead: true }),
            });
            setAlerts(alerts.map(a => a.id === alertId ? { ...a, isRead: true } : a));
        } catch (error) {
            console.error("Failed to update alert:", error);
        }
    };

    const getAlertIcon = (type: string) => {
        switch (type) {
            case "water":
            case "irrigation":
                return <Droplets className="w-5 h-5" />;
            case "weather":
                return <Cloud className="w-5 h-5" />;
            case "pest":
                return <Bug className="w-5 h-5" />;
            default:
                return <CheckCircle className="w-5 h-5" />;
        }
    };

    const getAlertColor = (severity: string) => {
        switch (severity) {
            case "high":
                return "bg-red-50 border-red-200 text-red-900";
            case "medium":
                return "bg-yellow-50 border-yellow-200 text-yellow-900";
            default:
                return "bg-blue-50 border-blue-200 text-blue-900";
        }
    };

    const getSeverityBadge = (severity: string) => {
        switch (severity) {
            case "high":
                return "bg-red-100 text-red-800";
            case "medium":
                return "bg-yellow-100 text-yellow-800";
            default:
                return "bg-blue-100 text-blue-800";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    const unreadCount = alerts.filter((a) => !a.isRead).length;

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Alerts & Notifications</h1>
                <p className="text-gray-500 mt-1">
                    {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount !== 1 ? "s" : ""}` : "All caught up!"}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Alerts</CardTitle>
                        <AlertTriangle className="w-4 h-4 text-gray-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{alerts.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Unread</CardTitle>
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{unreadCount}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">High Priority</CardTitle>
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {alerts.filter((a) => a.severity === "high").length}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">This Week</CardTitle>
                        <AlertTriangle className="w-4 h-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{alerts.length}</div>
                    </CardContent>
                </Card>
            </div>

            {alerts.length > 0 ? (
                <div className="space-y-4">
                    {alerts.map((alert) => (
                        <Card
                            key={alert.id}
                            className={`${getAlertColor(alert.severity)} ${!alert.isRead ? "border-2" : ""
                                }`}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-full ${alert.severity === "high" ? "bg-red-100" :
                                            alert.severity === "medium" ? "bg-yellow-100" : "bg-blue-100"
                                        }`}>
                                        {getAlertIcon(alert.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="font-semibold text-lg">{alert.title}</h3>
                                                <p className="text-sm mt-1">{alert.message}</p>
                                            </div>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityBadge(
                                                    alert.severity
                                                )}`}
                                            >
                                                {alert.severity.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between mt-4">
                                            <p className="text-xs text-gray-500">
                                                {new Date(alert.createdAt).toLocaleString()}
                                            </p>
                                            <div className="flex gap-2">
                                                {!alert.isRead && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleMarkAsRead(alert.id)}
                                                    >
                                                        Mark as Read
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="p-12 text-center">
                        <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Alerts</h3>
                        <p className="text-gray-500 mb-4">
                            You don't have any alerts at the moment
                        </p>
                        <p className="text-sm text-gray-400">
                            Alerts will appear here when there are important updates about your farm
                        </p>
                    </CardContent>
                </Card>
            )}

            <Card className="mt-6 bg-gray-50">
                <CardHeader>
                    <CardTitle>Alert Settings</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div>
                                <p className="font-medium">Irrigation Alerts</p>
                                <p className="text-sm text-gray-500">Get notified about irrigation decisions</p>
                            </div>
                            <input type="checkbox" className="w-5 h-5" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div>
                                <p className="font-medium">Weather Alerts</p>
                                <p className="text-sm text-gray-500">Receive weather-related notifications</p>
                            </div>
                            <input type="checkbox" className="w-5 h-5" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div>
                                <p className="font-medium">Pest & Disease Alerts</p>
                                <p className="text-sm text-gray-500">Get alerts about crop health issues</p>
                            </div>
                            <input type="checkbox" className="w-5 h-5" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div>
                                <p className="font-medium">Market Price Alerts</p>
                                <p className="text-sm text-gray-500">Notify when prices change significantly</p>
                            </div>
                            <input type="checkbox" className="w-5 h-5" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
