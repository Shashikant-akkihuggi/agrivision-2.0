// Equipment Suggestion Tool
export interface EquipmentSuggestion {
    category: 'Manual' | 'Semi-Mechanized' | 'Fully Mechanized';
    essential: string[];
    recommended: string[];
    optional: string[];
    estimatedCost: string;
    tips: string[];
}

export function suggestEquipment(landSize: number): EquipmentSuggestion {
    if (landSize < 2) {
        return {
            category: 'Manual',
            essential: [
                'Spade and shovel',
                'Hoe and rake',
                'Sickle for harvesting',
                'Watering cans',
                'Hand sprayer'
            ],
            recommended: [
                'Wheelbarrow',
                'Pruning shears',
                'Measuring tape',
                'Soil testing kit'
            ],
            optional: [
                'Small tiller (power tiller)',
                'Knapsack sprayer',
                'Seed drill (manual)'
            ],
            estimatedCost: '₹15,000 - ₹30,000',
            tips: [
                'Start with essential tools',
                'Buy quality tools for durability',
                'Maintain tools regularly',
                'Consider renting expensive equipment'
            ]
        };
    } else if (landSize < 5) {
        return {
            category: 'Semi-Mechanized',
            essential: [
                'Power tiller (8-10 HP)',
                'Pump set for irrigation',
                'Knapsack sprayer',
                'Seed drill',
                'Basic hand tools'
            ],
            recommended: [
                'Rotavator attachment',
                'Trailer for power tiller',
                'Thresher (small)',
                'Chaff cutter'
            ],
            optional: [
                'Mini tractor (20-25 HP)',
                'Drip irrigation system',
                'Solar pump'
            ],
            estimatedCost: '₹1,50,000 - ₹3,00,000',
            tips: [
                'Power tiller is most versatile',
                'Consider shared ownership',
                'Invest in good irrigation',
                'Maintain equipment regularly'
            ]
        };
    } else {
        return {
            category: 'Fully Mechanized',
            essential: [
                'Tractor (35-50 HP)',
                'Cultivator',
                'Seed drill/planter',
                'Sprayer (tractor-mounted)',
                'Irrigation pump'
            ],
            recommended: [
                'Rotavator',
                'Harvester/reaper',
                'Thresher',
                'Trailer',
                'Leveler'
            ],
            optional: [
                'Combine harvester',
                'Drip/sprinkler system',
                'GPS-guided equipment',
                'Drone for spraying'
            ],
            estimatedCost: '₹5,00,000 - ₹15,00,000',
            tips: [
                'Tractor is essential investment',
                'Buy attachments as needed',
                'Consider custom hiring services',
                'Regular servicing is crucial',
                'Explore government subsidies'
            ]
        };
    }
}
