export interface SoilMoistureInput {
    soilType: string;
    cropType: string;
    temperature: number;
    humidity: number;
    recentRainfallMm: number;
    lastIrrigationAt: Date | null;
    lastIrrigationAmountMm?: number | null;
    observedAt?: Date;
}

export type SoilMoistureSignals = {
    hoursSinceLastIrrigation: number | null;
    depletionWindowHours: number;
    rainfallContribution: number;
    irrigationContribution: number;
    humidityAdjustment: number;
    temperatureLoss: number;
    atmosphericAdjustment: number;
    cropDemandLoss: number;
};

export interface SoilMoistureEstimate {
    soilMoisture: number;
    signals: SoilMoistureSignals;
}

type SoilProfile = {
    baseMoisture: number;
    maxRecharge: number;
    drainageLossPerDay: number;
    rainAbsorption: number;
    temperatureLoss: number;
    humiditySupport: number;
    humidityPenalty: number;
};

type CropProfile = {
    dailyWaterDraw: number;
};

const SOIL_PROFILES: Record<string, SoilProfile> = {
    clay: {
        baseMoisture: 30,
        maxRecharge: 42,
        drainageLossPerDay: 2.4,
        rainAbsorption: 1.8,
        temperatureLoss: 0.55,
        humiditySupport: 0.08,
        humidityPenalty: 0.18,
    },
    loam: {
        baseMoisture: 24,
        maxRecharge: 36,
        drainageLossPerDay: 3,
        rainAbsorption: 1.45,
        temperatureLoss: 0.72,
        humiditySupport: 0.06,
        humidityPenalty: 0.2,
    },
    sandy: {
        baseMoisture: 17,
        maxRecharge: 28,
        drainageLossPerDay: 4.8,
        rainAbsorption: 1,
        temperatureLoss: 1,
        humiditySupport: 0.04,
        humidityPenalty: 0.22,
    },
    'sandy-loam': {
        baseMoisture: 20,
        maxRecharge: 31,
        drainageLossPerDay: 4.1,
        rainAbsorption: 1.15,
        temperatureLoss: 0.9,
        humiditySupport: 0.05,
        humidityPenalty: 0.21,
    },
    'clay-loam': {
        baseMoisture: 27,
        maxRecharge: 39,
        drainageLossPerDay: 2.7,
        rainAbsorption: 1.65,
        temperatureLoss: 0.62,
        humiditySupport: 0.07,
        humidityPenalty: 0.19,
    },
};

const CROP_PROFILES: Record<string, CropProfile> = {
    rice: { dailyWaterDraw: 2.2 },
    wheat: { dailyWaterDraw: 1.5 },
    cotton: { dailyWaterDraw: 1.8 },
    sugarcane: { dailyWaterDraw: 2.1 },
    maize: { dailyWaterDraw: 1.7 },
    soybean: { dailyWaterDraw: 1.4 },
    tomato: { dailyWaterDraw: 1.9 },
    potato: { dailyWaterDraw: 1.6 },
    onion: { dailyWaterDraw: 1.3 },
    default: { dailyWaterDraw: 1.6 },
};

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
}

function round(value: number) {
    return Math.round(value * 10) / 10;
}

function resolveSoilProfile(soilType: string) {
    return SOIL_PROFILES[soilType.toLowerCase()] || SOIL_PROFILES.loam;
}

function resolveCropProfile(cropType: string) {
    return CROP_PROFILES[cropType.toLowerCase()] || CROP_PROFILES.default;
}

function formatElapsed(hours: number) {
    if (hours < 24) {
        return `${Math.round(hours)} hour(s) ago`;
    }

    return `${round(hours / 24)} day(s) ago`;
}

function formatDuration(hours: number) {
    if (hours < 24) {
        return `${Math.round(hours)} hour(s)`;
    }

    return `${round(hours / 24)} day(s)`;
}

function getDepletionWindowHours(hoursSinceLastIrrigation: number | null) {
    if (hoursSinceLastIrrigation == null) {
        return 24;
    }

    return clamp(hoursSinceLastIrrigation, 0, 72);
}

function calculateHoursSinceLastIrrigation(
    lastIrrigationAt: Date | null,
    observedAt: Date
) {
    if (!lastIrrigationAt) {
        return null;
    }

    return Math.max(0, (observedAt.getTime() - lastIrrigationAt.getTime()) / (1000 * 60 * 60));
}

function calculateIrrigationContribution(
    soil: SoilProfile,
    crop: CropProfile,
    hoursSinceLastIrrigation: number | null,
    lastIrrigationAmountMm?: number | null
) {
    if (hoursSinceLastIrrigation == null) {
        return 0;
    }

    const fallbackIrrigationMm = crop.dailyWaterDraw * 2.5;
    const irrigationAmountMm = lastIrrigationAmountMm && lastIrrigationAmountMm > 0
        ? lastIrrigationAmountMm
        : fallbackIrrigationMm;
    const initialIrrigationContribution = Math.min(
        soil.maxRecharge * 0.7,
        irrigationAmountMm * soil.rainAbsorption
    );

    return Math.max(
        0,
        initialIrrigationContribution - (hoursSinceLastIrrigation / 24) * soil.drainageLossPerDay
    );
}

