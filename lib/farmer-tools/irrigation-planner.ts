// Irrigation Planner - Rule-based watering schedules
export interface IrrigationSchedule {
    frequency: string;
    amount: string;
    timing: string;
    method: string;
    criticalStages: string[];
    tips: string[];
}

export function getIrrigationSchedule(crop: string): IrrigationSchedule {
    const schedules: Record<string, IrrigationSchedule> = {
        rice: {
            frequency: 'Daily for first 30 days, then every 2-3 days',
            amount: '50-75mm per irrigation',
            timing: 'Early morning (6-8 AM)',
            method: 'Flood irrigation or drip',
            criticalStages: ['Transplanting', 'Tillering', 'Flowering', 'Grain filling'],
            tips: [
                'Maintain 2-5cm water level in field',
                'Drain water 10 days before harvest',
                'Avoid water stress during flowering'
            ]
        },
        wheat: {
            frequency: 'Every 7-10 days',
            amount: '40-50mm per irrigation',
            timing: 'Early morning or evening',
            method: 'Sprinkler or furrow irrigation',
            criticalStages: ['Crown root initiation', 'Tillering', 'Flowering', 'Grain filling'],
            tips: [
                'First irrigation 20-25 days after sowing',
                'Avoid waterlogging',
                'Reduce irrigation near harvest'
            ]
        },
        tomato: {
            frequency: 'Every 2-3 days',
            amount: '25-30mm per irrigation',
            timing: 'Early morning',
            method: 'Drip irrigation recommended',
            criticalStages: ['Transplanting', 'Flowering', 'Fruit development'],
            tips: [
                'Maintain consistent moisture',
                'Avoid wetting leaves to prevent disease',
                'Increase frequency during fruiting'
            ]
        },
        potato: {
            frequency: 'Every 5-7 days',
            amount: '30-40mm per irrigation',
            timing: 'Early morning',
            method: 'Furrow or drip irrigation',
            criticalStages: ['Tuber initiation', 'Tuber bulking'],
            tips: [
                'Critical during tuber formation',
                'Stop irrigation 2 weeks before harvest',
                'Avoid over-watering to prevent rot'
            ]
        },
        maize: {
            frequency: 'Every 7-10 days',
            amount: '40-50mm per irrigation',
            timing: 'Early morning',
            method: 'Furrow or sprinkler',
            criticalStages: ['Knee-high stage', 'Tasseling', 'Silking', 'Grain filling'],
            tips: [
                'Most critical during flowering',
                'Ensure adequate moisture during grain filling',
                'Reduce irrigation near maturity'
            ]
        },
        cotton: {
            frequency: 'Every 10-15 days',
            amount: '50-60mm per irrigation',
            timing: 'Early morning or evening',
            method: 'Furrow or drip irrigation',
            criticalStages: ['Flowering', 'Boll formation', 'Boll development'],
            tips: [
                'Avoid water stress during flowering',
                'Stop irrigation 3-4 weeks before harvest',
                'Maintain moderate moisture'
            ]
        }
    };

    const defaultSchedule: IrrigationSchedule = {
        frequency: 'Every 3-5 days',
        amount: '30-40mm per irrigation',
        timing: 'Early morning (6-8 AM)',
        method: 'Drip or sprinkler irrigation',
        criticalStages: ['Germination', 'Vegetative growth', 'Flowering', 'Fruiting'],
        tips: [
            'Monitor soil moisture regularly',
            'Adjust based on weather conditions',
            'Avoid over-watering'
        ]
    };

    return schedules[crop.toLowerCase()] || defaultSchedule;
}
