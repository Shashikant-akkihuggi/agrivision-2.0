/**
 * Weather API Test Script
 * 
 * This script tests the OpenWeather API integration
 * Run with: node test-weather-api.js
 */

const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.OPENWEATHER_API_KEY;

// Test coordinates (New Delhi, India)
const TEST_LAT = 28.6139;
const TEST_LON = 77.2090;

async function testCurrentWeather() {
    console.log('\n🌤️  Testing Current Weather API...\n');

    if (!API_KEY) {
        console.error('❌ OPENWEATHER_API_KEY not found in .env file');
        console.log('   Get a free API key from: https://openweathermap.org/api');
        return false;
    }

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${TEST_LAT}&lon=${TEST_LON}&appid=${API_KEY}&units=metric`;
        console.log('📡 Calling:', url.replace(API_KEY, 'YOUR_KEY'));

        const response = await axios.get(url);
        const data = response.data;

        console.log('\n✅ Current Weather Response:');
        console.log('   Location:', data.name);
        console.log('   Temperature:', data.main.temp, '°C');
        console.log('   Feels Like:', data.main.feels_like, '°C');
        console.log('   Humidity:', data.main.humidity, '%');
        console.log('   Pressure:', data.main.pressure, 'hPa');
        console.log('   Wind Speed:', data.wind.speed, 'm/s');
        console.log('   Condition:', data.weather[0].main);
        console.log('   Description:', data.weather[0].description);

        if (data.rain) {
            console.log('   Rain (1h):', data.rain['1h'], 'mm');
        } else {
            console.log('   Rain (1h): 0 mm (no rain)');
        }

        // Verify all required fields exist
        const requiredFields = [
            'main.temp',
            'main.feels_like',
            'main.humidity',
            'main.pressure',
            'wind.speed',
            'weather[0].main'
        ];

        let allFieldsPresent = true;
        requiredFields.forEach(field => {
            const value = field.split('.').reduce((obj, key) => {
                if (key.includes('[')) {
                    const [arrayKey, index] = key.split('[');
                    return obj[arrayKey][parseInt(index.replace(']', ''))];
                }
                return obj[key];
            }, data);

            if (value === undefined || value === null) {
                console.error(`   ❌ Missing field: ${field}`);
                allFieldsPresent = false;
            }
        });

        if (allFieldsPresent) {
            console.log('\n✅ All required fields present');
        }

        return true;
    } catch (error) {
        console.error('\n❌ Current Weather API Error:');
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Message:', error.response.data.message);
        } else {
            console.error('   Error:', error.message);
        }
        return false;
    }
}

async function testForecast() {
    console.log('\n🌦️  Testing Forecast API...\n');

    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${TEST_LAT}&lon=${TEST_LON}&appid=${API_KEY}&units=metric`;
        console.log('📡 Calling:', url.replace(API_KEY, 'YOUR_KEY'));

        const response = await axios.get(url);
        const data = response.data;

        console.log('\n✅ Forecast Response:');
        console.log('   Total forecasts:', data.list.length);
        console.log('   City:', data.city.name);

        // Show first forecast item
        const first = data.list[0];
        console.log('\n   First Forecast:');
        console.log('   Time:', first.dt_txt);
        console.log('   Temperature:', first.main.temp, '°C');
        console.log('   Humidity:', first.main.humidity, '%');
        console.log('   Rain Probability:', (first.pop * 100).toFixed(0), '%');
        console.log('   Condition:', first.weather[0].main);

        if (first.rain) {
            console.log('   Rain (3h):', first.rain['3h'], 'mm');
        } else {
            console.log('   Rain (3h): 0 mm (no rain)');
        }

        // Count unique days
        const uniqueDays = new Set(data.list.map(item => item.dt_txt.split(' ')[0]));
        console.log('\n   Unique days in forecast:', uniqueDays.size);

        // Verify hourly data (should have at least 8 items for 24 hours)
        if (data.list.length >= 8) {
            console.log('   ✅ Sufficient data for hourly forecast (8+ items)');
        } else {
            console.log('   ⚠️  Limited data for hourly forecast');
        }

        // Verify daily data (should have at least 5 days)
        if (uniqueDays.size >= 5) {
            console.log('   ✅ Sufficient data for 7-day forecast (5+ days)');
        } else {
            console.log('   ⚠️  Limited data for 7-day forecast');
        }

        return true;
    } catch (error) {
        console.error('\n❌ Forecast API Error:');
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Message:', error.response.data.message);
        } else {
            console.error('   Error:', error.message);
        }
        return false;
    }
}

async function runTests() {
    console.log('═══════════════════════════════════════════');
    console.log('   OpenWeather API Integration Test');
    console.log('═══════════════════════════════════════════');

    const currentWeatherOk = await testCurrentWeather();
    const forecastOk = await testForecast();

    console.log('\n═══════════════════════════════════════════');
    console.log('   Test Results');
    console.log('═══════════════════════════════════════════');
    console.log('   Current Weather:', currentWeatherOk ? '✅ PASS' : '❌ FAIL');
    console.log('   Forecast:', forecastOk ? '✅ PASS' : '❌ FAIL');
    console.log('═══════════════════════════════════════════\n');

    if (currentWeatherOk && forecastOk) {
        console.log('🎉 All tests passed! Weather API is working correctly.\n');
        console.log('Next steps:');
        console.log('1. Start your Next.js app: npm run dev');
        console.log('2. Navigate to the Weather page');
        console.log('3. Check browser console for API logs');
        console.log('4. Verify real data is displayed\n');
    } else {
        console.log('⚠️  Some tests failed. Please check:');
        console.log('1. OPENWEATHER_API_KEY is correct in .env');
        console.log('2. API key is activated (may take a few minutes)');
        console.log('3. Internet connection is working');
        console.log('4. No firewall blocking API calls\n');
    }
}

// Run tests
runTests().catch(console.error);
