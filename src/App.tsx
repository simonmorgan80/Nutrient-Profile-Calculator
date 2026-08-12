import { useState, useRef, useEffect } from 'react';
import type { FoodType, SodiumType, Result } from './lib/types';
import { toNum, saltToSodiumMg, sodiumMgToSalt, calculateScore } from './lib/scoring';
import FoodTypeToggle from './components/FoodTypeToggle';
import NutrientInput from './components/NutrientInput';
import SodiumTypeToggle from './components/SodiumTypeToggle';
import ResultCard from './components/ResultCard';

function App() {
    const [foodType, setFoodType] = useState<FoodType>('food');
    const [sodiumType, setSodiumType] = useState<SodiumType>('default');
    const [result, setResult] = useState<Result | null>(null);
    const resultRef = useRef<HTMLDivElement>(null);

    // Nutrient values
    const [energy, setEnergy] = useState('');
    const [saturatedFat, setSaturatedFat] = useState('');
    const [totalSugars, setTotalSugars] = useState('');
    const [sodium, setSodium] = useState('');
    const [fvn, setFvn] = useState('');
    const [fibre, setFibre] = useState('');
    const [protein, setProtein] = useState('');

    // Sodium/Salt conversion
    const sodiumLabel = sodiumType === 'salt' ? 'Salt' : 'Sodium';
    const sodiumUnit = sodiumType === 'salt' ? 'g' : 'mg';
    const handleSodiumTypeChange = (newType: SodiumType) => {
        const currentVal = toNum(sodium);
        if (currentVal > 0) {
            if (newType === 'salt') {
                setSodium(String(sodiumMgToSalt(currentVal)));
            } else {
                setSodium(String(saltToSodiumMg(currentVal)));
            }
        }
        setSodiumType(newType);
    };

    const getSodiumMg = () => {
        const val = toNum(sodium);
        return sodiumType === 'salt' ? val * 400 : val;
    };

    // Score calculation
    const handleCalculate = () => {
        const npmResult = calculateScore({
            isDrink: foodType === 'drink',
            energy: toNum(energy),
            saturatedFat: toNum(saturatedFat),
            totalSugars: toNum(totalSugars),
            sodiumMg: getSodiumMg(),
            fvn: toNum(fvn),
            fibre: toNum(fibre),
            protein: toNum(protein),
        });
        setResult(npmResult);
    };

    const handleResetAll = () => {
        setFoodType('food');
        setSodiumType('default');
        setEnergy('');
        setSaturatedFat('');
        setTotalSugars('');
        setSodium('');
        setFvn('');
        setFibre('');
        setProtein('');
        setResult(null);
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

                        <div className="btn-group">
                            <button className="btn" type="button" onClick={handleCalculate}>Calculate NPM Score</button>
                            <button className="btn btn--secondary" type="button" onClick={handleResetAll}>Reset</button>
                        </div>                        
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