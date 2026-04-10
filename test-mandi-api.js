/**
 * AGMARKNET Mandi Price API Test Script
 * 
 * This script tests the AGMARKNET API integration directly
 * to verify that real market data is being fetched correctly.
 */

require('dotenv').config();
const axios = require('axios');

const API_KEY = process.env.AGMARKNET_API_KEY;

console.log('\n🛒 ═══════════════════════════════════════════');
console.log('🛒 AGMARKNET API TEST');
console.log('🛒 ═══════════════════════════════════════════\n');

if (!API_KEY) {
    console.error('❌ AGMARKNET_API_KEY not found in .env file');
    console.log('🛒 ═══════════════════════════════════════════\n');
    process.exit(1);
}

console.log('✅ API Key found:', `${API_KEY.substring(0, 20)}...`);
console.log('🔄 Testing API connection...\n');

const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${API_KEY}&format=json&filters[state]=Karnataka&limit=20`;

axios.get(url, {
    timeout: 10000,
    headers: {
        'Accept': 'application/json',
    }
})
    .then(response => {
        console.log('✅ API Response Status:', response.status);
        console.log('✅ Records Received:', response.data.records?.length || 0);

        if (response.data.records && response.data.records.length > 0) {
            console.log('\n📊 Sample Data (First 5 Records):\n');

            response.data.records.slice(0, 5).forEach((record, idx) => {
                console.log(`${idx + 1}. ${record.commodity || 'Unknown'}`);
                console.log(`   Market: ${record.market || 'Unknown'}`);
                console.log(`   District: ${record.district || 'Unknown'}`);
                console.log(`   Modal Price: ₹${record.modal_price || 'N/A'}`);
                console.log(`   Min Price: ₹${record.min_price || 'N/A'}`);
                console.log(`   Max Price: ₹${record.max_price || 'N/A'}`);
                console.log(`   Date: ${record.arrival_date || 'N/A'}`);
                console.log('');
            });

            // Test data cleaning
            const cleaned = response.data.records
                .filter(item => item.commodity && item.modal_price && item.market)
                .filter(item => {
                    const price = Number(item.modal_price);
                    return !isNaN(price) && price > 0;
                })
                .map(item => ({
                    commodity: item.commodity,
                    market: item.market,
                    modalPrice: Number(item.modal_price),
                }));

            console.log('📊 Data Cleaning Results:');
            console.log(`   Total Records: ${response.data.records.length}`);
            console.log(`   Valid Records: ${cleaned.length}`);
            console.log(`   Filtered Out: ${response.data.records.length - cleaned.length}`);

            if (cleaned.length > 0) {
                // Sort by price
                cleaned.sort((a, b) => b.modalPrice - a.modalPrice);

                console.log('\n💰 Top 5 Highest Prices:');
                cleaned.slice(0, 5).forEach((item, idx) => {
                    console.log(`   ${idx + 1}. ${item.commodity} - ₹${item.modalPrice} (${item.market})`);
                });
            }

            console.log('\n✅ SUCCESS: AGMARKNET API is working correctly!');
            console.log('✅ Real market data is being fetched and cleaned properly.');
        } else {
            console.log('⚠️  No records found in API response');
            console.log('⚠️  This might be a temporary issue or the API might be down');
        }

        console.log('\n🛒 ═══════════════════════════════════════════\n');
    })
    .catch(error => {
        console.error('\n❌ API Request Failed\n');

        if (error.response) {
            console.error('Response Status:', error.response.status);
            console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            console.error('No response received from API');
            console.error('Error:', error.message);
        } else {
            console.error('Error:', error.message);
        }

        console.log('\n🛒 ═══════════════════════════════════════════\n');
        process.exit(1);
    });
