import { create } from 'zustand';

interface FarmField {
    id: string;
    name: string;
    area: number;
    cropType: string | null;
    status: string;
}

interface Farm {
    id: string;
    name: string;
    location: string;
    latitude: number;
    longitude: number;
    totalArea: number;
    soilType: string;
    fields?: FarmField[];
}

interface FarmState {
    selectedFarm: Farm | null;
    farms: Farm[];
    setSelectedFarm: (farm: Farm) => void;
    setFarms: (farms: Farm[]) => void;
}

export const useFarmStore = create<FarmState>((set) => ({
    selectedFarm: null,
    farms: [],
    setSelectedFarm: (farm) => set({ selectedFarm: farm }),
    setFarms: (farms) => set({ farms }),
}));
