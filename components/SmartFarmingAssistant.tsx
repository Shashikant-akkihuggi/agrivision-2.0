"use client";

import { useState } from 'react';
import { Sparkles, TrendingUp, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

type TabType = 'advisor' | 'supply-chain';

interface AdvisoryResponse {
    immediateActions: string[];
    riskAlerts: {
        weather: string[];
        disease: string[];
        market: string[];
    };
    marketDecision: {
        action: string;
        reasoning: string;
        confidence: string;
    };
    whereToSell: {
        recommended: {
            market: string;
            price: number;
            netProfit: number;
        };
        alternatives: Array<{
            market: string;
            price: number;
            netProfit: number;
            reason: string;
        }>;
    };
    profitOptimization: string;
}

interface SupplyChainResponse {
    bestMarket: {
        name: string;
        price: number;
        distance: number;
        transportCost: number;
        netProfit: number;
    };
    alternatives: Array<{
        name: string;
        price: number;
        distance: number;
        transportCost: number;
        netProfit: number;
    }>;
    recommendation: string;
}

export function SmartFarmingAssistant() {
    const [activeTab, setActiveTab] = useState<TabType>('advisor');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // AI Advisor state
    const [advisorCrop, setAdvisorCrop] = useState('');
    const [advisorLocation, setAdvisorLocation] = useState('');
    const [advisoryResult, setAdvisoryResult] = useState<AdvisoryResponse | null>(null);

    // Supply Chain state
    const [supplyCrop, setSupplyCrop] = useState('');
    const [supplyLocation, setSupplyLocation] = useState('');
    const [supplyResult, setSupplyResult] = useState<SupplyChainResponse | null>(null);

    const handleGetAdvice = async () => {
        if (!advisorCrop.trim()) {
            setError('Please enter a crop name');
            return;
        }

        setLoading(true);
        setError(null);
        setAdvisoryResult(null);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            const response = await fetch('/api/smart-assistant/advisor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    crop: advisorCrop,
                    location: advisorLocation || 'Karnataka',
                }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error('Failed to fetch advisory');
            }

            const data = await response.json();
            setAdvisoryResult(data.advisory);
        } catch (err: any) {
            console.error('Advisory error:', err);
            if (err.name === 'AbortError') {
                setError('Request timed out. Please try again.');
            } else {
                setError('Unable to fetch advice. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleFindMarket = async () => {
        if (!supplyCrop.trim()) {
            setError('Please enter a crop name');
            return;
        }

        setLoading(true);
        setError(null);
        setSupplyResult(null);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch('/api/smart-assistant/supply-chain', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    crop: supplyCrop,
                    location: supplyLocation || 'Karnataka',
                }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error('Failed to fetch market data');
            }

            const data = await response.json();
            setSupplyResult(data);
        } catch (err: any) {
            console.error('Supply chain error:', err);
            if (err.name === 'AbortError') {
                setError('Request timed out. Please try again.');
            } else {
                setError('Unable to fetch market data. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="smart-farming-assistant-container" style={{
            marginTop: '48px',
            padding: '32px 0',
            borderTop: '1px solid #e5e7eb',
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
                {/* Header */}
                <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                    <h2 style={{
                        fontSize: '32px',
                        fontWeight: 'bold',
                        color: '#111827',
                        marginBottom: '8px',
                    }}>
                        🌾 Smart Farming Assistant
                    </h2>
                    <p style={{ color: '#6b7280', fontSize: '16px' }}>
                        Get AI-powered advice and market insights for better farming decisions
                    </p>
                </div>

                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    gap: '16px',
                    marginBottom: '32px',
                    borderBottom: '2px solid #e5e7eb',
                }}>
                    <button
                        onClick={() => {
                            setActiveTab('advisor');
                            setError(null);
                        }}
                        style={{
                            padding: '12px 24px',
                            fontSize: '16px',
                            fontWeight: '600',
                            color: activeTab === 'advisor' ? '#16a34a' : '#6b7280',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'advisor' ? '3px solid #16a34a' : '3px solid transparent',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}
                    >
                        <Sparkles size={20} />
                        AI Advisor
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('supply-chain');
                            setError(null);
                        }}
                        style={{
                            padding: '12px 24px',
                            fontSize: '16px',
                            fontWeight: '600',
                            color: activeTab === 'supply-chain' ? '#16a34a' : '#6b7280',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'supply-chain' ? '3px solid #16a34a' : '3px solid transparent',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}
                    >
                        <TrendingUp size={20} />
                        Supply Chain
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div style={{
                        padding: '16px',
                        backgroundColor: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '8px',
                        marginBottom: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                    }}>
                        <AlertCircle size={20} color="#dc2626" />
                        <span style={{ color: '#dc2626', fontSize: '14px' }}>{error}</span>
                    </div>
                )}

                {/* AI Advisor Tab */}
                {activeTab === 'advisor' && (
                    <div className="advisor-tab">
                        <div style={{
                            backgroundColor: '#ffffff',
                            borderRadius: '12px',
                            padding: '32px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        }}>
                            <h3 style={{
                                fontSize: '20px',
                                fontWeight: '600',
                                marginBottom: '24px',
                                color: '#111827',
                            }}>
                                Get Personalized Farming Advice
                            </h3>

                            <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
                                <div>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        marginBottom: '8px',
                                        color: '#374151',
                                    }}>
                                        Crop Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={advisorCrop}
                                        onChange={(e) => setAdvisorCrop(e.target.value)}
                                        placeholder="e.g., Rice, Tomato, Cotton"
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        marginBottom: '8px',
                                        color: '#374151',
                                    }}>
                                        Location (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={advisorLocation}
                                        onChange={(e) => setAdvisorLocation(e.target.value)}
                                        placeholder="e.g., Bangalore, Karnataka"
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                        }}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleGetAdvice}
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    backgroundColor: loading ? '#9ca3af' : '#16a34a',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    transition: 'background-color 0.2s',
                                }}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Getting Advice...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={20} />
                                        Get Advice
                                    </>
                                )}
                            </button>

                            {/* Advisory Results */}
                            {advisoryResult && (
                                <div style={{ marginTop: '32px' }}>
                                    <div style={{
                                        padding: '16px',
                                        backgroundColor: '#f0fdf4',
                                        border: '1px solid #86efac',
                                        borderRadius: '8px',
                                        marginBottom: '16px',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                            <CheckCircle size={20} color="#16a34a" />
                                            <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#16a34a' }}>
                                                Advisory Generated Successfully
                                            </h4>
                                        </div>
                                    </div>

                                    {/* Immediate Actions */}
                                    <div style={{ marginBottom: '24px' }}>
                                        <h4 style={{
                                            fontSize: '18px',
                                            fontWeight: '600',
                                            marginBottom: '12px',
                                            color: '#111827',
                                        }}>
                                            🚜 Immediate Actions (Next 3-5 Days)
                                        </h4>
                                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                            {advisoryResult.immediateActions.map((action, idx) => (
                                                <li key={idx} style={{
                                                    padding: '12px',
                                                    backgroundColor: '#f9fafb',
                                                    borderLeft: '4px solid #16a34a',
                                                    marginBottom: '8px',
                                                    borderRadius: '4px',
                                                    fontSize: '14px',
                                                }}>
                                                    {action}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Risk Alerts */}
                                    {(advisoryResult.riskAlerts.weather.length > 0 ||
                                        advisoryResult.riskAlerts.disease.length > 0 ||
                                        advisoryResult.riskAlerts.market.length > 0) && (
                                            <div style={{ marginBottom: '24px' }}>
                                                <h4 style={{
                                                    fontSize: '18px',
                                                    fontWeight: '600',
                                                    marginBottom: '12px',
                                                    color: '#111827',
                                                }}>
                                                    ⚠️ Risk Alerts
                                                </h4>
                                                {advisoryResult.riskAlerts.weather.map((risk, idx) => (
                                                    <div key={idx} style={{
                                                        padding: '12px',
                                                        backgroundColor: '#fef3c7',
                                                        borderLeft: '4px solid #f59e0b',
                                                        marginBottom: '8px',
                                                        borderRadius: '4px',
                                                        fontSize: '14px',
                                                    }}>
                                                        {risk}
                                                    </div>
                                                ))}
                                                {advisoryResult.riskAlerts.disease.map((risk, idx) => (
                                                    <div key={idx} style={{
                                                        padding: '12px',
                                                        backgroundColor: '#fee2e2',
                                                        borderLeft: '4px solid #ef4444',
                                                        marginBottom: '8px',
                                                        borderRadius: '4px',
                                                        fontSize: '14px',
                                                    }}>
                                                        {risk}
                                                    </div>
                                                ))}
                                                {advisoryResult.riskAlerts.market.map((risk, idx) => (
                                                    <div key={idx} style={{
                                                        padding: '12px',
                                                        backgroundColor: '#dbeafe',
                                                        borderLeft: '4px solid #3b82f6',
                                                        marginBottom: '8px',
                                                        borderRadius: '4px',
                                                        fontSize: '14px',
                                                    }}>
                                                        {risk}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                    {/* Market Decision */}
                                    <div style={{ marginBottom: '24px' }}>
                                        <h4 style={{
                                            fontSize: '18px',
                                            fontWeight: '600',
                                            marginBottom: '12px',
                                            color: '#111827',
                                        }}>
                                            💰 Market Decision
                                        </h4>
                                        <div style={{
                                            padding: '16px',
                                            backgroundColor: '#f0fdf4',
                                            border: '2px solid #16a34a',
                                            borderRadius: '8px',
                                        }}>
                                            <div style={{ marginBottom: '8px' }}>
                                                <span style={{ fontWeight: '600', fontSize: '16px', color: '#16a34a' }}>
                                                    Action: {advisoryResult.marketDecision.action}
                                                </span>
                                            </div>
                                            <p style={{ fontSize: '14px', color: '#374151', marginBottom: '8px' }}>
                                                {advisoryResult.marketDecision.reasoning}
                                            </p>
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '4px 12px',
                                                backgroundColor: '#dcfce7',
                                                color: '#16a34a',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                            }}>
                                                Confidence: {advisoryResult.marketDecision.confidence.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Where to Sell */}
                                    <div style={{ marginBottom: '24px' }}>
                                        <h4 style={{
                                            fontSize: '18px',
                                            fontWeight: '600',
                                            marginBottom: '12px',
                                            color: '#111827',
                                        }}>
                                            📍 Where to Sell
                                        </h4>
                                        <div style={{
                                            padding: '16px',
                                            backgroundColor: '#ffffff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            marginBottom: '12px',
                                        }}>
                                            <div style={{ marginBottom: '8px' }}>
                                                <span style={{ fontWeight: '600', color: '#16a34a' }}>Recommended:</span>
                                                <span style={{ marginLeft: '8px' }}>{advisoryResult.whereToSell.recommended.market}</span>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '14px' }}>
                                                <div>
                                                    <span style={{ color: '#6b7280' }}>Price:</span>
                                                    <span style={{ marginLeft: '8px', fontWeight: '600' }}>
                                                        ₹{advisoryResult.whereToSell.recommended.price}/quintal
                                                    </span>
                                                </div>
                                                <div>
                                                    <span style={{ color: '#6b7280' }}>Net Profit:</span>
                                                    <span style={{ marginLeft: '8px', fontWeight: '600', color: '#16a34a' }}>
                                                        ₹{advisoryResult.whereToSell.recommended.netProfit}/quintal
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Profit Optimization */}
                                    <div>
                                        <h4 style={{
                                            fontSize: '18px',
                                            fontWeight: '600',
                                            marginBottom: '12px',
                                            color: '#111827',
                                        }}>
                                            📊 Profit Optimization Tip
                                        </h4>
                                        <div style={{
                                            padding: '16px',
                                            backgroundColor: '#eff6ff',
                                            border: '1px solid #93c5fd',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            color: '#1e40af',
                                        }}>
                                            {advisoryResult.profitOptimization}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Supply Chain Tab */}
                {activeTab === 'supply-chain' && (
                    <div className="supply-chain-tab">
                        <div style={{
                            backgroundColor: '#ffffff',
                            borderRadius: '12px',
                            padding: '32px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        }}>
                            <h3 style={{
                                fontSize: '20px',
                                fontWeight: '600',
                                marginBottom: '24px',
                                color: '#111827',
                            }}>
                                Find Best Market for Your Crop
                            </h3>

                            <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
                                <div>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        marginBottom: '8px',
                                        color: '#374151',
                                    }}>
                                        Crop Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={supplyCrop}
                                        onChange={(e) => setSupplyCrop(e.target.value)}
                                        placeholder="e.g., Rice, Tomato, Cotton"
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        marginBottom: '8px',
                                        color: '#374151',
                                    }}>
                                        Your Location (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={supplyLocation}
                                        onChange={(e) => setSupplyLocation(e.target.value)}
                                        placeholder="e.g., Bangalore, Karnataka"
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                        }}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleFindMarket}
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    backgroundColor: loading ? '#9ca3af' : '#3b82f6',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    transition: 'background-color 0.2s',
                                }}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Finding Markets...
                                    </>
                                ) : (
                                    <>
                                        <TrendingUp size={20} />
                                        Find Best Market
                                    </>
                                )}
                            </button>

                            {/* Supply Chain Results */}
                            {supplyResult && (
                                <div style={{ marginTop: '32px' }}>
                                    <div style={{
                                        padding: '16px',
                                        backgroundColor: '#eff6ff',
                                        border: '1px solid #93c5fd',
                                        borderRadius: '8px',
                                        marginBottom: '16px',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                            <CheckCircle size={20} color="#3b82f6" />
                                            <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1e40af' }}>
                                                Market Analysis Complete
                                            </h4>
                                        </div>
                                    </div>

                                    {/* Best Market */}
                                    <div style={{ marginBottom: '24px' }}>
                                        <h4 style={{
                                            fontSize: '18px',
                                            fontWeight: '600',
                                            marginBottom: '12px',
                                            color: '#111827',
                                        }}>
                                            🏆 Best Market
                                        </h4>
                                        <div style={{
                                            padding: '20px',
                                            backgroundColor: '#f0fdf4',
                                            border: '2px solid #16a34a',
                                            borderRadius: '12px',
                                        }}>
                                            <h5 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#16a34a' }}>
                                                {supplyResult.bestMarket.name}
                                            </h5>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                                                <div>
                                                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Market Price</div>
                                                    <div style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>
                                                        ₹{supplyResult.bestMarket.price}
                                                    </div>
                                                    <div style={{ fontSize: '12px', color: '#6b7280' }}>per quintal</div>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Net Profit</div>
                                                    <div style={{ fontSize: '20px', fontWeight: '700', color: '#16a34a' }}>
                                                        ₹{supplyResult.bestMarket.netProfit}
                                                    </div>
                                                    <div style={{ fontSize: '12px', color: '#6b7280' }}>per quintal</div>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Distance</div>
                                                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                                                        {supplyResult.bestMarket.distance} km
                                                    </div>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Transport Cost</div>
                                                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#ef4444' }}>
                                                        ₹{supplyResult.bestMarket.transportCost}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Alternatives */}
                                    {supplyResult.alternatives && supplyResult.alternatives.length > 0 && (
                                        <div style={{ marginBottom: '24px' }}>
                                            <h4 style={{
                                                fontSize: '18px',
                                                fontWeight: '600',
                                                marginBottom: '12px',
                                                color: '#111827',
                                            }}>
                                                📊 Alternative Markets
                                            </h4>
                                            {supplyResult.alternatives.map((alt, idx) => (
                                                <div key={idx} style={{
                                                    padding: '16px',
                                                    backgroundColor: '#ffffff',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    marginBottom: '12px',
                                                }}>
                                                    <div style={{ fontWeight: '600', marginBottom: '8px' }}>{alt.name}</div>
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', fontSize: '14px' }}>
                                                        <div>
                                                            <span style={{ color: '#6b7280' }}>Price:</span>
                                                            <div style={{ fontWeight: '600' }}>₹{alt.price}</div>
                                                        </div>
                                                        <div>
                                                            <span style={{ color: '#6b7280' }}>Distance:</span>
                                                            <div style={{ fontWeight: '600' }}>{alt.distance} km</div>
                                                        </div>
                                                        <div>
                                                            <span style={{ color: '#6b7280' }}>Transport:</span>
                                                            <div style={{ fontWeight: '600', color: '#ef4444' }}>₹{alt.transportCost}</div>
                                                        </div>
                                                        <div>
                                                            <span style={{ color: '#6b7280' }}>Net Profit:</span>
                                                            <div style={{ fontWeight: '600', color: '#16a34a' }}>₹{alt.netProfit}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Recommendation */}
                                    <div>
                                        <h4 style={{
                                            fontSize: '18px',
                                            fontWeight: '600',
                                            marginBottom: '12px',
                                            color: '#111827',
                                        }}>
                                            💡 Recommendation
                                        </h4>
                                        <div style={{
                                            padding: '16px',
                                            backgroundColor: '#eff6ff',
                                            border: '1px solid #93c5fd',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            color: '#1e40af',
                                        }}>
                                            {supplyResult.recommendation}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
