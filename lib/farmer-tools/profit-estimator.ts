// Profit Estimator - Calculate expected profit
export interface ProfitEstimate {
    expectedYield: number;
    yieldUnit: string;
    estimatedRevenue: number;
    estimatedCost: number;
    netProfit: number;
    profitPerAcre: number;
    breakdownCosts: {
        seeds: number;
        fertilizer: number;
        pesticides: number;
        labor: number;
        irrigation: number;
        other: number;
    };
}

export function estimateProfit(landSize: number, crop: string): ProfitEstimate {
    const cropData: Record<string, any> = {
        rice: {
            yieldPerAcre: 3,
            unit: 'tons',
            pricePerUnit: 20000,
            costPerAcre: 25000
        },
        wheat: {
            yieldPerAcre: 3.5,
            unit: 'tons',
            pricePerUnit: 22000,
            costPerAcre: 22000
        },
        tomato: {
            yieldPerAcre: 20,
            unit: 'tons',
            pricePerUnit: 15000,
            costPerAcre: 60000
        },
        potato: {
            yieldPerAcre: 25,
            unit: 'tons',
            pricePerUnit: 12000,
            costPerAcre: 50000
        },
        maize: {
            yieldPerAcre: 4,
            unit: 'tons',
            pricePerUnit: 18000,
            costPerAcre: 20000
        },
        cotton: {
            yieldPerAcre: 2.5,
            unit: 'tons',
            pricePerUnit: 60000,
            costPerAcre: 35000
        }
    };

    const data = cropData[crop.toLowerCase()] || {
        yieldPerAcre: 2,
        unit: 'tons',
        pricePerUnit: 15000,
        costPerAcre: 25000
    };

    const totalYield = data.yieldPerAcre * landSize;
    const revenue = totalYield * data.pricePerUnit;
    const totalCost = data.costPerAcre * landSize;
    const profit = revenue - totalCost;

    return {
        expectedYield: totalYield,
        yieldUnit: data.unit,
        estimatedRevenue: revenue,
        estimatedCost: totalCost,
        netProfit: profit,
        profitPerAcre: profit / landSize,
        breakdownCosts: {
            seeds: totalCost * 0.15,
            fertilizer: totalCost * 0.25,
            pesticides: totalCost * 0.10,
            labor: totalCost * 0.35,
            irrigation: totalCost * 0.10,
            other: totalCost * 0.05
        }
    };
}
