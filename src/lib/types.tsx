export type FoodType = 'food' | 'drink';
export type SodiumType = 'default' | 'salt';

export type Result = {
    score: number;
    isHealthy: boolean;
    isDrink: boolean;
    threshold: number;
    aEnergy: number;
    aSatFat: number;
    aSugar: number;
    aSodium: number;
    cFvn: number;
    cFibre: number;
    cProtein: number;
    cProteinShown: number;
    sodiumMg: number;
}