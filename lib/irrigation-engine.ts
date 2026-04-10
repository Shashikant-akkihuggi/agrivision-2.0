export interface IrrigationInput {
    soilType: string;
    cropType: string;
    soilMoisture: number;
    temperature: number;
    humidity: number;
    rainProbability: number;
    growthStage: string;
}

export interface IrrigationDecision {
    decision: 'IRRIGATE' | 'DO_NOT_IRRIGATE' | 'REDUCE_IRRIGATION';
    confidence: number;
    waterAmount?: number;
    waterSaved?: number;
    reason: string;
    factors: {
        soilMoisture: string;
        weather: string;
        cropNeed: string;
    };
}

const SOIL_MOISTURE_THRESHOLDS = {
    clay: { critical: 25, optimal: 40, high: 60 },
    loam: { critical: 20, optimal: 35, high: 55 },
    sandy: { critical: 15, optimal: 30, high: 50 },
    'sandy-loam': { critical: 18, optimal: 32, high: 52 },
    'clay-loam': { critical: 22, optimal: 38, high: 58 },
};

const CROP_WATER_REQUIREMENTS = {
    rice: { low: 150, medium: 200, high: 250 },
    wheat: { low: 80, medium: 120, high: 150 },
    cotton: { low: 100, medium: 140, high: 180 },
    sugarcane: { low: 180, medium: 220, high: 280 },
    maize: { low: 90, medium: 130, high: 160 },
    soybean: { low: 70, medium: 100, high: 130 },
    tomato: { low: 60, medium: 90, high: 120 },
    potato: { low: 70, medium: 100, high: 130 },
    onion: { low: 50, medium: 80, high: 100 },
    default: { low: 80, medium: 120, high: 150 },
};

const GROWTH_STAGE_MULTIPLIER = {
    seedling: 0.6,
    vegetative: 1.0,
    flowering: 1.2,
    fruiting: 1.3,
    maturity: 0.8,
};

