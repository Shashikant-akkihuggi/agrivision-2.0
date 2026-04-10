#!/usr/bin/env node

/**
 * Smart Agro Platform - Setup Verification Script
 * Run this after installation to verify everything is configured correctly.
 */

const fs = require('fs');

console.log('Smart Agro Platform - Setup Verification\n');

let errors = 0;
let warnings = 0;

// Check Node version
console.log('Checking Node.js version...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1), 10);
if (majorVersion < 18) {
    console.error('ERROR: Node.js 18+ required. Current:', nodeVersion);
    errors++;
} else {
    console.log('OK: Node.js version:', nodeVersion);
}

// Check package.json
console.log('\nChecking package.json...');
if (fs.existsSync('package.json')) {
    console.log('OK: package.json found');
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

    const requiredDeps = [
        'next', 'react', 'react-dom', '@prisma/client',
        'zustand', 'axios', 'bcryptjs', 'jsonwebtoken'
    ];

    requiredDeps.forEach(dep => {
        if (pkg.dependencies[dep]) {
            console.log(`  OK: ${dep}`);
        } else {
            console.error(`  ERROR: Missing dependency: ${dep}`);
            errors++;
        }
    });
} else {
    console.error('ERROR: package.json not found');
    errors++;
}

// Check .env file
console.log('\nChecking environment configuration...');
if (fs.existsSync('.env')) {
    console.log('OK: .env file found');
    const env = fs.readFileSync('.env', 'utf8');

    const requiredVars = ['DATABASE_URL', 'JWT_SECRET'];
    requiredVars.forEach(varName => {
        if (env.includes(varName)) {
            console.log(`  OK: ${varName} configured`);
        } else {
            console.error(`  ERROR: Missing: ${varName}`);
            errors++;
        }
    });

    const optionalVars = ['OPENWEATHER_API_KEY', 'AGMARKNET_API_KEY'];
    optionalVars.forEach(varName => {
        if (env.includes(varName)) {
            console.log(`  OK: ${varName} configured`);
        } else {
            console.warn(`  WARNING: Optional ${varName} not configured (will use mock data)`);
            warnings++;
        }
    });

    const databaseUrlMatch = env.match(/DATABASE_URL="([^"]+)"/);
    const databaseUrl = databaseUrlMatch?.[1] || '';

    if (databaseUrl.includes('.pooler.supabase.com')) {
        console.warn('  WARNING: DATABASE_URL uses a Supabase pooler host');
        console.warn('           Prisma may fail locally unless the pooler username/password are exact.');
        console.warn('           If you see "Tenant or user not found", compare .env with SUPABASE_SETUP.md.');
        warnings++;
    }
} else {
    console.error('ERROR: .env file not found. Copy .env.example to .env');
    errors++;
}

// Check Prisma schema
console.log('\nChecking database schema...');
if (fs.existsSync('prisma/schema.prisma')) {
    console.log('OK: Prisma schema found');
} else {
    console.error('ERROR: Prisma schema not found');
    errors++;
}

// Check node_modules
console.log('\nChecking dependencies installation...');
if (fs.existsSync('node_modules')) {
    console.log('OK: node_modules found');
} else {
    console.error('ERROR: node_modules not found. Run: npm install');
    errors++;
}

// Check key directories
console.log('\nChecking project structure...');
const requiredDirs = [
    'app',
    'app/api',
    'app/auth',
    'app/dashboard',
    'components',
    'lib',
    'prisma',
    'store'
];

requiredDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        console.log(`  OK: ${dir}/`);
    } else {
        console.error(`  ERROR: Missing directory: ${dir}/`);
        errors++;
    }
});

// Check key files
console.log('\nChecking key files...');
const requiredFiles = [
    'app/layout.tsx',
    'app/page.tsx',
    'components/Sidebar.tsx',
    'lib/auth.ts',
    'lib/irrigation-engine.ts',
    'lib/weather-service.ts',
    'lib/prisma.ts',
    'README.md',
    'QUICKSTART.md'
];

requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`  OK: ${file}`);
    } else {
        console.error(`  ERROR: Missing file: ${file}`);
        errors++;
    }
});

// Check API routes
console.log('\nChecking API routes...');
const apiRoutes = [
    'app/api/auth/login/route.ts',
    'app/api/auth/register/route.ts',
    'app/api/farms/route.ts',
    'app/api/irrigation/decision/route.ts',
    'app/api/weather/route.ts',
    'app/api/marketplace/prices/route.ts',
    'app/api/loans/eligibility/route.ts'
];

apiRoutes.forEach(route => {
    if (fs.existsSync(route)) {
        console.log(`  OK: ${route.replace('app/api/', '').replace('/route.ts', '')}`);
    } else {
        console.error(`  ERROR: Missing route: ${route}`);
        errors++;
    }
});

// Check dashboard pages
console.log('\nChecking dashboard pages...');
const dashboardPages = [
    'app/dashboard/page.tsx',
    'app/dashboard/irrigation/page.tsx',
    'app/dashboard/weather/page.tsx',
    'app/dashboard/marketplace/page.tsx',
    'app/dashboard/finance/page.tsx',
    'app/dashboard/analytics/page.tsx',
    'app/dashboard/farm/page.tsx',
    'app/dashboard/alerts/page.tsx'
];

dashboardPages.forEach(page => {
    if (fs.existsSync(page)) {
        console.log(`  OK: ${page.replace('app/dashboard/', '').replace('/page.tsx', '') || 'overview'}`);
    } else {
        console.error(`  ERROR: Missing page: ${page}`);
        errors++;
    }
});

// Summary
console.log('\n' + '='.repeat(50));
console.log('VERIFICATION SUMMARY');
console.log('='.repeat(50));

if (errors === 0 && warnings === 0) {
    console.log('OK: Everything is configured correctly.');
    console.log('\nNext steps:');
    console.log('   1. Run: npm run db:push');
    console.log('   2. Run: npm run dev');
    console.log('   3. Open: http://localhost:3000');
    console.log('   4. Optional: Seed demo data with POST http://localhost:3000/api/seed');
} else {
    if (errors > 0) {
        console.error(`\nERROR: Found ${errors} issue(s) that need to be fixed.`);
    }
    if (warnings > 0) {
        console.warn(`\nWARNING: Found ${warnings} optional configuration warning(s).`);
    }

    console.log('\nCheck the following guides:');
    console.log('   - README.md for full documentation');
    console.log('   - QUICKSTART.md for setup instructions');

    if (errors > 0) {
        process.exit(1);
    }
}

console.log('\nHappy Farming!\n');
