// Crop Rotation Planner
export interface RotationSuggestion {
    nextCrop: string;
    reason: string;
    benefits: string[];
    timing: string;
    preparation: string[];
}

export function suggestNextCrop(currentCrop: string): RotationSuggestion[] {
    const rotations: Record<string, RotationSuggestion[]> = {
        rice: [
            {
                nextCrop: 'Wheat',
                reason: 'Different nutrient requirement',
                benefits: [
                    'Breaks pest cycle',
                    'Improves soil structure',
                    'Utilizes residual moisture'
                ],
                timing: 'Immediately after rice harvest (Oct-Nov)',
                preparation: [
                    'Light tillage',
                    'Apply FYM',
                    'Level the field'
                ]
            },
            {
                nextCrop: 'Chickpea',
                reason: 'Legume fixes nitrogen',
                benefits: [
                    'Adds nitrogen to soil',
                    'Improves soil fertility',
                    'Low water requirement'
                ],
                timing: 'After rice harvest',
                preparation: [
                    'Deep plowing',
                    'Rhizobium treatment',
                    'Ensure good drainage'
                ]
            }
        ],
        wheat: [
            {
                nextCrop: 'Rice',
                reason: 'Seasonal rotation',
                benefits: [
                    'Utilizes monsoon water',
                    'Different pest spectrum',
                    'Maintains soil health'
                ],
                timing: 'After wheat harvest (Apr-May)',
                preparation: [
                    'Puddling',
                    'Bund preparation',
                    'Nursery preparation'
                ]
            },
            {
                nextCrop: 'Maize',
                reason: 'Summer crop option',
                benefits: [
                    'Quick growing',
                    'Good market demand',
                    'Different nutrient uptake'
                ],
                timing: 'Summer season',
                preparation: [
                    'Deep plowing',
                    'Organic matter addition',
                    'Ensure irrigation'
                ]
            }
        ],
        tomato: [
            {
                nextCrop: 'Onion',
                reason: 'Different family',
                benefits: [
                    'Breaks disease cycle',
                    'Different nutrient needs',
                    'Good market value'
                ],
                timing: 'Next season',
                preparation: [
                    'Deep plowing',
                    'Add compost',
                    'Ensure drainage'
                ]
            },
            {
                nextCrop: 'Cabbage',
                reason: 'Brassica family rotation',
                benefits: [
                    'Different pest profile',
                    'Soil improvement',
                    'Winter crop'
                ],
                timing: 'Winter season',
                preparation: [
                    'Add organic matter',
                    'Ensure good drainage',
                    'Soil testing'
                ]
            }
        ],
        potato: [
            {
                nextCrop: 'Maize',
                reason: 'Cereal after tuber',
                benefits: [
                    'Breaks disease cycle',
                    'Different root depth',
                    'Improves soil structure'
                ],
                timing: 'Summer season',
                preparation: [
                    'Deep plowing',
                    'Remove potato residue',
                    'Add organic matter'
                ]
            },
            {
                nextCrop: 'Wheat',
                reason: 'Winter cereal',
                benefits: [
                    'Utilizes residual fertility',
                    'Different pest spectrum',
                    'Good rotation'
                ],
                timing: 'Winter season',
                preparation: [
                    'Light tillage',
                    'Level field',
                    'Timely sowing'
                ]
            }
        ]
    };

    const defaultRotation: RotationSuggestion[] = [
        {
            nextCrop: 'Legume (Chickpea/Lentil)',
            reason: 'Nitrogen fixation',
            benefits: [
                'Improves soil fertility',
                'Breaks pest cycle',
                'Low input cost'
            ],
            timing: 'Next season',
            preparation: [
                'Deep plowing',
                'Rhizobium treatment',
                'Ensure drainage'
            ]
        },
        {
            nextCrop: 'Cereal (Wheat/Maize)',
            reason: 'Balanced rotation',
            benefits: [
                'Different nutrient uptake',
                'Soil structure improvement',
                'Market stability'
            ],
            timing: 'Next season',
            preparation: [
                'Tillage',
                'Organic matter',
                'Leveling'
            ]
        }
    ];

    return rotations[currentCrop.toLowerCase()] || defaultRotation;
}
