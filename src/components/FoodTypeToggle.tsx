import type { FoodType } from "../lib/types";

type FoodTypeToggleProps = {
    value: FoodType,
    onChange: (value: FoodType) => void;
}

function FoodTypeToggle({ value, onChange }: FoodTypeToggleProps) {
    return (
        <fieldset>
            <div className="checkbox-group">
                <div className="checkbox-group__field">
                    <input
                        id="food"
                        name="foodType"
                        type="radio"
                        value="food"
                        checked={value === 'food'}
                        onChange={() => onChange('food')}
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
                        checked={value === 'drink'}
                        onChange={() => onChange('drink')}
                        className="visually-hidden"
                    />
                    <label htmlFor="drink">Drink</label>
                </div>
            </div>
        </fieldset>
    )
}

export default FoodTypeToggle;