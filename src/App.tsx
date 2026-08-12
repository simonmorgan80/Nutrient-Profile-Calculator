import { useState, useRef, useEffect } from 'react';

type FoodType = 'food' | 'drink';
type SodiumType = 'default' | 'salt';

type Result = {
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
                    <form action="">

                        {/* item type */}
                        <fieldset>
                            <div className="checkbox-group">
                                <div className="checkbox-group__field">
                                    <input
                                        id="food"
                                        name="foodType"
                                        type="radio"
                                        value="food"
                                        checked={foodType === 'food'}
                                        onChange={() => setFoodType('food')}
                                        className="visually-hidden"
                                    />
                                    <label htmlFor="food">Food</label>
                                </div>
                                <div className="checkbox-group__field">
                                    <input
                                        id="drink"
                                        name="foodType"
                                        type="radio"
                                        value="drink"
                                        checked={foodType === 'drink'}
                                        onChange={() => setFoodType('drink')}
                                        className="visually-hidden"
                                    />
                                    <label htmlFor="drink">Drink</label>
                                </div>
                            </div>
                        </fieldset>

                        {/* A points */}
                        <fieldset>
                            <legend>A Points (negative nutrients)</legend>

                            <div className="input-group">

                                <div className="input-group__field">
                                    <label htmlFor="energy">Energy</label>
                                    <div className="input-group__control">
                                        <input
                                            id="energy"
                                            type="number"
                                            placeholder="0"
                                            value={energy}
                                            onChange={(e) => setEnergy(e.target.value)}
                                        />
                                        <span className="input-group__suffix">kJ</span>
                                    </div>
                                </div>

                                <div className="input-group__field">
                                    <label htmlFor="saturatedFat">Saturated Fat</label>
                                    <div className="input-group__control">
                                        <input
                                            id="saturatedFat"
                                            type="number"
                                            placeholder="0"
                                            value={saturatedFat}
                                            onChange={(e) => setSaturatedFat(e.target.value)}
                                        />
                                        <span className="input-group__suffix">g</span>
                                    </div>
                                </div>

                                <div className="input-group__field">
                                    <label htmlFor="totalSugars">Total Sugars</label>
                                    <div className="input-group__control">
                                        <input
                                            id="totalSugars"
                                            type="number"
                                            placeholder="0"
                                            value={totalSugars}
                                            onChange={(e) => setTotalSugars(e.target.value)}
                                        />
                                        <span className="input-group__suffix">g</span>
                                    </div>
                                </div>

                                <div className="input-group__field">
                                    <label htmlFor="sodium">{sodiumLabel}</label>
                                    <div className="input-group__control">
                                        <input
                                            id="sodium"
                                            type="number"
                                            placeholder="0"
                                            value={sodium}
                                            onChange={(e) => setSodium(e.target.value)}
                                        />
                                        <span className="input-group__suffix">{sodiumUnit}</span>
                                    </div>

                                    <div className="checkbox-group checkbox-group--small">
                                        <div className="checkbox-group__field">
                                            <input
                                                id="sodiumDefault"
                                                name="sodiumType"
                                                type="radio"
                                                value="default"
                                                checked={sodiumType === 'default'}
                                                onChange={() => handleSodiumTypeChange('default')}
                                                className="visually-hidden"
                                            />
                                            <label htmlFor="sodiumDefault">Sodium</label>
                                        </div>
                                        <div className="checkbox-group__field">
                                            <input
                                                id="sodiumSalt"
                                                name="sodiumType"
                                                type="radio"
                                                value="salt"
                                                checked={sodiumType === 'salt'}
                                                onChange={() => handleSodiumTypeChange('salt')}
                                                className="visually-hidden"
                                            />
                                            <label htmlFor="sodiumSalt">Salt</label>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </fieldset>

                        {/* C points */}
                        <fieldset>
                            <legend>C Points (positive nutrients)</legend>

                            <div className="input-group">
                                <div className="input-group__field">
                                    <label htmlFor="fvn">Fruit/Veg/Nuts %</label>
                                    <div className="input-group__control">
                                        <input
                                            id="fvn"
                                            type="number"
                                            placeholder="0"
                                            min="0"
                                            max="100"
                                            value={fvn}
                                            onChange={(e) => setFvn(e.target.value)}
                                        />
                                        <span className="input-group__suffix">%</span>
                                    </div>
                                </div>

                                <div className="input-group__field">
                                    <label htmlFor="fibre">Fibre (AOAC)</label>
                                    <div className="input-group__control">
                                        <input
                                            id="fibre"
                                            type="number"
                                            placeholder="0"
                                            value={fibre}
                                            onChange={(e) => setFibre(e.target.value)}
                                        />
                                        <span className="input-group__suffix">g</span>
                                    </div>
                                </div>

                                <div className="input-group__field">
                                    <label htmlFor="protein">Protein</label>
                                    <div className="input-group__control">
                                        <input
                                            id="protein"
                                            type="number"
                                            placeholder="0"
                                            value={protein}
                                            onChange={(e) => setProtein(e.target.value)}
                                        />
                                        <span className="input-group__suffix">g</span>
                                    </div>
                                </div>

                            </div>

                        </fieldset>
                        <button className="button" type="button" onClick={calculate}>Calculate NPM Score</button>

                    </form>
                </div>

                <div className="calculator__results">

                    {result && (
                        <div className={`result show`} ref={resultRef}>
                            <div className={`score-circle ${result.isHealthy ? 'healthy' : 'unhealthy'}`} id="scoreCircle">
                                <span className="score-value" id="scoreValue">{result.score}</span>
                                <span className="score-label">NPM Score</span>
                            </div>
                            <div className="text-center">

                                <p className={`result-text ${result.isHealthy ? 'healthy' : 'unhealthy'}`} id="resultText">
                                    {result.isHealthy ? '✓ Healthier Choice' : '⚠️ Less Healthy'}
                                </p>
                                <p className="result-detail" id="resultDetail">
                                    {result.isDrink
                                        ? `Drinks scoring less than ${result.threshold} can be advertised to children.`
                                        : `Foods scoring less than ${result.threshold} can be advertised to children.`}
                                </p>

                            </div>
                            <ul className="breakdown" id="breakdown">
                                <li className="breakdown-row">
                                    <span>Energy</span>
                                    <span className="negative">+{result.aEnergy}</span>
                                </li>
                                <li className="breakdown-row">
                                    <span>Saturated Fat</span>
                                    <span className="negative">+{result.aSatFat}</span>
                                </li>
                                <li className="breakdown-row">
                                    <span>Sugars</span>
                                    <span className="negative">+{result.aSugar}</span>
                                </li>
                                <li className="breakdown-row">
                                    <span>Sodium</span>
                                    <span className="negative">+{result.aSodium}</span>
                                </li>
                                <li className="breakdown-row">
                                    <span>Fruit/Veg/Nuts</span>
                                    <span className="positive">−{result.cFvn}</span>
                                </li>
                                <li className="breakdown-row">
                                    <span>Fibre</span>
                                    <span className="positive">−{result.cFibre}</span>
                                </li>
                                <li className="breakdown-row">
                                    <span>Protein</span>
                                    <span className="positive">−{result.cProteinShown}</span>
                                </li>
                                <li className="breakdown-row">
                                    <span>Final Score</span>
                                    <span>{result.score}</span>
                                </li>
                            </ul>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}

export default App