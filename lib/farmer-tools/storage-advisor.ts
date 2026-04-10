// Storage Advisor - Crop storage recommendations
export interface StorageAdvice {
    method: string;
    shelfLife: string;
    temperature: string;
    humidity: string;
    tips: string[];
    commonIssues: string[];
}

export function getStorageAdvice(crop: string): StorageAdvice {
    const storage: Record<string, StorageAdvice> = {
        rice: {
            method: 'Dry storage in gunny bags or silos',
            shelfLife: '12-18 months',
            temperature: '15-20°C',
            humidity: 'Below 14% moisture',
            tips: [
                'Dry to 12-14% moisture before storage',
                'Use clean, dry storage containers',
                'Add neem leaves to prevent pests',
                'Store in cool, dry place'
            ],
            commonIssues: ['Weevils', 'Moisture damage', 'Fungal growth']
        },
        wheat: {
            method: 'Dry storage in bins or bags',
            shelfLife: '8-12 months',
            temperature: '10-15°C',
            humidity: 'Below 12% moisture',
            tips: [
                'Dry thoroughly before storage',
                'Use airtight containers',
                'Regular inspection for pests',
                'Avoid direct sunlight'
            ],
            commonIssues: ['Weevils', 'Moisture', 'Rodents']
        },
        tomato: {
            method: 'Cool storage or processing',
            shelfLife: '7-14 days fresh',
            temperature: '10-15°C',
            humidity: '85-90%',
            tips: [
                'Store at room temperature until ripe',
                'Refrigerate only when fully ripe',
                'Keep away from ethylene-producing fruits',
                'Process excess into puree or sauce'
            ],
            commonIssues: ['Rapid ripening', 'Bruising', 'Fungal rot']
        },
        potato: {
            method: 'Cool, dark storage',
            shelfLife: '3-6 months',
            temperature: '7-10°C',
            humidity: '85-90%',
            tips: [
                'Cure for 10-14 days before storage',
                'Store in dark place to prevent greening',
                'Good ventilation required',
                'Remove sprouted tubers regularly'
            ],
            commonIssues: ['Sprouting', 'Greening', 'Soft rot']
        },
        maize: {
            method: 'Dry storage in cobs or shelled',
            shelfLife: '6-12 months',
            temperature: '15-20°C',
            humidity: 'Below 13% moisture',
            tips: [
                'Dry to 12-13% moisture',
                'Shell and clean before storage',
                'Use hermetic bags for better protection',
                'Regular fumigation if needed'
            ],
            commonIssues: ['Weevils', 'Aflatoxin', 'Moisture']
        },
        cotton: {
            method: 'Dry storage in bales',
            shelfLife: '12-24 months',
            temperature: 'Room temperature',
            humidity: 'Below 8% moisture',
            tips: [
                'Dry thoroughly before baling',
                'Store in covered warehouse',
                'Protect from rain and moisture',
                'Stack bales properly for air circulation'
            ],
            commonIssues: ['Moisture damage', 'Discoloration', 'Pest damage']
        }
    };

    const defaultAdvice: StorageAdvice = {
        method: 'Dry, cool storage',
        shelfLife: '3-6 months',
        temperature: '15-20°C',
        humidity: 'Low humidity',
        tips: [
            'Dry produce thoroughly',
            'Use clean containers',
            'Regular inspection',
            'Protect from pests'
        ],
        commonIssues: ['Moisture', 'Pests', 'Spoilage']
    };

    return storage[crop.toLowerCase()] || defaultAdvice;
}
