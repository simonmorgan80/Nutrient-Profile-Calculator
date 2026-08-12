import type { NpInputs, Result } from './types';

// Helpers

// Salt / Sodium

export const SALT_TO_SODIUM_FACTOR = 400;

export function saltToSodiumMg(saltGrams: number) {
    return +(saltGrams * SALT_TO_SODIUM_FACTOR).toFixed(1);
}

export function sodiumMgToSalt(sodiumMg: number) {
    return +(sodiumMg / SALT_TO_SODIUM_FACTOR).toFixed(3);
}

export function toNum(v: string) {
    const n = parseFloat(v);
    return isNaN(n) ? 0 : n;
}

// --- A points scoring tables ---

export function energyPoints(kj: number, isDrink: boolean) {
    const thresholds = isDrink
        ? [0, 30, 60, 90, 120, 150, 180, 210, 240, 270]
        : [335, 670, 1005, 1340, 1675, 2010, 2345, 2680, 3015, 3350];
    return pointsFromThresholds(kj, thresholds);
}

export function satFatPoints(g: number) {
    const thresholds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    return pointsFromThresholds(g, thresholds);
}

export function sugarPoints(g: number, isDrink: boolean) {
    const thresholds = isDrink
        ? [0, 1.5, 3, 4.5, 6, 7.5, 9, 10.5, 12, 13.5]
        : [4.5, 9, 13.5, 18, 22.5, 27, 31, 36, 40, 45];
    return pointsFromThresholds(g, thresholds);
}

export function sodiumPoints(mg: number) {
    const thresholds = [90, 180, 270, 360, 450, 540, 630, 720, 810, 900];
    return pointsFromThresholds(mg, thresholds);
}

// --- C points scoring tables ---

export function fvnPoints(pct: number) {
    if (pct > 80) return 5;
    if (pct > 60) return 2;
    if (pct > 40) return 1;
    return 0;
}

export function fibrePoints(g: number) {
    const thresholds = [0.9, 1.9, 2.8, 3.7, 4.7];
    return pointsFromThresholds(g, thresholds);
}

export function proteinPoints(g: number) {
    const thresholds = [1.6, 3.2, 4.8, 6.4, 8.0];
    return pointsFromThresholds(g, thresholds);
}

// --- shared helper ---

function pointsFromThresholds(value: number, thresholds: number[]) {
    for (let i = thresholds.length - 1; i >= 0; i--) {
        if (value > thresholds[i]) return i + 1;
    }
    return 0;
}


// Calculate score

export function calculateScore(inputs: NpInputs): Result {
    const { isDrink, energy, saturatedFat, totalSugars, sodiumMg, fvn, fibre, protein } = inputs;

    const aEnergy = energyPoints(energy, isDrink);
    const aSatFat = satFatPoints(saturatedFat);
    const aSugar = sugarPoints(totalSugars, isDrink);
    const aSodium = sodiumPoints(sodiumMg);
    const totalA = aEnergy + aSatFat + aSugar + aSodium;

    const cFvn = fvnPoints(fvn);
    const cFibre = fibrePoints(fibre);
    const cProtein = proteinPoints(protein);
    const totalC = cFvn + cFibre + cProtein;

    // Protein points are excluded when A >= 11 and fruit/veg/nut points < 5
    const proteinCapped = totalA >= 11 && cFvn < 5;
    const score = proteinCapped ? totalA - (cFvn + cFibre) : totalA - totalC;

    const threshold = isDrink ? 1 : 4;
    const isHealthy = score < threshold;
    const cProteinShown = proteinCapped ? 0 : cProtein;

    return {
        score,
        isHealthy,
        isDrink,
        threshold,
        aEnergy,
        aSatFat,
        aSugar,
        aSodium,
        cFvn,
        cFibre,
        cProtein,
        cProteinShown,
        sodiumMg,
    };
}
