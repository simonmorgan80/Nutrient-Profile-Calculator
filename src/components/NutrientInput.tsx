type NutrientInputProps = {
    id: string;
    label: string;
    suffix: string;
    value: string;
    onChange: (value: string) => void;
    min?: string;
    max?: string;
    children?: React.ReactNode
}

function NutrientInput({id, label, suffix, value, onChange, min, max, children} : NutrientInputProps) {
    return (
        <div className="input-group__field">
            <label htmlFor={id}>{label}</label>
            <div className="input-group__control">
                <input
                    id={id}
                    type="number"
                    placeholder="0"
                    value={value}
                    min={min}
                    max={max}
                    onChange={(e) => onChange(e.target.value)}
                />
                <span className="input-group__suffix">{suffix}</span>
            </div>
            {children}
        </div>
    )
}

export default NutrientInput;