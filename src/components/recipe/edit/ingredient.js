import React, { useContext } from "react";
import { BsTrash } from "react-icons/bs";
import EditableCreatableSelect from "../create/EditableCreatableSelect";
import { useTranslation } from "react-i18next";
import { eggDetector } from "../../functions";
import { IngredientsContext } from "../../../store/centralIngredients";

const Ingredients = ({ index, ingredient, onUpdate, onDelete }) => {
    const { ingredientsData } = useContext(IngredientsContext);
    const { t } = useTranslation();

    const handleQuantityChange = (e) => {
        const newQuantity = Number(e.target.value);
        const updatedIngredient = {
            ...ingredient,
            quantite: newQuantity,
        };

        if (eggDetector.test(ingredient.nom)) {
            const eggWeight = 50;
            updatedIngredient.nbEggs = Math.round(newQuantity / eggWeight);
        }

        onUpdate(updatedIngredient);
    };

    const handleNameChange = (selectedOption) => {
        onUpdate({
            ...ingredient,
            nom: selectedOption ? selectedOption.value : "",
        });
    };

    const selectedIngredient = ingredientsData.find(
        (option) => option.label === ingredient.nom
    ) || { label: ingredient.nom, value: ingredient.nom };

    return (
        <div key={index} className="ingredients">
            <EditableCreatableSelect
                options={ingredientsData.map((ing) => ({
                    label: ing.label,
                    value: ing.label,
                }))}
                value={selectedIngredient}
                onChange={handleNameChange}
                placeholder="Choisir ou ajouter un ingrédient"
            />
            {eggDetector.test(ingredient.nom) && (
                <div className="nombre">
                    <button onClick={() => handleQuantityChange({ target: { value: ingredient.quantite - 58 } })}>-</button>
                    <b>{ingredient.nbEggs || 0}</b>
                    <button onClick={() => handleQuantityChange({ target: { value: ingredient.quantite + 58 } })}>+</button>
                </div>
            )}
            <input
                type="number"
                value={ingredient.quantite}
                placeholder="poid en gramme"
                onChange={handleQuantityChange}
            />
            <span className="unity">{ingredient.liquid ? "ml" : "gr"}</span>
            <span
                onClick={onDelete}
                title={t("suppressThisRecipe")}
                className="trash"
            >
                <BsTrash
                    alt={t("suppress")}
                    style={{ marginTop: "2px" }}
                    size="14px"
                />
            </span>
        </div>
    );
};

export default Ingredients;