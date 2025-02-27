import React, { useContext } from "react";
import { BsTrash } from "react-icons/bs";
import EditableCreatableSelect from "../create/EditableCreatableSelect";
import { useTranslation } from "react-i18next";
import { eggDetector } from "../../functions";
import { PanemContext } from "../../../store/centralrecipes";
import { IngredientsContext } from "../../../store/centralIngredients";
import styles from "../../../style/styleEdit.module.css";
import { weightEgg } from '../../utils/const';
import { TbRulerMeasure } from "react-icons/tb";

const Ingredients = ({ index, ingredient, onUpdate, onDelete }) => {
    const { ingredientsData } = useContext(IngredientsContext);
    const { recipes } = useContext(PanemContext);
    const { t } = useTranslation();

    const isRecipe = recipes.some((recipe) => recipe.titre === ingredient.nom);

    const handleQuantityChange = (e) => {
        const newQuantity = Number(e.target.value);
        const updatedIngredient = {
            ...ingredient,
            quantite: newQuantity,
        };

        if (eggDetector.test(ingredient.nom)) {
            updatedIngredient.nbEggs = Math.round(newQuantity / weightEgg);
        }

        onUpdate(updatedIngredient);
    };

    const handleNameChange = (selectedOption) => {
        onUpdate({
            ...ingredient,
            nom: selectedOption ? selectedOption.value : "",
        });
    };

    if (eggDetector.test(ingredient.nom) && ingredient.nbEggs === undefined) {
        ingredient.nbEggs = Math.round(ingredient.quantite / weightEgg);
    }

    const selectedIngredient = ingredientsData.find(
        (option) => option.label === ingredient.nom
    ) || { label: ingredient.nom, value: ingredient.nom };

    return (
        <div key={index} className={`ingredients ${isRecipe ? 'recipeExisting' : ""}`}>
            <EditableCreatableSelect
                options={ingredientsData.map((ing) => ({
                    label: ing.label,
                    value: ing.label,
                }))}
                isRecipe={isRecipe}
                value={selectedIngredient}
                onChange={handleNameChange}
                placeholder="Choisir ou ajouter un ingrédient"
            />
            {eggDetector.test(ingredient.nom) && (
                <div className={styles.plus}>
                    <button type="button" onClick={() => handleQuantityChange({ target: { value: ingredient.quantite - 58 } })}>-</button>
                    <b> {ingredient.nbEggs || 0} </b>
                    <button type="button" onClick={() => handleQuantityChange({ target: { value: ingredient.quantite + 58 } })}>+</button>
                </div>
            )}

            <input
                type="number"
                value={ingredient.quantite}
                placeholder="poid en gramme"
                onChange={handleQuantityChange}
            />
            <span className="unity">{ingredient.liquid ? "ml" : "gr"}</span>
            <TbRulerMeasure />

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