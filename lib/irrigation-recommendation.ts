import { prisma } from '@/lib/prisma';
import { fetchForecastData, fetchWeatherData } from '@/lib/weather-service';
import {
    estimateSoilMoisture,
    explainSoilMoistureEstimate,
} from '@/engines/soilMoisture.engine';
import { createIrrigationRecommendation } from '@/engines/irrigation.engine';

export interface IrrigationRecommendationResult {
    decision: 'IRRIGATE' | 'DO NOT IRRIGATE';
    soilMoisture: number;
    confidence: number;
    reasons: string[];
    field: {
        id: string;
        name: string;
        soilType: string;
        cropType: string;
    };
    weather: {
        temperature: number;
        humidity: number;
        rainfall: number;
        rainProbability: number;
    };
    lastIrrigationAt: string | null;
    loggedAt: string;
}

export class IrrigationRecommendationError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

function round(value: number) {
    return Math.round(value * 10) / 10;
}

type RecommendationCacheEntry = {
    expiresAt: number;
    value: IrrigationRecommendationResult;
};

const RECOMMENDATION_CACHE_TTL_MS = 5 * 60 * 1000;
const recommendationCache = new Map<string, RecommendationCacheEntry>();

function getRecommendationCacheKey(userId: string, fieldId: string) {
    return `${userId}:${fieldId}`;
}

async function getCachedRecommendation(
    userId: string,
    fieldId: string,
    loader: () => Promise<IrrigationRecommendationResult>
) {
    const cacheKey = getRecommendationCacheKey(userId, fieldId);
    const cached = recommendationCache.get(cacheKey);

    if (cached && cached.expiresAt > Date.now()) {
        return cached.value;
    }

    const recommendation = await loader();
    recommendationCache.set(cacheKey, {
        value: recommendation,
        expiresAt: Date.now() + RECOMMENDATION_CACHE_TTL_MS,
    });

    return recommendation;
}

async function buildIrrigationRecommendation(
    userId: string,
    fieldId: string
): Promise<IrrigationRecommendationResult> {
    const field = await prisma.field.findFirst({
        where: {
            id: fieldId,
            farm: {
                is: {
                    userId,
                },
            },
        },
        include: {
            farm: true,
            crops: {
                where: { status: 'growing' },
                orderBy: { createdAt: 'desc' },
                take: 1,
            },
            irrigationLogs: {
                orderBy: { createdAt: 'desc' },
                take: 10,
                select: {
                    createdAt: true,
                    executedAt: true,
                    waterAmount: true,
                },
            },
        },
    });

    if (!field) {
        throw new IrrigationRecommendationError('Field not found', 404);
    }

    const cropType = field.crops[0]?.name || field.cropType;
    if (!cropType) {
        throw new IrrigationRecommendationError('Crop type is required for irrigation recommendations', 400);
    }

    const lastExecutedLog = field.irrigationLogs.find(log => log.executedAt);
    const mostRecentIrrigationLog = lastExecutedLog || field.irrigationLogs[0] || null;
    const lastIrrigationAt = mostRecentIrrigationLog?.executedAt || mostRecentIrrigationLog?.createdAt || null;
    const lastIrrigationAmountMm = mostRecentIrrigationLog?.waterAmount || null;

    const [weather, forecast] = await Promise.all([
        fetchWeatherData(field.farm.latitude, field.farm.longitude),
        fetchForecastData(field.farm.latitude, field.farm.longitude),
    ]);

    if (!weather || !forecast) {
        throw new IrrigationRecommendationError('Real weather data is unavailable for this farm', 503);
    }

    const nextTwelveHours = forecast.hourly.slice(0, 4);
    const forecastRainProbability = nextTwelveHours.length > 0
        ? Math.max(...nextTwelveHours.map(hour => hour.rainProbability))
        : 0;

    const moistureEstimate = estimateSoilMoisture({
        soilType: field.farm.soilType,
        cropType,
        temperature: weather.temperature,
        humidity: weather.humidity,
        recentRainfallMm: weather.rainfall,
        lastIrrigationAt,
        lastIrrigationAmountMm,
    });
    const moistureReasons = explainSoilMoistureEstimate({
        soilType: field.farm.soilType,
        cropType,
        temperature: weather.temperature,
        humidity: weather.humidity,
        recentRainfallMm: weather.rainfall,
        lastIrrigationAt,
        lastIrrigationAmountMm,
    }, moistureEstimate);

    const recommendation = createIrrigationRecommendation({
        soilMoisture: moistureEstimate.soilMoisture,
        humidity: weather.humidity,
        rainProbability: round(forecastRainProbability),
        rainfall: weather.rainfall,
        hasLastIrrigation: Boolean(lastIrrigationAt),
        hasCropProfile: Boolean(field.crops[0]?.name),
    });

    const reasons = [
        ...recommendation.reasons,
        ...moistureReasons,
    ];

    return {
        decision: recommendation.decision,
        soilMoisture: moistureEstimate.soilMoisture,
        confidence: recommendation.confidence,
        reasons,
        field: {
            id: field.id,
            name: field.name,
            soilType: field.farm.soilType,
            cropType,
        },
        weather: {
            temperature: round(weather.temperature),
            humidity: round(weather.humidity),
            rainfall: round(weather.rainfall),
            rainProbability: round(forecastRainProbability),
        },
        lastIrrigationAt: lastIrrigationAt?.toISOString() || null,
        loggedAt: new Date().toISOString(),
    };
}

export async function getIrrigationRecommendation(
    userId: string,
    fieldId: string
): Promise<IrrigationRecommendationResult> {
    return getCachedRecommendation(userId, fieldId, () =>
        buildIrrigationRecommendation(userId, fieldId)
    );
}

export async function saveIrrigationRecommendation(
    userId: string,
    fieldId: string
): Promise<IrrigationRecommendationResult> {
    const recommendation = await getCachedRecommendation(userId, fieldId, () =>
        buildIrrigationRecommendation(userId, fieldId)
    );

    const log = await prisma.irrigationLog.create({
        data: {
            fieldId: recommendation.field.id,
            decision: recommendation.decision,
            confidence: recommendation.confidence,
            reason: recommendation.reasons.join(' | '),
            soilMoisture: recommendation.soilMoisture,
            temperature: recommendation.weather.temperature,
            humidity: recommendation.weather.humidity,
            rainProbability: recommendation.weather.rainProbability,
        },
    });

    return {
        ...recommendation,
        loggedAt: log.createdAt.toISOString(),
    };
}