export function calculateIrrigationDecision(input: IrrigationInput): IrrigationDecision {
    const soilType = input.soilType.toLowerCase();
    const cropType = input.cropType.toLowerCase();

    const threshold = SOIL_MOISTURE_THRESHOLDS[soilType as keyof typeof SOIL_MOISTURE_THRESHOLDS]
        || SOIL_MOISTURE_THRESHOLDS.loam;

    const cropReq = CROP_WATER_REQUIREMENTS[cropType as keyof typeof CROP_WATER_REQUIREMENTS]
        || CROP_WATER_REQUIREMENTS.default;

    const stageMultiplier = GROWTH_STAGE_MULTIPLIER[input.growthStage as keyof typeof GROWTH_STAGE_MULTIPLIER]
        || 1.0;

    let decision: 'IRRIGATE' | 'DO_NOT_IRRIGATE' | 'REDUCE_IRRIGATION' = 'DO_NOT_IRRIGATE';
    let confidence = 0;
    let waterAmount = 0;
    let waterSaved = 0;
    let reason = '';
    const factors = {
        soilMoisture: '',
        weather: '',
        cropNeed: '',
    };

    // Rule 1: High rain probability
    if (input.rainProbability > 70) {
        decision = 'DO_NOT_IRRIGATE';
        confidence = 90 + (input.rainProbability - 70) / 3;
        waterSaved = cropReq.medium * stageMultiplier;
        reason = `High rain probability (${input.rainProbability.toFixed(0)}%). Natural rainfall expected.`;
        factors.weather = `Rain expected: ${input.rainProbability.toFixed(0)}%`;
        factors.soilMoisture = `Current: ${input.soilMoisture.toFixed(1)}%`;
        factors.cropNeed = `Stage: ${input.growthStage}`;
        return { decision, confidence, waterSaved, reason, factors };
    }

    // Rule 2: Critical soil moisture
    if (input.soilMoisture < threshold.critical) {
        decision = 'IRRIGATE';
        confidence = 95;
        waterAmount = cropReq.high * stageMultiplier;
        reason = `Critical soil moisture (${input.soilMoisture.toFixed(1)}%). Immediate irrigation required.`;
        factors.soilMoisture = `Critical: ${input.soilMoisture.toFixed(1)}% < ${threshold.critical}%`;
        factors.weather = `Rain: ${input.rainProbability.toFixed(0)}%, Temp: ${input.temperature.toFixed(1)}°C`;
        factors.cropNeed = `High demand in ${input.growthStage} stage`;
        return { decision, confidence, waterAmount, reason, factors };
    }

    // Rule 3: Optimal moisture range
    if (input.soilMoisture >= threshold.optimal && input.soilMoisture <= threshold.high) {
        decision = 'DO_NOT_IRRIGATE';
        confidence = 85;
        waterSaved = cropReq.medium * stageMultiplier;
        reason = `Soil moisture optimal (${input.soilMoisture.toFixed(1)}%). No irrigation needed.`;
        factors.soilMoisture = `Optimal: ${input.soilMoisture.toFixed(1)}%`;
        factors.weather = `Humidity: ${input.humidity.toFixed(0)}%`;
        factors.cropNeed = `Sufficient for ${input.growthStage} stage`;
        return { decision, confidence, waterSaved, reason, factors };
    }

    // Rule 4: High humidity reduces evaporation
    if (input.humidity > 80 && input.soilMoisture > threshold.critical) {
        decision = 'REDUCE_IRRIGATION';
        confidence = 75;
        waterAmount = cropReq.low * stageMultiplier * 0.7;
        waterSaved = cropReq.medium * stageMultiplier * 0.3;
        reason = `High humidity (${input.humidity.toFixed(0)}%) reduces evaporation. Minimal irrigation.`;
        factors.soilMoisture = `Moderate: ${input.soilMoisture.toFixed(1)}%`;
        factors.weather = `High humidity: ${input.humidity.toFixed(0)}%`;
        factors.cropNeed = `Reduced need due to low evaporation`;
        return { decision, confidence, waterAmount, waterSaved, reason, factors };
    }

    // Rule 5: High temperature increases evaporation
    if (input.temperature > 35 && input.soilMoisture < threshold.optimal) {
        decision = 'IRRIGATE';
        confidence = 80;
        waterAmount = cropReq.medium * stageMultiplier * 1.2;
        reason = `High temperature (${input.temperature.toFixed(1)}°C) increases evaporation. Irrigation recommended.`;
        factors.soilMoisture = `Below optimal: ${input.soilMoisture.toFixed(1)}%`;
        factors.weather = `High temp: ${input.temperature.toFixed(1)}°C`;
        factors.cropNeed = `Increased due to evaporation`;
        return { decision, confidence, waterAmount, reason, factors };
    }

    // Rule 6: Moderate rain probability
    if (input.rainProbability > 40 && input.rainProbability <= 70) {
        if (input.soilMoisture < threshold.optimal - 5) {
            decision = 'REDUCE_IRRIGATION';
            confidence = 70;
            waterAmount = cropReq.low * stageMultiplier;
            waterSaved = cropReq.medium * stageMultiplier * 0.5;
            reason = `Moderate rain chance (${input.rainProbability.toFixed(0)}%). Light irrigation recommended.`;
        } else {
            decision = 'DO_NOT_IRRIGATE';
            confidence = 75;
            waterSaved = cropReq.medium * stageMultiplier;
            reason = `Moderate rain chance (${input.rainProbability.toFixed(0)}%) with adequate moisture. Wait for rain.`;
        }
        factors.soilMoisture = `Current: ${input.soilMoisture.toFixed(1)}%`;
        factors.weather = `Rain possible: ${input.rainProbability.toFixed(0)}%`;
        factors.cropNeed = `Stage: ${input.growthStage}`;
        return { decision, confidence, waterAmount, waterSaved, reason, factors };
    }

    // Rule 7: Below optimal moisture, no rain expected
    if (input.soilMoisture < threshold.optimal && input.rainProbability < 40) {
        decision = 'IRRIGATE';
        confidence = 85;
        waterAmount = cropReq.medium * stageMultiplier;
        reason = `Soil moisture below optimal (${input.soilMoisture.toFixed(1)}%). No rain expected.`;
        factors.soilMoisture = `Below optimal: ${input.soilMoisture.toFixed(1)}% < ${threshold.optimal}%`;
        factors.weather = `Low rain chance: ${input.rainProbability.toFixed(0)}%`;
        factors.cropNeed = `Normal requirement for ${input.growthStage}`;
        return { decision, confidence, waterAmount, reason, factors };
    }

    // Default: maintain current moisture
    decision = 'DO_NOT_IRRIGATE';
    confidence = 70;
    waterSaved = cropReq.low * stageMultiplier;
    reason = `Current conditions stable. Monitor and reassess.`;
    factors.soilMoisture = `Adequate: ${input.soilMoisture.toFixed(1)}%`;
    factors.weather = `Stable conditions`;
    factors.cropNeed = `No immediate action needed`;

    return { decision, confidence, waterAmount, waterSaved, reason, factors };
}
