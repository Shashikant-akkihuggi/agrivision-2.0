"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DollarSign, CheckCircle, XCircle, Clock } from "lucide-react";
import { formatNumber } from "@/lib/utils";

export default function FinancePage() {
    const token = useAuthStore((state) => state.token);
    const [eligibility, setEligibility] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [loanAmount, setLoanAmount] = useState("");
    const [showApplication, setShowApplication] = useState(false);

    const checkEligibility = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/loans/eligibility", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            setEligibility(data);
        } catch (error) {
            console.error("Failed to check eligibility:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkEligibility();
    }, []);

    if (loading && !eligibility) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Finance & Micro-loans</h1>
                <p className="text-gray-500 mt-1">Access credit for your farming needs</p>
            </div>

            {eligibility && (
                <>
                    <Card className={`mb-6 ${eligibility.eligible ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                {eligibility.eligible ? (
                                    <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                                ) : (
                                    <XCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
                                )}
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold mb-2">
                                        {eligibility.eligible ? "You're Eligible!" : "Not Eligible"}
                                    </h2>
                                    <p className="text-lg mb-4">{eligibility.reason}</p>
                                    {eligibility.eligible && (
                                        <div className="grid grid-cols-3 gap-4 mt-4">
                                            <div>
                                                <p className="text-sm font-medium">Maximum Loan</p>
                                                <p className="text-2xl font-bold">₹{formatNumber(eligibility.maxAmount)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">Interest Rate</p>
                                                <p className="text-2xl font-bold">{eligibility.interestRate}%</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">Total Land</p>
                                                <p className="text-2xl font-bold">{eligibility.totalArea} acres</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {eligibility.eligible && !showApplication && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Apply for Loan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium">Loan Amount (₹)</label>
                                        <Input
                                            type="number"
                                            placeholder="Enter amount"
                                            value={loanAmount}
                                            onChange={(e) => setLoanAmount(e.target.value)}
                                            max={eligibility.maxAmount}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Maximum: ₹{formatNumber(eligibility.maxAmount)}
                                        </p>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Loan Amount:</span>
                                            <span className="font-semibold">₹{formatNumber(parseInt(loanAmount || "0"))}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Interest ({eligibility.interestRate}%):</span>
                                            <span className="font-semibold">
                                                ₹{formatNumber((parseInt(loanAmount || "0") * eligibility.interestRate) / 100)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm border-t pt-2">
                                            <span className="font-semibold">Total Repayment:</span>
                                            <span className="font-bold text-lg">
                                                ₹{formatNumber(
                                                    parseInt(loanAmount || "0") +
                                                    (parseInt(loanAmount || "0") * eligibility.interestRate) / 100
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-blue-50 rounded-lg">
                                        <h4 className="font-semibold mb-2">Repayment Terms</h4>
                                        <ul className="text-sm space-y-1">
                                            <li>• Repayment after harvest season</li>
                                            <li>• Flexible payment schedule</li>
                                            <li>• No prepayment penalty</li>
                                            <li>• Grace period: 30 days</li>
                                        </ul>
                                    </div>

                                    <Button
                                        className="w-full"
                                        size="lg"
                                        onClick={() => setShowApplication(true)}
                                        disabled={!loanAmount || parseInt(loanAmount) > eligibility.maxAmount}
                                    >
                                        <DollarSign className="w-4 h-4 mr-2" />
                                        Apply for Loan
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {showApplication && (
                        <Card className="bg-green-50 border-green-200">
                            <CardContent className="p-8 text-center">
                                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
                                <p className="text-gray-600 mb-6">
                                    Your loan application for ₹{formatNumber(parseInt(loanAmount))} has been submitted.
                                    We'll review it within 24-48 hours.
                                </p>
                                <Button onClick={() => setShowApplication(false)}>Apply for Another Loan</Button>
                            </CardContent>
                        </Card>
                    )}
                </>
            )}

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Loan History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-4">
                                <Clock className="w-5 h-5 text-yellow-600" />
                                <div>
                                    <p className="font-semibold">₹25,000</p>
                                    <p className="text-sm text-gray-500">Applied on Jan 15, 2024</p>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                                Pending
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-4">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <div>
                                    <p className="font-semibold">₹15,000</p>
                                    <p className="text-sm text-gray-500">Disbursed on Dec 1, 2023</p>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                Repaid
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="mt-6 bg-purple-50 border-purple-200">
                <CardHeader>
                    <CardTitle>Why Choose Our Loans?</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold">Low Interest Rates</p>
                                <p className="text-sm text-gray-600">Starting from 5% per annum</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold">Quick Approval</p>
                                <p className="text-sm text-gray-600">Get approved within 48 hours</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold">Flexible Repayment</p>
                                <p className="text-sm text-gray-600">Pay after harvest season</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold">No Hidden Charges</p>
                                <p className="text-sm text-gray-600">Transparent pricing</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
