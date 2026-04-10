// Crop Recommendation Engine - Rule-based logic
export interface CropRecommendation {
    name: string;
    suitability: number; // 0-100
    expectedYield: string;
    waterRequirement: 'Low' | 'Medium' | 'High';
    profitPotential: 'Low' | 'Medium' | 'High';
    growthDuration: string;
}

export function recommendCrops(
    landSize: number,
    season: 'summer' | 'monsoon' | 'winter' | 'spring'
): CropRecommendation[] {
    const recommendations: CropRecommendation[] = [];

    // Summer crops
    if (season === 'summer') {
        recommendations.push(
            {
                name: 'Watermelon',
                suitability: 95,
                expectedYield: `${landSize * 15} tons`,
                waterRequirement: 'High',
                profitPotential: 'High',
                growthDuration: '90-100 days'
            },
            {
                name: 'Cucumber',
                suitability: 90,
                expectedYield: `${landSize * 12} tons`,
                waterRequirement: 'Medium',
                profitPotential: 'Medium',
                growthDuration: '50-70 days'
            },
            {
                name: 'Tomato',
                suitability: 85,
                expectedYield: `${landSize * 20} tons`,
                waterRequirement: 'Medium',
                profitPotential: 'High',
                growthDuration: '60-80 days'
            }
        );
    }

    // Monsoon crops
    if (season === 'monsoon') {
        recommendations.push(
            {
                name: 'Rice',
                suitability: 98,
                expectedYield: `${landSize * 3} tons`,
                waterRequirement: 'High',
                profitPotential: 'Medium',
                growthDuration: '120-150 days'
            },
            {
                name: 'Maize',
                suitability: 92,
                expectedYield: `${landSize * 4} tons`,
                waterRequirement: 'Medium',
                profitPotential: 'Medium',
                growthDuration: '90-120 days'
            },
            {
                name: 'Soybean',
                suitability: 88,
                expectedYield: `${landSize * 2.5} tons`,
                waterRequirement: 'Medium',
                profitPotential: 'High',
                growthDuration: '90-120 days'
            }
        );
    }

    // Winter crops
    if (season === 'winter') {
        recommendations.push(
            {
                name: 'Wheat',
                suitability: 96,
                expectedYield: `${landSize * 3.5} tons`,
                waterRequirement: 'Medium',
                profitPotential: 'Medium',
                growthDuration: '120-150 days'
            },
            {
                name: 'Potato',
                suitability: 94,
                expectedYield: `${landSize * 25} tons`,
                waterRequirement: 'Medium',
                profitPotential: 'High',
                growthDuration: '90-120 days'
            },
            {
                name: 'Mustard',
                suitability: 90,
                expectedYield: `${landSize * 1.5} tons`,
                waterRequirement: 'Low',
                profitPotential: 'Medium',
                growthDuration: '90-110 days'
            }
        );
    }

    // Spring crops
    if (season === 'spring') {
        recommendations.push(
            {
                name: 'Millet',
                suitability: 93,
                expectedYield: `${landSize * 2} tons`,
                waterRequirement: 'Low',
                profitPotential: 'Medium',
                growthDuration: '70-90 days'
            },
            {
                name: 'Sunflower',
                suitability: 89,
                expectedYield: `${landSize * 1.8} tons`,
                waterRequirement: 'Low',
                profitPotential: 'High',
                growthDuration: '90-120 days'
            },
            {
                name: 'Cotton',
                suitability: 87,
                expectedYield: `${landSize * 2.5} tons`,
                waterRequirement: 'Medium',
                profitPotential: 'High',
                growthDuration: '150-180 days'
            }
        );
    }

    // Adjust for land size
    if (landSize < 2) {
        // Small farms - prioritize high-value crops
        return recommendations.filter(r => r.profitPotential === 'High').slice(0, 3);
    } else if (landSize > 10) {
        // Large farms - can handle all crops
        return recommendations;
    }

    return recommendations.slice(0, 3);
}
