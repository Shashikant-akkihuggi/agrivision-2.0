// Smart Tips Generator - Daily farming tips
export interface DailyTip {
    category: string;
    tip: string;
    icon: string;
}

export function generateDailyTips(): DailyTip[] {
    const allTips: DailyTip[] = [
        { category: 'Water Management', tip: 'Water plants early morning to reduce evaporation', icon: '💧' },
        { category: 'Water Management', tip: 'Drip irrigation can save up to 60% water', icon: '💧' },
        { category: 'Water Management', tip: 'Mulching reduces water requirement by 30%', icon: '💧' },
        { category: 'Soil Health', tip: 'Add organic compost to improve soil fertility', icon: '🌱' },
        { category: 'Soil Health', tip: 'Rotate crops to maintain soil nutrients', icon: '🌱' },
        { category: 'Soil Health', tip: 'Test soil pH annually for optimal growth', icon: '🌱' },
        { category: 'Pest Control', tip: 'Use neem oil as natural pesticide', icon: '🐛' },
        { category: 'Pest Control', tip: 'Plant marigold to repel pests naturally', icon: '🐛' },
        { category: 'Pest Control', tip: 'Monitor fields regularly for early pest detection', icon: '🐛' },
        { category: 'Fertilizer', tip: 'Split nitrogen application for better efficiency', icon: '🧪' },
        { category: 'Fertilizer', tip: 'Use vermicompost for slow-release nutrients', icon: '🧪' },
        { category: 'Fertilizer', tip: 'Avoid over-fertilization to prevent soil damage', icon: '🧪' },
        { category: 'Harvesting', tip: 'Harvest in morning for better quality produce', icon: '🌾' },
        { category: 'Harvesting', tip: 'Dry grains to 12-14% moisture before storage', icon: '🌾' },
        { category: 'Harvesting', tip: 'Handle produce gently to avoid bruising', icon: '🌾' },
        { category: 'General', tip: 'Keep farm records for better decision making', icon: '📝' },
        { category: 'General', tip: 'Join farmer groups to share knowledge', icon: '👥' },
        { category: 'General', tip: 'Attend agricultural training programs', icon: '🎓' },
        { category: 'Cost Saving', tip: 'Make your own compost to reduce costs', icon: '💰' },
        { category: 'Cost Saving', tip: 'Share equipment with neighbors', icon: '💰' },
        { category: 'Cost Saving', tip: 'Buy inputs in bulk during off-season', icon: '💰' }
    ];

    // Return 3 random tips
    const shuffled = allTips.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
}
