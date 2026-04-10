// Farm Health Score Calculator
export interface HealthScore {
    totalScore: number;
    breakdown: {
        irrigation: { score: number; feedback: string };
        cropChoice: { score: number; feedback: string };
        soilHealth: { score: number; feedback: string };
        pestManagement: { score: number; feedback: string };
    };
    recommendations: string[];
    rating: 'Excellent' | 'Good' | 'Fair' | 'Needs Improvement';
}

export function calculateFarmHealth(
    irrigationFrequency: 'regular' | 'irregular' | 'none',
    cropSuitability: 'high' | 'medium' | 'low',
    organicMatterUse: 'yes' | 'no',
    pestControl: 'integrated' | 'chemical' | 'none'
): HealthScore {
    let irrigationScore = 0;
    let irrigationFeedback = '';

    if (irrigationFrequency === 'regular') {
        irrigationScore = 25;
        irrigationFeedback = 'Excellent water management';
    } else if (irrigationFrequency === 'irregular') {
        irrigationScore = 15;
        irrigationFeedback = 'Improve irrigation consistency';
    } else {
        irrigationScore = 5;
        irrigationFeedback = 'Critical: Implement irrigation system';
    }

    let cropScore = 0;
    let cropFeedback = '';

    if (cropSuitability === 'high') {
        cropScore = 25;
        cropFeedback = 'Optimal crop selection';
    } else if (cropSuitability === 'medium') {
        cropScore = 15;
        cropFeedback = 'Consider more suitable crops';
    } else {
        cropScore = 5;
        cropFeedback = 'Poor crop choice for conditions';
    }

    let soilScore = 0;
    let soilFeedback = '';

    if (organicMatterUse === 'yes') {
        soilScore = 25;
        soilFeedback = 'Good soil health practices';
    } else {
        soilScore = 10;
        soilFeedback = 'Add organic matter to improve soil';
    }

    let pestScore = 0;
    let pestFeedback = '';

    if (pestControl === 'integrated') {
        pestScore = 25;
        pestFeedback = 'Excellent IPM practices';
    } else if (pestControl === 'chemical') {
        pestScore = 15;
        pestFeedback = 'Consider integrated pest management';
    } else {
        pestScore = 5;
        pestFeedback = 'Implement pest control measures';
    }

    const totalScore = irrigationScore + cropScore + soilScore + pestScore;

    const recommendations: string[] = [];
    if (irrigationScore < 20) recommendations.push('Improve irrigation scheduling');
    if (cropScore < 20) recommendations.push('Choose crops suited to your region');
    if (soilScore < 20) recommendations.push('Increase organic matter application');
    if (pestScore < 20) recommendations.push('Adopt integrated pest management');

    let rating: 'Excellent' | 'Good' | 'Fair' | 'Needs Improvement';
    if (totalScore >= 80) rating = 'Excellent';
    else if (totalScore >= 60) rating = 'Good';
    else if (totalScore >= 40) rating = 'Fair';
    else rating = 'Needs Improvement';

    return {
        totalScore,
        breakdown: {
            irrigation: { score: irrigationScore, feedback: irrigationFeedback },
            cropChoice: { score: cropScore, feedback: cropFeedback },
            soilHealth: { score: soilScore, feedback: soilFeedback },
            pestManagement: { score: pestScore, feedback: pestFeedback }
        },
        recommendations,
        rating
    };
}
