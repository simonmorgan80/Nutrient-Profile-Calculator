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

export type NpInputs = {
    isDrink: boolean;
    energy: number;
    saturatedFat: number;
    totalSugars: number;
    sodiumMg: number;
    fvn: number;
    fibre: number;
    protein: number;
};