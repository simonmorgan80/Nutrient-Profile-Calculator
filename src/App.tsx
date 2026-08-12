import { useState, useRef, useEffect } from 'react';
import type { FoodType, SodiumType, Result } from './lib/types';
import FoodTypeToggle from './components/FoodTypeToggle';
import NutrientInput from './components/NutrientInput';
import SodiumTypeToggle from './components/SodiumTypeToggle';

import ResultCard from './components/ResultCard';


// --- A points scoring tables ---
function energyPoints(kj: number, isDrink: boolean) {
    const thresholds = isDrink
        ? [0, 30, 60, 90, 120, 150, 180, 210, 240, 270]
        : [335, 670, 1005, 1340, 1675, 2010, 2345, 2680, 3015, 3350];
    for (let i = thresholds.length - 1; i >= 0; i--) {
        if (kj > thresholds[i]) return i + 1;
    }
    return 0;
}

function satFatPoints(g: number) {
    const thresholds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    for (let i = thresholds.length - 1; i >= 0; i--) {
        if (g > thresholds[i]) return i + 1;
    }
    return 0;
}

function sugarPoints(g: number, isDrink: boolean) {
    const thresholds = isDrink
        ? [0, 1.5, 3, 4.5, 6, 7.5, 9, 10.5, 12, 13.5]
        : [4.5, 9, 13.5, 18, 22.5, 27, 31, 36, 40, 45];
    for (let i = thresholds.length - 1; i >= 0; i--) {
        if (g > thresholds[i]) return i + 1;
    }
    return 0;
}

function sodiumPoints(mg: number) {
    const thresholds = [90, 180, 270, 360, 450, 540, 630, 720, 810, 900];
    for (let i = thresholds.length - 1; i >= 0; i--) {
        if (mg > thresholds[i]) return i + 1;
    }
    return 0;
}

// --- C points scoring tables ---
function fvnPoints(pct: number) {
    if (pct > 80) return 5;
    if (pct > 60) return 2;
    if (pct > 40) return 1;
    return 0;
}

function fibrePoints(g: number) {
    const thresholds = [0.9, 1.9, 2.8, 3.7, 4.7];
    for (let i = thresholds.length - 1; i >= 0; i--) {
        if (g > thresholds[i]) return i + 1;
    }
    return 0;
}

function proteinPoints(g: number) {
    const thresholds = [1.6, 3.2, 4.8, 6.4, 8.0];
    for (let i = thresholds.length - 1; i >= 0; i--) {
        if (g > thresholds[i]) return i + 1;
    }
    return 0;
}

function toNum(v: string) {
    const n = parseFloat(v);
    return isNaN(n) ? 0 : n;
}

function App() {
    const [foodType, setFoodType] = useState<FoodType>('food');
    const [sodiumType, setSodiumType] = useState<SodiumType>('default');

    const [energy, setEnergy] = useState('');
    const [saturatedFat, setSaturatedFat] = useState('');
    const [totalSugars, setTotalSugars] = useState('');
    const [sodium, setSodium] = useState('');
    const [fvn, setFvn] = useState('');
    const [fibre, setFibre] = useState('');
    const [protein, setProtein] = useState('');

    const [result, setResult] = useState<Result | null>(null);

    const sodiumLabel = sodiumType === 'salt' ? 'Salt' : 'Sodium';
    const sodiumUnit = sodiumType === 'salt' ? 'g' : 'mg';

    const resultRef = useRef<HTMLDivElement>(null);

    // Convert existing sodium value when the unit toggle changes
    const handleSodiumTypeChange = (newType: SodiumType) => {
        const currentVal = toNum(sodium);
        if (currentVal > 0) {
            if (newType === 'salt') {
                // sodium mg -> salt g
                setSodium(String(+(currentVal / 400).toFixed(3)));
            } else {
                // salt g -> sodium mg
                setSodium(String(+(currentVal * 400).toFixed(1)));
            }
        }
        setSodiumType(newType);
    };

    const getSodiumMg = () => {
        const val = toNum(sodium);
        return sodiumType === 'salt' ? val * 400 : val;
    };

    const calculate = () => {
        const isDrink = foodType === 'drink';
        const sodiumMg = getSodiumMg();

        const aEnergy = energyPoints(toNum(energy), isDrink);
        const aSatFat = satFatPoints(toNum(saturatedFat));
        const aSugar = sugarPoints(toNum(totalSugars), isDrink);
        const aSodium = sodiumPoints(sodiumMg);
        const totalA = aEnergy + aSatFat + aSugar + aSodium;

        const cFvn = fvnPoints(toNum(fvn));
        const cFibre = fibrePoints(toNum(fibre));
        const cProtein = proteinPoints(toNum(protein));
        const totalC = cFvn + cFibre + cProtein;

        let score: number;
        if (totalA >= 11 && cFvn < 5) {
            score = totalA - (cFvn + cFibre);
        } else {
            score = totalA - totalC;
        }

        const threshold = isDrink ? 1 : 4;
        const isHealthy = score < threshold;
        const cProteinShown = totalA >= 11 && cFvn < 5 ? 0 : cProtein;

        setResult({
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
        });
    };

    useEffect(() => {
        if (result) {
            resultRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [result]);

    return (
        <div className="container">
            <div className="calculator">
                <div className="calculator__header">
                    <h1 className="mb-0">Nutrient Profile Calculator</h1>
                    <p>UK NPM Score (per 100g)</p>
                </div>

                <div className="calculator__body">
                    <form>
                        {/* item type */}
                        <FoodTypeToggle value={foodType} onChange={setFoodType}/>

                        {/* A points */}
                        <fieldset>
                            <legend>A Points (negative nutrients)</legend>
                            <div className="input-group">
                                <NutrientInput
                                    id="energy"
                                    label="Energy"
                                    suffix="kJ"
                                    value={energy}
                                    onChange={setEnergy}
                                />
                                <NutrientInput
                                    id="saturatedFat"
                                    label="Saturated Fat"
                                    suffix="g"
                                    value={saturatedFat}
                                    onChange={setSaturatedFat}
                                />
                                <NutrientInput
                                    id="totalSugars"
                                    label="Total Sugars"
                                    suffix="g"
                                    value={totalSugars}
                                    onChange={setTotalSugars}
                                />
                                <NutrientInput
                                    id="sodium"
                                    label={sodiumLabel}
                                    suffix={sodiumUnit}
                                    value={sodium}
                                    onChange={setSodium}
                                >
                                    <SodiumTypeToggle onChange={handleSodiumTypeChange} value={sodiumType} />
                                </NutrientInput>
                            </div>
                        </fieldset>

                        {/* C points */}
                        <fieldset>
                            <legend>C Points (positive nutrients)</legend>
                            <div className="input-group">
                                <NutrientInput
                                    id="fvn"
                                    label="Fruit/Veg/Nuts %"
                                    suffix="%"
                                    value={fvn}
                                    onChange={setFvn}
                                    min="0"
                                    max="100"
                                />
                                <NutrientInput
                                    id="fibre"
                                    label="Fibre (AOAC)"
                                    suffix="g"
                                    value={fibre}
                                    onChange={setFibre}
                                />
                                <NutrientInput
                                    id="protein"
                                    label="Protein"
                                    suffix="g"
                                    value={protein}
                                    onChange={setProtein}
                                />
                            </div>
                        </fieldset>
                        <button className="button" type="button" onClick={calculate}>Calculate NPM Score</button>
                    </form>
                </div>

                {result && (
                <div className="calculator__results">
                    <ResultCard result={result} ref={resultRef}/>
                </div>
                )}
            </div>
        </div>
    )
}

export default App