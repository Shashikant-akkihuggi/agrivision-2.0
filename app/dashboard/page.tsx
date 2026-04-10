"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useFarmStore } from "@/store/useFarmStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, TrendingUp, DollarSign, AlertTriangle, CheckCircle, Activity } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { QuickActionsModals } from "@/components/QuickActionsModals";

export default function DashboardPage() {
    const token = useAuthStore((state) => state.token);
    const { farms, setFarms, selectedFarm, setSelectedFarm } = useFarmStore();
    const [stats, setStats] = useState({
        waterSaved: 0,
        efficiency: 0,
        alerts: 0,
        revenue: 0,
    });
    const [loading, setLoading] = useState(true);

    // Modal states for Quick Actions
    const [showIrrigationModal, setShowIrrigationModal] = useState(false);
    const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
    const [showLoanModal, setShowLoanModal] = useState(false);
    const [showAlertsModal, setShowAlertsModal] = useState(false);

    useEffect(() => {
        const fetchFarms = async () => {
            try {
                const res = await fetch("/api/farms", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setFarms(data);
                if (data.length > 0 && !selectedFarm) {
                    setSelectedFarm(data[0]);
                }
            } catch (error) {
                console.error("Failed to fetch farms:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchStats = async () => {
            try {
                const res = await fetch("/api/analytics/summary", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            }
        };

        fetchFarms();
        fetchStats();
    }, [token, setFarms, selectedFarm, setSelectedFarm]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100/50 min-h-screen">
            {/* Header with improved typography */}
            <div className="mb-10 fade-in">
                <h1 className="text-4xl font-bold text-gray-900 mb-2 text-shadow-sm">Dashboard</h1>
                <p className="text-gray-600 text-lg">Welcome back! Here's your farm overview</p>
            </div>

            {/* Farm Selection Card with Glass Effect */}
            {selectedFarm && (
                <div className="mb-8 fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="glass rounded-2xl p-6 shadow-lg hover:shadow-xl transition-smooth">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedFarm.name}</h2>
                                <p className="text-gray-600 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {selectedFarm.location}
                                </p>
                            </div>
                            <div className="text-right bg-white/60 backdrop-blur-sm px-6 py-4 rounded-xl border border-gray-200/50">
                                <p className="text-sm text-gray-600 mb-1">Total Area</p>
                                <p className="text-3xl font-bold text-green-700">{selectedFarm.totalArea}</p>
                                <p className="text-sm text-gray-500">acres</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Cards with 3D Effect */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="stat-card p-6 fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-50 rounded-xl">
                            <Droplets className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                            Water
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-600">Water Saved</p>
                        <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.waterSaved)}</p>
                        <p className="text-sm text-gray-500">Liters</p>
                    </div>
                    {stats.waterSaved > 0 ? (
                        <div className="mt-4 flex items-center gap-2 text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                            <TrendingUp className="w-4 h-4" />
                            <span className="font-medium">From irrigation logs</span>
                        </div>
                    ) : (
                        <p className="mt-4 text-xs text-gray-500">No data yet</p>
                    )}
                </div>

                <div className="stat-card p-6 fade-in" style={{ animationDelay: '0.3s' }}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-50 rounded-xl">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                            Performance
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-600">Efficiency</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.efficiency}%</p>
                        <p className="text-sm text-gray-500">Overall</p>
                    </div>
                    {stats.efficiency > 0 ? (
                        <div className="mt-4 flex items-center gap-2 text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                            <CheckCircle className="w-4 h-4" />
                            <span className="font-medium">Based on irrigation data</span>
                        </div>
                    ) : (
                        <p className="mt-4 text-xs text-gray-500">No data yet</p>
                    )}
                </div>

                <div className="stat-card p-6 fade-in" style={{ animationDelay: '0.4s' }}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-yellow-50 rounded-xl">
                            <DollarSign className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="text-xs font-medium text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                            Revenue
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-600">Revenue</p>
                        <p className="text-3xl font-bold text-gray-900">₹{formatNumber(stats.revenue)}</p>
                        <p className="text-sm text-gray-500">Total</p>
                    </div>
                    <p className="mt-4 text-xs text-gray-500">Coming soon</p>
                </div>

                <div className="stat-card p-6 fade-in" style={{ animationDelay: '0.5s' }}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-red-50 rounded-xl">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="text-xs font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full">
                            Alerts
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.alerts}</p>
                        <p className="text-sm text-gray-500">Requires attention</p>
                    </div>
                    {stats.alerts > 0 && (
                        <div className="mt-4 flex items-center gap-2 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="font-medium">Action needed</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Section with Enhanced Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="fade-in" style={{ animationDelay: '0.6s' }}>
                    <CardHeader>
                        <CardTitle className="text-xl">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stats.waterSaved > 0 || stats.alerts > 0 ? (
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600">Activity tracking coming soon</p>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Activity className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-sm font-medium text-gray-900 mb-1">No activity yet</p>
                                <p className="text-xs text-gray-500">Start using the system to see activity</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="fade-in" style={{ animationDelay: '0.7s' }}>
                    <CardHeader>
                        <CardTitle className="text-xl">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setShowIrrigationModal(true)}
                                className="group p-6 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 transition-smooth text-left"
                            >
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth">
                                    <Droplets className="w-6 h-6 text-blue-600" />
                                </div>
                                <p className="text-sm font-semibold text-gray-900">Check Irrigation</p>
                                <p className="text-xs text-gray-500 mt-1">Smart decisions</p>
                            </button>
                            <button
                                onClick={() => setShowAnalyticsModal(true)}
                                className="group p-6 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50/50 transition-smooth text-left"
                            >
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth">
                                    <TrendingUp className="w-6 h-6 text-green-600" />
                                </div>
                                <p className="text-sm font-semibold text-gray-900">View Analytics</p>
                                <p className="text-xs text-gray-500 mt-1">Performance data</p>
                            </button>
                            <button
                                onClick={() => setShowLoanModal(true)}
                                className="group p-6 border-2 border-gray-200 rounded-xl hover:border-yellow-300 hover:bg-yellow-50/50 transition-smooth text-left"
                            >
                                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth">
                                    <DollarSign className="w-6 h-6 text-yellow-600" />
                                </div>
                                <p className="text-sm font-semibold text-gray-900">Apply for Loan</p>
                                <p className="text-xs text-gray-500 mt-1">Quick finance</p>
                            </button>
                            <button
                                onClick={() => setShowAlertsModal(true)}
                                className="group p-6 border-2 border-gray-200 rounded-xl hover:border-red-300 hover:bg-red-50/50 transition-smooth text-left"
                            >
                                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth">
                                    <AlertTriangle className="w-6 h-6 text-red-600" />
                                </div>
                                <p className="text-sm font-semibold text-gray-900">View Alerts</p>
                                <p className="text-xs text-gray-500 mt-1">Stay informed</p>
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions Modals */}
            <QuickActionsModals
                showIrrigationModal={showIrrigationModal}
                setShowIrrigationModal={setShowIrrigationModal}
                showAnalyticsModal={showAnalyticsModal}
                setShowAnalyticsModal={setShowAnalyticsModal}
                showLoanModal={showLoanModal}
                setShowLoanModal={setShowLoanModal}
                showAlertsModal={showAlertsModal}
                setShowAlertsModal={setShowAlertsModal}
            />
        </div>
    );
}
