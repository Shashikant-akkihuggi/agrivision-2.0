// Farming Calendar - Monthly task planner
export interface MonthlyTask {
    month: string;
    tasks: {
        sowing: string[];
        maintenance: string[];
        harvesting: string[];
        preparation: string[];
    };
}

export function getFarmingCalendar(): MonthlyTask[] {
    return [
        {
            month: 'January',
            tasks: {
                sowing: ['Wheat (late sowing)', 'Mustard', 'Chickpea', 'Lentil'],
                maintenance: ['Irrigate wheat and vegetables', 'Apply top dressing to wheat', 'Pest control in vegetables'],
                harvesting: ['Cauliflower', 'Cabbage', 'Carrot', 'Radish'],
                preparation: ['Prepare land for summer crops', 'Repair farm equipment']
            }
        },
        {
            month: 'February',
            tasks: {
                sowing: ['Summer vegetables', 'Watermelon', 'Cucumber', 'Bitter gourd'],
                maintenance: ['Irrigate wheat', 'Weed control', 'Fertilizer application'],
                harvesting: ['Wheat (early varieties)', 'Mustard', 'Winter vegetables'],
                preparation: ['Prepare nursery for summer crops']
            }
        },
        {
            month: 'March',
            tasks: {
                sowing: ['Maize', 'Cotton', 'Groundnut', 'Sesame'],
                maintenance: ['Irrigate summer crops', 'Pest monitoring'],
                harvesting: ['Wheat', 'Chickpea', 'Lentil', 'Mustard'],
                preparation: ['Deep plowing for monsoon crops', 'Soil testing']
            }
        },
        {
            month: 'April',
            tasks: {
                sowing: ['Rice nursery', 'Maize', 'Cotton', 'Vegetables'],
                maintenance: ['Irrigate frequently', 'Mulching', 'Pest control'],
                harvesting: ['Summer vegetables', 'Watermelon'],
                preparation: ['Prepare fields for rice transplanting']
            }
        },
        {
            month: 'May',
            tasks: {
                sowing: ['Rice nursery', 'Maize', 'Vegetables'],
                maintenance: ['Frequent irrigation', 'Shade nets for vegetables', 'Pest management'],
                harvesting: ['Cucumber', 'Bitter gourd', 'Summer crops'],
                preparation: ['Bund preparation for rice', 'Check irrigation channels']
            }
        },
        {
            month: 'June',
            tasks: {
                sowing: ['Rice transplanting', 'Maize', 'Soybean', 'Cotton'],
                maintenance: ['Weed control', 'Gap filling in rice', 'Fertilizer application'],
                harvesting: ['Early summer vegetables'],
                preparation: ['Ensure proper drainage', 'Repair bunds']
            }
        },
        {
            month: 'July',
            tasks: {
                sowing: ['Rice (late transplanting)', 'Vegetables', 'Pulses'],
                maintenance: ['Top dressing in rice', 'Pest and disease control', 'Weed management'],
                harvesting: ['Early maize'],
                preparation: ['Prepare for peak monsoon']
            }
        },
        {
            month: 'August',
            tasks: {
                sowing: ['Late season vegetables', 'Radish', 'Spinach'],
                maintenance: ['Fertilizer application', 'Pest control', 'Drainage management'],
                harvesting: ['Maize', 'Early vegetables'],
                preparation: ['Prepare for winter crops']
            }
        },
        {
            month: 'September',
            tasks: {
                sowing: ['Wheat nursery', 'Mustard', 'Chickpea', 'Vegetables'],
                maintenance: ['Reduce irrigation in rice', 'Pest monitoring'],
                harvesting: ['Rice (early varieties)', 'Soybean', 'Cotton (picking starts)'],
                preparation: ['Land preparation for wheat']
            }
        },
        {
            month: 'October',
            tasks: {
                sowing: ['Wheat', 'Mustard', 'Chickpea', 'Lentil', 'Pea'],
                maintenance: ['Irrigation in new crops', 'Weed control'],
                harvesting: ['Rice', 'Maize', 'Cotton', 'Soybean', 'Vegetables'],
                preparation: ['Store harvested grains properly']
            }
        },
        {
            month: 'November',
            tasks: {
                sowing: ['Late wheat', 'Vegetables', 'Potato'],
                maintenance: ['First irrigation to wheat', 'Fertilizer application', 'Pest control'],
                harvesting: ['Cotton', 'Late rice', 'Vegetables'],
                preparation: ['Prepare for winter vegetables']
            }
        },
        {
            month: 'December',
            tasks: {
                sowing: ['Winter vegetables', 'Late potato'],
                maintenance: ['Irrigate wheat and vegetables', 'Top dressing', 'Frost protection'],
                harvesting: ['Cauliflower', 'Cabbage', 'Tomato'],
                preparation: ['Plan for next year', 'Equipment maintenance']
            }
        }
    ];
}

export function getCurrentMonthTasks(): MonthlyTask {
    const calendar = getFarmingCalendar();
    const currentMonth = new Date().getMonth(); // 0-11
    return calendar[currentMonth];
}
