// Pest Risk Checker - Rule-based pest identification
export interface PestRisk {
    riskLevel: 'Low' | 'Medium' | 'High';
    commonPests: string[];
    symptoms: string[];
    preventionMethods: string[];
    organicControl: string[];
}

export function checkPestRisk(
    crop: string,
    season: 'summer' | 'monsoon' | 'winter' | 'spring'
): PestRisk {
    const riskMatrix: Record<string, Record<string, PestRisk>> = {
        rice: {
            monsoon: {
                riskLevel: 'High',
                commonPests: ['Stem borer', 'Leaf folder', 'Brown plant hopper', 'Gall midge'],
                symptoms: [
                    'Dead hearts in young plants',
                    'White ears at maturity',
                    'Folded leaves with white streaks',
                    'Yellowing and drying of plants'
                ],
                preventionMethods: [
                    'Use resistant varieties',
                    'Maintain proper spacing',
                    'Remove alternate hosts',
                    'Avoid excess nitrogen'
                ],
                organicControl: [
                    'Neem oil spray (5ml/liter)',
                    'Release Trichogramma wasps',
                    'Light traps for moths',
                    'Pheromone traps'
                ]
            },
            summer: {
                riskLevel: 'Medium',
                commonPests: ['Stem borer', 'Leaf roller'],
                symptoms: ['Dead hearts', 'Rolled leaves'],
                preventionMethods: ['Clean cultivation', 'Proper water management'],
                organicControl: ['Neem spray', 'Biological control']
            },
            winter: {
                riskLevel: 'Low',
                commonPests: ['Aphids'],
                symptoms: ['Curled leaves', 'Sticky honeydew'],
                preventionMethods: ['Monitor regularly', 'Remove weeds'],
                organicControl: ['Soap water spray', 'Neem oil']
            },
            spring: {
                riskLevel: 'Medium',
                commonPests: ['Leaf folder', 'Aphids'],
                symptoms: ['Folded leaves', 'Stunted growth'],
                preventionMethods: ['Field sanitation', 'Balanced fertilization'],
                organicControl: ['Neem spray', 'Garlic extract']
            }
        },
        tomato: {
            summer: {
                riskLevel: 'High',
                commonPests: ['Fruit borer', 'Whitefly', 'Leaf miner', 'Aphids'],
                symptoms: [
                    'Holes in fruits',
                    'Yellowing leaves',
                    'Serpentine mines on leaves',
                    'Curled leaves'
                ],
                preventionMethods: [
                    'Use pheromone traps',
                    'Install yellow sticky traps',
                    'Mulching',
                    'Crop rotation'
                ],
                organicControl: [
                    'Bt spray for borers',
                    'Neem oil for whitefly',
                    'Garlic-chili spray',
                    'Release ladybird beetles'
                ]
            },
            monsoon: {
                riskLevel: 'High',
                commonPests: ['Late blight', 'Fruit borer', 'Leaf curl virus'],
                symptoms: ['Brown spots on leaves', 'Fruit damage', 'Curled leaves'],
                preventionMethods: ['Avoid overhead irrigation', 'Good drainage', 'Resistant varieties'],
                organicControl: ['Copper fungicide', 'Bt spray', 'Remove infected plants']
            },
            winter: {
                riskLevel: 'Medium',
                commonPests: ['Aphids', 'Whitefly'],
                symptoms: ['Sticky leaves', 'Yellowing'],
                preventionMethods: ['Monitor regularly', 'Remove weeds'],
                organicControl: ['Soap spray', 'Neem oil']
            },
            spring: {
                riskLevel: 'Medium',
                commonPests: ['Fruit borer', 'Leaf miner'],
                symptoms: ['Damaged fruits', 'Leaf mines'],
                preventionMethods: ['Pheromone traps', 'Field sanitation'],
                organicControl: ['Bt spray', 'Neem oil']
            }
        },
        wheat: {
            winter: {
                riskLevel: 'Medium',
                commonPests: ['Aphids', 'Termites', 'Rust disease'],
                symptoms: ['Sticky leaves', 'Root damage', 'Orange pustules on leaves'],
                preventionMethods: [
                    'Use resistant varieties',
                    'Timely sowing',
                    'Proper seed treatment',
                    'Crop rotation'
                ],
                organicControl: [
                    'Neem oil spray',
                    'Sulfur dust for rust',
                    'Biological control agents'
                ]
            },
            spring: {
                riskLevel: 'Low',
                commonPests: ['Aphids'],
                symptoms: ['Leaf curling'],
                preventionMethods: ['Monitor fields', 'Remove alternate hosts'],
                organicControl: ['Soap water spray']
            },
            summer: {
                riskLevel: 'Low',
                commonPests: ['Storage pests'],
                symptoms: ['Grain damage in storage'],
                preventionMethods: ['Proper drying', 'Clean storage'],
                organicControl: ['Neem leaves in storage']
            },
            monsoon: {
                riskLevel: 'Low',
                commonPests: ['Minimal risk'],
                symptoms: [],
                preventionMethods: ['Not applicable - off season'],
                organicControl: []
            }
        }
    };

    const defaultRisk: PestRisk = {
        riskLevel: 'Medium',
        commonPests: ['Aphids', 'Caterpillars', 'Beetles'],
        symptoms: ['Leaf damage', 'Stunted growth', 'Discoloration'],
        preventionMethods: [
            'Regular monitoring',
            'Crop rotation',
            'Field sanitation',
            'Use resistant varieties'
        ],
        organicControl: [
            'Neem oil spray (5ml/liter)',
            'Garlic-chili extract',
            'Soap water spray',
            'Biological control agents'
        ]
    };

    return riskMatrix[crop.toLowerCase()]?.[season] || defaultRisk;
}
