// Risk Indicator - Offline risk assessment
export interface RiskAssessment {
    overallRisk: 'Low' | 'Medium' | 'High';
    factors: {
        weather: { risk: string; reason: string };
        pest: { risk: string; reason: string };
        market: { risk: string; reason: string };
    };
    mitigation: string[];
}

export function assessRisk(
    crop: string,
    season: 'summer' | 'monsoon' | 'winter' | 'spring'
): RiskAssessment {
    const riskMatrix: Record<string, Record<string, RiskAssessment>> = {
        rice: {
            monsoon: {
                overallRisk: 'Medium',
                factors: {
                    weather: { risk: 'Medium', reason: 'Dependent on monsoon timing' },
                    pest: { risk: 'High', reason: 'High pest pressure in monsoon' },
                    market: { risk: 'Low', reason: 'Stable demand and MSP support' }
                },
                mitigation: [
                    'Use pest-resistant varieties',
                    'Ensure proper drainage',
                    'Monitor weather forecasts',
                    'Diversify with other crops'
                ]
            },
            summer: {
                overallRisk: 'High',
                factors: {
                    weather: { risk: 'High', reason: 'High water requirement in summer' },
                    pest: { risk: 'Medium', reason: 'Moderate pest pressure' },
                    market: { risk: 'Low', reason: 'Good demand' }
                },
                mitigation: [
                    'Ensure reliable irrigation',
                    'Use short-duration varieties',
                    'Consider alternative crops'
                ]
            },
            winter: {
                overallRisk: 'Low',
                factors: {
                    weather: { risk: 'Low', reason: 'Favorable conditions' },
                    pest: { risk: 'Low', reason: 'Low pest activity' },
                    market: { risk: 'Low', reason: 'Stable prices' }
                },
                mitigation: ['Standard practices sufficient']
            },
            spring: {
                overallRisk: 'Medium',
                factors: {
                    weather: { risk: 'Medium', reason: 'Variable conditions' },
                    pest: { risk: 'Medium', reason: 'Increasing pest activity' },
                    market: { risk: 'Low', reason: 'Good demand' }
                },
                mitigation: ['Monitor pests', 'Ensure irrigation']
            }
        },
        tomato: {
            summer: {
                overallRisk: 'High',
                factors: {
                    weather: { risk: 'High', reason: 'Heat stress and water stress' },
                    pest: { risk: 'High', reason: 'High pest and disease pressure' },
                    market: { risk: 'Medium', reason: 'Price fluctuations' }
                },
                mitigation: [
                    'Use shade nets',
                    'Drip irrigation essential',
                    'Regular pest monitoring',
                    'Stagger planting for continuous supply'
                ]
            },
            monsoon: {
                overallRisk: 'High',
                factors: {
                    weather: { risk: 'High', reason: 'Excess moisture causes diseases' },
                    pest: { risk: 'High', reason: 'Fungal diseases prevalent' },
                    market: { risk: 'Medium', reason: 'Supply glut possible' }
                },
                mitigation: [
                    'Use protected cultivation',
                    'Ensure drainage',
                    'Preventive fungicide spray',
                    'Choose resistant varieties'
                ]
            },
            winter: {
                overallRisk: 'Low',
                factors: {
                    weather: { risk: 'Low', reason: 'Ideal growing conditions' },
                    pest: { risk: 'Medium', reason: 'Moderate pest pressure' },
                    market: { risk: 'Low', reason: 'Good prices' }
                },
                mitigation: ['Standard IPM practices', 'Regular monitoring']
            },
            spring: {
                overallRisk: 'Medium',
                factors: {
                    weather: { risk: 'Medium', reason: 'Rising temperatures' },
                    pest: { risk: 'Medium', reason: 'Increasing pest activity' },
                    market: { risk: 'Low', reason: 'Good demand' }
                },
                mitigation: ['Ensure irrigation', 'Pest monitoring']
            }
        }
    };

    const defaultRisk: RiskAssessment = {
        overallRisk: 'Medium',
        factors: {
            weather: { risk: 'Medium', reason: 'Variable weather conditions' },
            pest: { risk: 'Medium', reason: 'Moderate pest pressure' },
            market: { risk: 'Medium', reason: 'Market fluctuations possible' }
        },
        mitigation: [
            'Monitor weather regularly',
            'Implement IPM practices',
            'Diversify crops',
            'Maintain good records'
        ]
    };

    return riskMatrix[crop.toLowerCase()]?.[season] || defaultRisk;
}
