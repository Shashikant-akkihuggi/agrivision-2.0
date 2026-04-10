export type IrrigationDecision = 'IRRIGATE' | 'DO NOT IRRIGATE';

export interface IrrigationRecommendationInput {
    soilMoisture: number;
    humidity: number;
    rainProbability: number;
    rainfall: number;
    hasLastIrrigation: boolean;
    hasCropProfile: boolean;
}

export interface IrrigationRecommendation {
    decision: IrrigationDecision;
    soilMoisture: number;
    confidence: number;
    reasons: string[];
}

const CRITICAL_SOIL_MOISTURE_THRESHOLD = 20;

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
}

function round(value: number) {
    return Math.round(value * 10) / 10;
}

export function createIrrigationRecommendation(
    input: IrrigationRecommendationInput
): IrrigationRecommendation {
    const reasons: string[] = [];
    let decision: IrrigationDecision = 'DO NOT IRRIGATE';
    let confidence = 60;

    if (input.soilMoisture < CRITICAL_SOIL_MOISTURE_THRESHOLD) {
        decision = 'IRRIGATE';
        confidence += 25;
        reasons.push(
            `Estimated soil moisture is ${round(input.soilMoisture)}%, which is below the critical ${CRITICAL_SOIL_MOISTURE_THRESHOLD}% safeguard threshold.`
        );

        if (input.rainProbability > 70) {
            reasons.push(
                `Rain probability is ${round(input.rainProbability)}%, but the field is already critically dry so irrigation should not be delayed.`
            );
        }
    } else if (input.rainProbability > 70) {
        decision = 'DO NOT IRRIGATE';
        confidence += 25;
        reasons.push(`Rain probability is ${round(input.rainProbability)}%, so upcoming rain is likely to cover the moisture gap.`);

        if (input.rainfall > 0) {
            reasons.push(`Rain is already being recorded at ${round(input.rainfall)} mm, which confirms irrigation is unnecessary right now.`);
        }
    } else if (input.soilMoisture < 40) {
        decision = 'IRRIGATE';
        confidence += 20;
        reasons.push(`Estimated soil moisture is ${round(input.soilMoisture)}%, which is below the 40% irrigation threshold.`);
    } else {
        decision = 'DO NOT IRRIGATE';
        confidence += 10;
        reasons.push(`Estimated soil moisture is ${round(input.soilMoisture)}%, which is above the 40% irrigation threshold.`);
    }

    if (input.humidity > 75) {
        confidence += 5;
        reasons.push(`Humidity is ${round(input.humidity)}%, so evaporation is lower and any irrigation should be reduced.`);
    }

    if (input.hasLastIrrigation) {
        confidence += 10;
    } else {
        confidence -= 10;
        reasons.push('Confidence is reduced because there is no previously recorded irrigation timestamp.');
    }

    if (input.hasCropProfile) {
        confidence += 5;
    }

    return {
        decision,
        soilMoisture: round(input.soilMoisture),
        confidence: clamp(Math.round(confidence), 45, 95),
        reasons,
    };
}
