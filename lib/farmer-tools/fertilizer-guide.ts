// Fertilizer Guide - Rule-based fertilizer recommendations
export interface FertilizerSchedule {
    basalDose: string;
    topDressing: string[];
    organicOptions: string[];
    micronutrients: string[];
    applicationTips: string[];
}

export function getFertilizerGuide(crop: string): FertilizerSchedule {
    const guides: Record<string, FertilizerSchedule> = {
        rice: {
            basalDose: 'NPK 120:60:40 kg/hectare',
            topDressing: [
                '40 kg N at tillering (25-30 days)',
                '40 kg N at panicle initiation (45-50 days)'
            ],
            organicOptions: [
                'FYM 10 tons/hectare before planting',
                'Green manure (Dhaincha) before transplanting',
                'Vermicompost 5 tons/hectare'
            ],
            micronutrients: ['Zinc sulfate 25 kg/ha', 'Iron sulfate if deficiency'],
            applicationTips: [
                'Apply basal dose at transplanting',
                'Split nitrogen application for better efficiency',
                'Apply in moist soil'
            ]
        },
        wheat: {
            basalDose: 'NPK 120:60:40 kg/hectare',
            topDressing: [
                '40 kg N at crown root initiation (21 days)',
                '40 kg N at tillering (40-45 days)'
            ],
            organicOptions: [
                'FYM 8-10 tons/hectare',
                'Compost 5 tons/hectare',
                'Neem cake 500 kg/hectare'
            ],
            micronutrients: ['Zinc sulfate 25 kg/ha', 'Boron if deficiency'],
            applicationTips: [
                'Apply full P and K at sowing',
                'Split nitrogen in 3 doses',
                'Irrigate after top dressing'
            ]
        },
        tomato: {
            basalDose: 'NPK 100:80:60 kg/hectare',
            topDressing: [
                '50 kg N at 30 days after transplanting',
                '50 kg N at flowering stage'
            ],
            organicOptions: [
                'FYM 20-25 tons/hectare',
                'Vermicompost 5 tons/hectare',
                'Bone meal for phosphorus'
            ],
            micronutrients: ['Calcium for blossom end rot', 'Magnesium sulfate', 'Boron'],
            applicationTips: [
                'Apply basal dose 1 week before transplanting',
                'Foliar spray of micronutrients',
                'Avoid excess nitrogen during fruiting'
            ]
        },
        potato: {
            basalDose: 'NPK 120:80:100 kg/hectare',
            topDressing: [
                '40 kg N at earthing up (30 days)'
            ],
            organicOptions: [
                'FYM 20-25 tons/hectare',
                'Compost 10 tons/hectare',
                'Wood ash for potassium'
            ],
            micronutrients: ['Zinc sulfate', 'Boron', 'Magnesium'],
            applicationTips: [
                'High potassium requirement',
                'Apply basal dose at planting',
                'Avoid excess nitrogen (reduces quality)'
            ]
        },
        maize: {
            basalDose: 'NPK 120:60:40 kg/hectare',
            topDressing: [
                '60 kg N at knee-high stage (30-35 days)',
                '60 kg N at tasseling (50-55 days)'
            ],
            organicOptions: [
                'FYM 10 tons/hectare',
                'Compost 5 tons/hectare',
                'Green manure'
            ],
            micronutrients: ['Zinc sulfate 25 kg/ha', 'Sulfur'],
            applicationTips: [
                'Apply full P and K at sowing',
                'Split nitrogen application',
                'Side dress during vegetative growth'
            ]
        },
        cotton: {
            basalDose: 'NPK 120:60:60 kg/hectare',
            topDressing: [
                '40 kg N at square formation (40 days)',
                '40 kg N at flowering (60 days)'
            ],
            organicOptions: [
                'FYM 10-12 tons/hectare',
                'Neem cake 500 kg/hectare',
                'Vermicompost 3 tons/hectare'
            ],
            micronutrients: ['Zinc sulfate', 'Boron', 'Sulfur'],
            applicationTips: [
                'Avoid excess nitrogen (promotes vegetative growth)',
                'Increase potassium for better fiber quality',
                'Apply micronutrients as foliar spray'
            ]
        }
    };

    const defaultGuide: FertilizerSchedule = {
        basalDose: 'NPK 100:50:50 kg/hectare',
        topDressing: [
            '50 kg N at 30 days after planting',
            '50 kg N at flowering stage'
        ],
        organicOptions: [
            'FYM 10 tons/hectare',
            'Compost 5 tons/hectare',
            'Vermicompost 3 tons/hectare'
        ],
        micronutrients: ['Zinc', 'Boron', 'Iron as needed'],
        applicationTips: [
            'Soil test before application',
            'Apply in split doses',
            'Combine with organic matter'
        ]
    };

    return guides[crop.toLowerCase()] || defaultGuide;
}