function calculateHumidityAdjustment(soil: SoilProfile, humidity: number) {
    return humidity >= 60
        ? (humidity - 60) * soil.humiditySupport
        : -1 * (60 - humidity) * soil.humidityPenalty;
}

function calculateTemperatureLoss(soil: SoilProfile, temperature: number) {
    return Math.max(0, temperature - 22) * soil.temperatureLoss;
}

function calculateCropDemandLoss(
    crop: CropProfile,
    temperature: number,
    depletionWindowHours: number
) {
    const depletionWindowDays = depletionWindowHours / 24;
    return (
        crop.dailyWaterDraw + Math.max(0, temperature - 30) * 0.12
    ) * depletionWindowDays;
}

function buildSoilMoistureReasons(
    input: SoilMoistureInput,
    estimate: SoilMoistureEstimate
) {
    const soil = resolveSoilProfile(input.soilType);
    const { signals } = estimate;
    const reasons: string[] = [];

    reasons.push(`${input.soilType} soil retention sets the baseline at about ${soil.baseMoisture}%.`);

    if (signals.hoursSinceLastIrrigation == null) {
        reasons.push('No irrigation history was recorded, so the estimate relies on weather and soil retention only.');
    } else {
        reasons.push(
            `Last irrigation was ${formatElapsed(signals.hoursSinceLastIrrigation)}, contributing ${round(signals.irrigationContribution)} moisture points.`
        );
    }

    if (input.recentRainfallMm > 0) {
        reasons.push(
            `Recent rainfall of ${round(input.recentRainfallMm)} mm added about ${round(signals.rainfallContribution)} moisture points.`
        );
    } else {
        reasons.push('No recent rainfall was reported, so there was no rainfall recharge.');
    }

    if (signals.temperatureLoss > 0 && signals.humidityAdjustment < 0) {
        reasons.push(
            `High temperature and dry air are reducing moisture by about ${round(Math.abs(signals.atmosphericAdjustment))} points.`
        );
    } else if (signals.temperatureLoss > 0) {
        reasons.push(`High temperature is reducing moisture by about ${round(signals.temperatureLoss)} points.`);
    } else if (signals.humidityAdjustment < 0) {
        reasons.push(`Low humidity is reducing moisture by about ${round(Math.abs(signals.humidityAdjustment))} points.`);
    } else if (signals.atmosphericAdjustment > 0) {
        reasons.push(`Humidity is preserving about ${round(signals.atmosphericAdjustment)} moisture points.`);
    } else {
        reasons.push('Temperature and humidity are close to neutral, so weather is not shifting soil moisture much.');
    }

    reasons.push(
        `${input.cropType} is drawing about ${round(signals.cropDemandLoss)} moisture points over the last ${formatDuration(signals.depletionWindowHours)} under the current weather.`
    );

    return reasons;
}

export function estimateSoilMoisture(input: SoilMoistureInput): SoilMoistureEstimate {
    const observedAt = input.observedAt ?? new Date();
    const soil = resolveSoilProfile(input.soilType);
    const crop = resolveCropProfile(input.cropType);
    const hoursSinceLastIrrigation = calculateHoursSinceLastIrrigation(
        input.lastIrrigationAt,
        observedAt
    );
    const irrigationContribution = calculateIrrigationContribution(
        soil,
        crop,
        hoursSinceLastIrrigation,
        input.lastIrrigationAmountMm
    );
    const rainfallContribution = Math.max(0, input.recentRainfallMm) * soil.rainAbsorption;
    const humidityAdjustment = calculateHumidityAdjustment(soil, input.humidity);
    const temperatureLoss = calculateTemperatureLoss(soil, input.temperature);
    const depletionWindowHours = getDepletionWindowHours(hoursSinceLastIrrigation);
    const cropDemandLoss = calculateCropDemandLoss(
        crop,
        input.temperature,
        depletionWindowHours
    );

    const rawMoisture = soil.baseMoisture
        + irrigationContribution
        + rainfallContribution
        + humidityAdjustment
        - temperatureLoss
        - cropDemandLoss;

    return {
        soilMoisture: clamp(round(rawMoisture), 0, 100),
        signals: {
            hoursSinceLastIrrigation: hoursSinceLastIrrigation == null ? null : round(hoursSinceLastIrrigation),
            depletionWindowHours: round(depletionWindowHours),
            rainfallContribution: round(rainfallContribution),
            irrigationContribution: round(irrigationContribution),
            humidityAdjustment: round(humidityAdjustment),
            temperatureLoss: round(temperatureLoss),
            atmosphericAdjustment: round(humidityAdjustment - temperatureLoss),
            cropDemandLoss: round(cropDemandLoss),
        },
    };
}

export function explainSoilMoistureEstimate(
    input: SoilMoistureInput,
    estimate: SoilMoistureEstimate
) {
    return buildSoilMoistureReasons(input, estimate);
}
