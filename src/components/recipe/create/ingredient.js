import React, { useContext } from 'react';
import { BsTrash } from "react-icons/bs";
import EditableCreatableSelect from './EditableCreatableSelect';
import { useTranslation } from "react-i18next";
import { eggDetector } from "../../functions";
import { useCreateContext } from '../CreateContext';
import { IngredientsContext } from "../../../store/centralIngredients";


const Ingredients = ({ index, ingredient }) => {

    const { setTotalWeightIngredients, ingredientsbase, setIngredientsBase } = useCreateContext();
    // const { recipes } = useContext(PanemContext);
    const { ingredientsData } = useContext(IngredientsContext);

    const { t } = useTranslation();

    const generateNewWeight = (newIngredients) => {
        const newWeight = newIngredients.reduce(
            (acc, ingredient) => acc + ingredient.quantite,
            0
        );
        setTotalWeightIngredients(newWeight);
    };


    const handleIngredientQuantityChange = (index, e) => {
        const newIngredients = [...ingredientsbase];
        const newQuantity = Number(e.target.value);
        newIngredients[index].quantite = Number(e.target.value);

        // Mettre à jour nbEggs si l'ingrédient est un œuf
        if (eggDetector.test(newIngredients[index].nom)) {
            const eggWeight = 50;
            newIngredients[index].nbEggs = Math.round(newQuantity / eggWeight);
        }

        generateNewWeight(newIngredients);
        setIngredientsBase(newIngredients);
    };

    const changeNbEggs = (direction, index) => {
        setIngredientsBase((currentIngredients) => {
            const newIngredients = currentIngredients.map((ingredient, idx) => {
                if (idx === index && eggDetector.test(ingredient.nom)) {
                    const newNbEggs = Math.max(0, (ingredient.nbEggs || 0) + direction);
                    return {
                        ...ingredient,
                        nbEggs: newNbEggs,
                        quantite: newNbEggs * 58
                    };
                }
                return ingredient;
            });

            generateNewWeight(newIngredients);
            return newIngredients;
        });
    };

    const deleteIngredient = (index) => {
        const newIngredients = ingredientsbase.filter((_, idx) => idx !== index);
        setIngredientsBase(newIngredients);
    };

    const handleIngredientNameChange = (index, selectedOption) => {
        const newIngredients = ingredientsbase.map((ingredient, idx) => {
            if (idx === index) {
                return {
                    ...ingredient,
                    nom: selectedOption ? selectedOption.value : "",
                };
            }
            return ingredient;
        });

        setIngredientsBase(newIngredients);
    };

    const selectedIngredient = ingredientsData.find(
        (option) => option.label === ingredient.nom
    ) || { label: ingredient.nom, value: ingredient.nom };

    return (
        <div key={index} className="ingredients">
            <EditableCreatableSelect
                options={ingredientsData.map(ing => ({ label: ing.label, value: ing.label }))}
                value={selectedIngredient}
                onChange={(e) => handleIngredientNameChange(index, e)}
                placeholder="Choisir ou ajouter un ingrédient"
            />
            {eggDetector.test(ingredient.nom) && (
                <div className="nombre">
                    {" "}
                    <button onClick={() => changeNbEggs(-1, index)}>-</button>
                    <b>{ingredient.nbEggs}</b>
                    <button onClick={() => changeNbEggs(1, index)}>+</button>
                </div>
            )}
            <input
                type="number"
                value={ingredient.quantite}
                placeholder="poid en gramme"
                onChange={(e) => handleIngredientQuantityChange(index, e)}
            ></input>
            <span className="unity">{ingredient.liquid ? "ml" : "gr"}</span>
            <span
                onClick={() => deleteIngredient(index)}
                title={t("suppressThisRecipe")}
                className="trash"
            >
                <BsTrash
                    alt={t("suppress")}
                    style={{ marginTop: "2px" }}
                    size="14px"
                />
            </span>
        </div>);
};

export default Ingredients;