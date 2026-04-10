import axios from 'axios';

type CacheEntry<T> = {
    expiresAt: number;
    value: T;
};

export interface WeatherData {
    temperature: number;
    feelsLike: number;
    humidity: number;
    rainfall: number;
    windSpeed: number;
    pressure: number;
    condition: string;
    rainProbability: number;
}

export interface ForecastData {
    hourly: Array<{
        time: string;
        temperature: number;
        humidity: number;
        rainProbability: number;
        rainfall: number;
        condition: string;
    }>;
    daily: Array<{
        date: string;
        tempMin: number;
        tempMax: number;
        humidity: number;
        rainProbability: number;
        rainfall: number;
        condition: string;
    }>;
}

const WEATHER_CACHE_TTL_MS = 10 * 60 * 1000;
const weatherCache = new Map<string, CacheEntry<any>>();

function getCacheKey(prefix: string, lat: number, lon: number) {
    return `${prefix}:${lat.toFixed(4)}:${lon.toFixed(4)}`;
}

async function getCachedValue<T>(key: string, loader: () => Promise<T>): Promise<T> {
    const cached = weatherCache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
        return cached.value as T;
    }

    const value = await loader();
    weatherCache.set(key, {
        value,
        expiresAt: Date.now() + WEATHER_CACHE_TTL_MS,
    });

    return value;
}

function logWeatherError(scope: 'Weather API' | 'Forecast API', error: unknown) {
    if (axios.isAxiosError(error)) {
        console.error(`${scope} error:`, {
            message: error.message,
            status: error.response?.status ?? null,
            code: error.code ?? null,
        });
        return;
    }

    if (error instanceof Error) {
        console.error(`${scope} error:`, { message: error.message });
        return;
    }

    console.error(`${scope} error:`, { message: 'Unknown weather service failure' });
}

export async function fetchWeatherData(lat: number, lon: number): Promise<WeatherData | null> {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
        console.warn('OPENWEATHER_API_KEY not configured. Weather data unavailable.');
        return null;
    }

    try {
        const [weatherData, forecastData] = await Promise.all([
            getCachedValue(getCacheKey('current', lat, lon), async () => {
                const response = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
                );

                return response.data;
            }),
            getCachedValue(getCacheKey('forecast', lat, lon), async () => {
                const response = await axios.get(
                    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
                );

                return response.data;
            }),
        ]);

        return {
            temperature: weatherData.main.temp,
            feelsLike: weatherData.main.feels_like,
            humidity: weatherData.main.humidity,
            rainfall: weatherData.rain?.['1h'] || 0,
            windSpeed: weatherData.wind.speed,
            pressure: weatherData.main.pressure,
            condition: weatherData.weather[0].main,
            rainProbability: (forecastData.list?.[0]?.pop || 0) * 100,
        };
    } catch (error) {
        logWeatherError('Weather API', error);
        return null;
    }
}

export async function fetchForecastData(lat: number, lon: number): Promise<ForecastData | null> {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
        console.warn('OPENWEATHER_API_KEY not configured. Forecast data unavailable.');
        return null;
    }

    try {
        const response = await getCachedValue(getCacheKey('forecast', lat, lon), async () => {
            const forecastResponse = await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
            );

            return forecastResponse.data;
        });

        const hourly = response.list.slice(0, 8).map((item: any) => ({
            time: new Date(item.dt * 1000).toISOString(),
            temperature: item.main.temp,
            humidity: item.main.humidity,
            rainProbability: (item.pop || 0) * 100,
            rainfall: (item.rain?.['3h'] || 0) / 3,
            condition: item.weather[0].main,
        }));

        const dailyMap = new Map<string, any[]>();
        response.list.forEach((item: any) => {
            const date = new Date(item.dt * 1000).toISOString().split('T')[0];
            if (!dailyMap.has(date)) {
                dailyMap.set(date, []);
            }

            dailyMap.get(date)?.push(item);
        });

        const daily = Array.from(dailyMap.entries()).slice(0, 7).map(([date, items]) => {
            const temps = items.map(item => item.main.temp);
            const avgHumidity = items.reduce((sum, item) => sum + item.main.humidity, 0) / items.length;
            const maxRainProb = Math.max(...items.map(item => (item.pop || 0) * 100));
            const totalRainfall = items.reduce((sum, item) => sum + (item.rain?.['3h'] || 0), 0);

            return {
                date,
                tempMin: Math.min(...temps),
                tempMax: Math.max(...temps),
                humidity: Math.round(avgHumidity),
                rainProbability: Math.round(maxRainProb),
                rainfall: totalRainfall,
                condition: items[0].weather[0].main,
            };
        });

        return { hourly, daily };
    } catch (error) {
        logWeatherError('Forecast API', error);
        return null;
    }
}
