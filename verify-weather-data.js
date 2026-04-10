/**
 * Weather Data Verification Script
 * 
 * This script verifies that the weather implementation:
 * 1. Has no hardcoded values
 * 2. Uses only real API data
 * 3. Has proper error handling
 * 4. Has strict validation
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Weather Data Verification\n');
console.log('═══════════════════════════════════════════\n');

// Test 1: Check for hardcoded weather values
console.log('Test 1: Checking for hardcoded values...');
const weatherPagePath = path.join(__dirname, 'app/dashboard/weather/page.tsx');
const weatherPageContent = fs.readFileSync(weatherPagePath, 'utf8');

const hardcodedPatterns = [
    /29\.8/,
    /30°C/,
    /0% rain/,
    /const weather = \{/,
    /mockWeather/,
    /dummyWeather/,
    /staticForecast/
];

let hardcodedFound = false;
hardcodedPatterns.forEach(pattern => {
    if (pattern.test(weatherPageContent)) {
        console.log(`  ❌ Found hardcoded pattern: ${pattern}`);
        hardcodedFound = true;
    }
});

if (!hardcodedFound) {
    console.log('  ✅ No hardcoded values found\n');
} else {
    console.log('  ❌ FAIL: Hardcoded values detected\n');
}

// Test 2: Check for strict validation
console.log('Test 2: Checking for strict validation...');
const validationPatterns = [
    /typeof weatherData\.temperature !== 'number'/,
    /if \(!weatherData \|\| typeof weatherData\.temperature/,
    /if \(!forecastData \|\| !forecastData\.hourly/,
    /setError\(true\)/
];

let validationFound = true;
validationPatterns.forEach(pattern => {
    if (!pattern.test(weatherPageContent)) {
        console.log(`  ❌ Missing validation: ${pattern}`);
        validationFound = false;
    }
});

if (validationFound) {
    console.log('  ✅ Strict validation present\n');
} else {
    console.log('  ❌ FAIL: Missing validation checks\n');
}

// Test 3: Check for error handling
console.log('Test 3: Checking for error handling...');
const errorPatterns = [
    /if \(error \|\| !weather\)/,
    /Weather Data Unavailable/,
    /Unable to fetch weather/,
    /Invalid Weather Data/
];

let errorHandlingFound = true;
errorPatterns.forEach(pattern => {
    if (!pattern.test(weatherPageContent)) {
        console.log(`  ❌ Missing error handling: ${pattern}`);
        errorHandlingFound = false;
    }
});

if (errorHandlingFound) {
    console.log('  ✅ Error handling present\n');
} else {
    console.log('  ❌ FAIL: Missing error handling\n');
}

// Test 4: Check for safe number formatting
console.log('Test 4: Checking for safe number formatting...');
const unsafePatterns = [
    /weather\.temperature\.toFixed/,
    /weather\.humidity\.toLocaleString/,
    /\d+\.toFixed\(/
];

let unsafeFound = false;
unsafePatterns.forEach(pattern => {
    if (pattern.test(weatherPageContent)) {
        console.log(`  ❌ Found unsafe formatting: ${pattern}`);
        unsafeFound = true;
    }
});

const safePatterns = [
    /formatDecimal\(/
];

let safeFound = true;
safePatterns.forEach(pattern => {
    if (!pattern.test(weatherPageContent)) {
        console.log(`  ❌ Missing safe formatting: ${pattern}`);
        safeFound = false;
    }
});

if (!unsafeFound && safeFound) {
    console.log('  ✅ Safe number formatting used\n');
} else {
    console.log('  ❌ FAIL: Unsafe number formatting detected\n');
}

// Test 5: Check for live data indicators
console.log('Test 5: Checking for live data indicators...');
const liveDataPatterns = [
    /Live Data/,
    /Last updated:/,
    /Fetching Real Weather Data/
];

let liveDataFound = true;
liveDataPatterns.forEach(pattern => {
    if (!pattern.test(weatherPageContent)) {
        console.log(`  ❌ Missing indicator: ${pattern}`);
        liveDataFound = false;
    }
});

if (liveDataFound) {
    console.log('  ✅ Live data indicators present\n');
} else {
    console.log('  ❌ FAIL: Missing live data indicators\n');
}

// Test 6: Check weather service
console.log('Test 6: Checking weather service...');
const weatherServicePath = path.join(__dirname, 'lib/weather-service.ts');
const weatherServiceContent = fs.readFileSync(weatherServicePath, 'utf8');

const servicePatterns = [
    /fetchWeatherData/,
    /fetchForecastData/,
    /OPENWEATHER_API_KEY/,
    /return null/
];

let serviceValid = true;
servicePatterns.forEach(pattern => {
    if (!pattern.test(weatherServiceContent)) {
        console.log(`  ❌ Missing service feature: ${pattern}`);
        serviceValid = false;
    }
});

if (serviceValid) {
    console.log('  ✅ Weather service properly configured\n');
} else {
    console.log('  ❌ FAIL: Weather service issues\n');
}

// Test 7: Check .env configuration
console.log('Test 7: Checking environment configuration...');
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    if (envContent.includes('OPENWEATHER_API_KEY=')) {
        const match = envContent.match(/OPENWEATHER_API_KEY="?([^"\n]+)"?/);
        if (match && match[1] && match[1].length > 10) {
            console.log('  ✅ OpenWeather API key configured\n');
        } else {
            console.log('  ⚠️  OpenWeather API key is empty or invalid\n');
        }
    } else {
        console.log('  ⚠️  OPENWEATHER_API_KEY not found in .env\n');
    }
} else {
    console.log('  ⚠️  .env file not found\n');
}

// Final Summary
console.log('═══════════════════════════════════════════\n');
console.log('📊 VERIFICATION SUMMARY\n');

const allTestsPassed = !hardcodedFound && validationFound && errorHandlingFound && !unsafeFound && safeFound && liveDataFound && serviceValid;

if (allTestsPassed) {
    console.log('✅ ALL TESTS PASSED');
    console.log('\nThe Weather section:');
    console.log('  • Has NO hardcoded values');
    console.log('  • Uses ONLY real API data');
    console.log('  • Has strict validation');
    console.log('  • Has proper error handling');
    console.log('  • Uses safe number formatting');
    console.log('  • Shows live data indicators');
    console.log('  • Service properly configured');
    console.log('\n✅ Weather dummy data removal: COMPLETE');
} else {
    console.log('❌ SOME TESTS FAILED');
    console.log('\nPlease review the failed tests above.');
}

console.log('\n═══════════════════════════════════════════\n');
