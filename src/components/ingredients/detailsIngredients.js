import React, { useContext } from "react";
import { IngredientsContext } from "../../store/centralIngredients";

import { LuBookPlus, LuBook } from "react-icons/lu";

export const smartRound = (value) => {
    if (value < 10) {
        return (Math.round(value * 10) / 10).toFixed(1);
    } else {
        return Math.round(value).toFixed(0);
    }
};

const Infos = ({ action, ingredient }) => {
    const { ingredientsData } = useContext(IngredientsContext);

    // Recherche de l’ingrédient dans la liste
    const ingredientData = ingredientsData.find(
        (item) => item.label.toLowerCase() === ingredient.nom.toLowerCase()
    );

    return (
        <button
            onClick={() => action(ingredient)}
            className="supprimer"
            title="retirer de la liste des produits"
        >
            {ingredientData ? <LuBook /> : <LuBookPlus />}
        </button>
    );
};

export const formatQuantityWithUnits = (quantity, ingredientsData) => {

    const ingredientData = ingredientsData.find(
        (item) => item.label.toLowerCase() === quantity.nom.toLowerCase()
    );

    const referenceWeight = ingredientData?.poid;
    if (!referenceWeight) return `${quantity.quantite} gr`;

    const nbUnitsRaw = quantity.quantite / referenceWeight;
    const nbUnits = Number.isInteger(nbUnitsRaw)
        ? nbUnitsRaw
        : nbUnitsRaw.toFixed(1).replace(".", ",");
    return (
        <>
            {`${quantity.quantite} gr `}
            <span style={{ color: "#666" }}>
                {`(≃ ${nbUnits})`}
            </span>
        </>
    );
};

export const FirstCol = ({ ingredient }) => {
    const { ingredientsData } = useContext(IngredientsContext);
    return <div className="base">{formatQuantityWithUnits(ingredient, ingredientsData)}</div>;
};

export const SecondCol = ({ ingredient, fonctions, onToggleInfo, isIngredientRecipe }) => {
    const { ingredientsData } = useContext(IngredientsContext);

    const { getWithcoef } = fonctions;


    const adjustedIngredient = {
        ...ingredient,
        quantite: smartRound(getWithcoef(ingredient.quantite)),
    };

    return (
        <div className="recette">
            {formatQuantityWithUnits(adjustedIngredient, ingredientsData)}
            {!isIngredientRecipe && <Infos action={onToggleInfo} ingredient={ingredient} />}
        </div>
    );
};
