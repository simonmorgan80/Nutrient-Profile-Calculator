import type { SodiumType } from '../lib/types';

type SodiumTypeToggleProps = {
    value: SodiumType;
    onChange: (sodiumType: SodiumType) => void
}

function SodiumTypeToggle({value, onChange} : SodiumTypeToggleProps) {
    return (
        <div className="checkbox-group checkbox-group--small">
            <div className="checkbox-group__field">
                <input
                    id="sodiumDefault"
                    name="sodiumType"
                    type="radio"
                    value="default"
                    checked={value === 'default'}
                    onChange={() => onChange('default')}
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
                    checked={value === 'salt'}
                    onChange={() => onChange('salt')}
                    className="visually-hidden"
                />
                <label htmlFor="sodiumSalt">Salt</label>
            </div>
        </div>
    )
}

export default SodiumTypeToggle;