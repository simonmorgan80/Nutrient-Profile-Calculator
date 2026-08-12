import type { Result } from "../lib/types";

type ResultProps = {
    result: Result,
    ref: React.Ref<HTMLDivElement>
}

function ResultCard({result, ref} : ResultProps) {
    return (
        <div className={`result show`} ref={ref}>
            <div className={`score-circle ${result.isHealthy ? 'healthy' : 'unhealthy'}`}>
                <span className="score-value" id="scoreValue">{result.score}</span>
                <span className="score-label">NPM Score</span>
            </div>
            <div className="text-center">
                <p>
                    {result.isHealthy ? '✓ Healthier Choice' : '⚠️ Less Healthy'}
                </p>
                <p className="result-detail">
                    {result.isDrink ? `Drinks `: `Foods `}
                    scoring less than {result.threshold} can be advertised to children
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
                    <span className="positive">-{result.cFvn}</span>
                </li>
                <li className="breakdown-row">
                    <span>Fibre</span>
                    <span className="positive">-{result.cFibre}</span>
                </li>
                <li className="breakdown-row">
                    <span>Protein</span>
                    <span className="positive">-{result.cProteinShown}</span>
                </li>
                <li className="breakdown-row">
                    <strong>Final Score</strong>
                    <strong>{result.score}</strong>
                </li>
            </ul>
        </div>
    )
}

export default ResultCard;