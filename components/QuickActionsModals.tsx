"use client";

import { useState } from "react";
import { X, Droplets, TrendingUp, DollarSign, AlertTriangle, CheckCircle, Activity, Sprout } from "lucide-react";
import { getIrrigationSchedule } from "@/lib/farmer-tools/irrigation-planner";

interface QuickActionsModalsProps {
    showIrrigationModal: boolean;
    setShowIrrigationModal: (show: boolean) => void;
    showAnalyticsModal: boolean;
    setShowAnalyticsModal: (show: boolean) => void;
    showLoanModal: boolean;
    setShowLoanModal: (show: boolean) => void;
    showAlertsModal: boolean;
    setShowAlertsModal: (show: boolean) => void;
}

export function QuickActionsModals({
    showIrrigationModal,
    setShowIrrigationModal,
    showAnalyticsModal,
    setShowAnalyticsModal,
    showLoanModal,
    setShowLoanModal,
    showAlertsModal,
    setShowAlertsModal
}: QuickActionsModalsProps) {
    const [selectedCrop, setSelectedCrop] = useState("rice");
    const [irrigationAdvice, setIrrigationAdvice] = useState<any>(null);
    const [loanForm, setLoanForm] = useState({ name: "", landSize: "", loanAmount: "" });
    const [loanSubmitted, setLoanSubmitted] = useState(false);

    const mockAlerts = [
        { id: 1, type: "warning", message: "High temperature expected tomorrow (38°C)", priority: "high" },
        { id: 2, type: "danger", message: "Pest risk detected in tomato crops", priority: "high" },
        { id: 3, type: "info", message: "Irrigation recommended for field A", priority: "medium" },
        { id: 4, type: "success", message: "Good weather conditions for next 3 days", priority: "low" }
    ];

    const mockAnalytics = {
        waterUsed: 500,
        efficiency: 70,
        yieldEstimate: 2.5
    };

    const handleIrrigationCropChange = (crop: string) => {
        setSelectedCrop(crop);
        const advice = getIrrigationSchedule(crop);
        setIrrigationAdvice(advice);
    };

    const handleLoanSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (loanForm.name && loanForm.landSize && loanForm.loanAmount) {
            setLoanSubmitted(true);
        }
    };

    // Initialize irrigation advice when modal opens
    if (showIrrigationModal && !irrigationAdvice) {
        const advice = getIrrigationSchedule(selectedCrop);
        setIrrigationAdvice(advice);
    }

    return (
        <>
            {/* Irrigation Modal */}
            {showIrrigationModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <Droplets className="w-6 h-6 text-blue-600" />
                                Check Irrigation
                            </h2>
                            <button
                                onClick={() => setShowIrrigationModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Crop
                                </label>
                                <select
                                    value={selectedCrop}
                                    onChange={(e) => handleIrrigationCropChange(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="rice">Rice</option>
                                    <option value="wheat">Wheat</option>
                                    <option value="tomato">Tomato</option>
                                    <option value="potato">Potato</option>
                                    <option value="maize">Maize</option>
                                    <option value="cotton">Cotton</option>
                                </select>
                            </div>

                            {irrigationAdvice && (
                                <div className="space-y-4">
                                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                                        <h3 className="font-semibold text-blue-900 mb-2">Watering Schedule</h3>
                                        <p className="text-sm text-blue-800">{irrigationAdvice.frequency}</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-xs text-gray-600 mb-1">Amount per Irrigation</p>
                                            <p className="text-lg font-semibold text-gray-900">{irrigationAdvice.amount}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-xs text-gray-600 mb-1">Best Timing</p>
                                            <p className="text-lg font-semibold text-gray-900">{irrigationAdvice.timing}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-xs text-gray-600 mb-1">Method</p>
                                            <p className="text-lg font-semibold text-gray-900">{irrigationAdvice.method}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-xs text-gray-600 mb-1">Critical Stages</p>
                                            <p className="text-sm font-semibold text-gray-900">{irrigationAdvice.criticalStages.length} stages</p>
                                        </div>
                                    </div>

                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-green-900 mb-2">💡 Pro Tips</h4>
                                        <ul className="space-y-1">
                                            {irrigationAdvice.tips.slice(0, 3).map((tip: string, index: number) => (
                                                <li key={index} className="text-sm text-green-800 flex items-start gap-2">
                                                    <span className="text-green-600">•</span>
                                                    {tip}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Analytics Modal */}
            {showAnalyticsModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full">
                        <div className="bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                                Farm Analytics
                            </h2>
                            <button
                                onClick={() => setShowAnalyticsModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center">
                                    <Droplets className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                    <p className="text-sm text-blue-700 mb-1">Water Used</p>
                                    <p className="text-3xl font-bold text-blue-900">{mockAnalytics.waterUsed}L</p>
                                    <p className="text-xs text-blue-600 mt-1">This month</p>
                                </div>

                                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
                                    <Activity className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                    <p className="text-sm text-green-700 mb-1">Efficiency</p>
                                    <p className="text-3xl font-bold text-green-900">{mockAnalytics.efficiency}%</p>
                                    <p className="text-xs text-green-600 mt-1">Overall score</p>
                                </div>

                                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 text-center">
                                    <Sprout className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                                    <p className="text-sm text-yellow-700 mb-1">Yield Estimate</p>
                                    <p className="text-3xl font-bold text-yellow-900">{mockAnalytics.yieldEstimate}</p>
                                    <p className="text-xs text-yellow-600 mt-1">Tons per acre</p>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
                                <h3 className="font-semibold text-gray-900 mb-3">Performance Summary</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-700">Water efficiency</span>
                                        <span className="text-sm font-semibold text-green-600">Good</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-700">Crop health</span>
                                        <span className="text-sm font-semibold text-green-600">Excellent</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-700">Resource utilization</span>
                                        <span className="text-sm font-semibold text-yellow-600">Moderate</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-800">
                                    💡 <span className="font-semibold">Tip:</span> Your efficiency is good! Consider implementing drip irrigation to reach 85%+
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Loan Application Modal */}
            {showLoanModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full">
                        <div className="bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <DollarSign className="w-6 h-6 text-yellow-600" />
                                Apply for Loan
                            </h2>
                            <button
                                onClick={() => {
                                    setShowLoanModal(false);
                                    setLoanSubmitted(false);
                                    setLoanForm({ name: "", landSize: "", loanAmount: "" });
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            {!loanSubmitted ? (
                                <form onSubmit={handleLoanSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={loanForm.name}
                                            onChange={(e) => setLoanForm({ ...loanForm, name: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                            placeholder="Enter your name"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Land Size (acres)
                                        </label>
                                        <input
                                            type="number"
                                            value={loanForm.landSize}
                                            onChange={(e) => setLoanForm({ ...loanForm, landSize: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                            placeholder="Enter land size"
                                            min="0.5"
                                            step="0.5"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Loan Amount (₹)
                                        </label>
                                        <input
                                            type="number"
                                            value={loanForm.loanAmount}
                                            onChange={(e) => setLoanForm({ ...loanForm, loanAmount: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                            placeholder="Enter loan amount"
                                            min="10000"
                                            step="1000"
                                            required
                                        />
                                    </div>

                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                        <p className="text-xs text-yellow-800">
                                            ℹ️ This is a demo form. No actual loan application will be processed.
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                                    >
                                        Submit Application
                                    </button>
                                </form>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-10 h-10 text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
                                    <p className="text-gray-600 mb-4">
                                        Your loan request for ₹{loanForm.loanAmount} has been received.
                                    </p>
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                                        <p className="text-sm text-green-800">
                                            <span className="font-semibold">Demo Mode:</span> This is a demonstration. No actual loan application was submitted.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setShowLoanModal(false);
                                            setLoanSubmitted(false);
                                            setLoanForm({ name: "", landSize: "", loanAmount: "" });
                                        }}
                                        className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Alerts Modal */}
            {showAlertsModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                                Active Alerts
                            </h2>
                            <button
                                onClick={() => setShowAlertsModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            {mockAlerts.map((alert) => {
                                const alertColors = {
                                    danger: 'bg-red-50 border-red-300 text-red-800',
                                    warning: 'bg-orange-50 border-orange-300 text-orange-800',
                                    info: 'bg-blue-50 border-blue-300 text-blue-800',
                                    success: 'bg-green-50 border-green-300 text-green-800'
                                };

                                const priorityBadges = {
                                    high: 'bg-red-100 text-red-700 border-red-300',
                                    medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
                                    low: 'bg-gray-100 text-gray-700 border-gray-300'
                                };

                                return (
                                    <div
                                        key={alert.id}
                                        className={`${alertColors[alert.type as keyof typeof alertColors]} border-2 rounded-xl p-4 flex items-start gap-3`}
                                    >
                                        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{alert.message}</p>
                                        </div>
                                        <span className={`${priorityBadges[alert.priority as keyof typeof priorityBadges]} px-2 py-1 rounded-full text-xs font-medium border`}>
                                            {alert.priority.toUpperCase()}
                                        </span>
                                    </div>
                                );
                            })}

                            <div className="bg-gray-50 rounded-lg p-4 text-center">
                                <p className="text-sm text-gray-600">
                                    💡 Check alerts regularly to stay informed about your farm conditions
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
