import React, { Fragment, useState, useContext } from "react";
import Image from 'next/image';
import { PanemContext } from "../../store/centralrecipes";
import { eggDetector } from "../functions";
import { weightEgg } from '../utils/const';
import trashIcon from "../../style/trash.svg";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";

const eauDetector = new RegExp(/eau/im);

const Supp = ({ action, ingredient }) => {
  return (
    <button
      onClick={() => action(ingredient)}
      className="supprimer"
      title="retirer de la liste des produits"
    >
      <Image width="15" src={trashIcon} alt="supprimer" />
    </button>
  );
};

const formatQuantityWithEggs = (quantity) => {
  if (!eggDetector.test(quantity.nom)) return `${quantity.quantite} gr`;

  const nbEggsRaw = quantity.quantite / weightEgg;
  const nbEggs = Number.isInteger(nbEggsRaw)
    ? nbEggsRaw
    : nbEggsRaw.toFixed(1).replace(".", ",");
  return (
    <>
      {`${quantity.quantite} gr `}
      <span style={{ color: "#666" }}>
        {`(≃ ${nbEggs})`}
      </span>
    </>
  );
};

const FirstCol = ({ ingredient }) => {
  return <div className="base">{formatQuantityWithEggs(ingredient)}</div>;
};

const SecondCol = ({ ingredient, fonctions }) => {
  const { suppr, getWithcoef } = fonctions;

  const adjustedIngredient = {
    ...ingredient,
    quantite: getWithcoef(ingredient.quantite),
  };

  return (
    <div className="recette">
      {formatQuantityWithEggs(adjustedIngredient)}
      <Supp action={suppr} ingredient={ingredient} />
    </div>
  );
};

const QuantiteParIngredients = ({
  iteration,
  hydra,
  ingredient,
  fonctions,
}) => {

  const { recipes, totaldemande } = useContext(PanemContext);
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails((prev) => !prev);
  };

  let label = ingredient.nom;
  const recipeDetails = recipes.find((rec) => rec.titre === label);


  if (eauDetector.test(label)) {
    label = (
      <Fragment>
        {ingredient.nom}
        <span className="hydratation">({hydra}%)</span>
      </Fragment>
    );
  }

  const { getWithcoef } = fonctions;
  const adjustedIngredientQuantity = getWithcoef(ingredient.quantite);

  // Facteur d'ajustement pour les sous-ingrédients
  const adjustmentFactor = recipeDetails
    ? adjustedIngredientQuantity /
    recipeDetails.ingredientsbase.reduce((sum, ing) => sum + ing.quantite, 0)
    : 1;

  return (
    <Fragment>
      <li key={iteration}>
        <label className="ingredient-label" onClick={toggleDetails}>
          {label}
          {recipeDetails?.ingredientsbase?.length > 0 && (
            showDetails ? <BsChevronUp /> : <BsChevronDown />
          )}
        </label>
        <FirstCol ingredient={ingredient} />
        <div className="coef"></div>
        <SecondCol
          fonctions={fonctions}
          ingredient={ingredient}
        />
      </li>
      {(showDetails && recipeDetails?.ingredientsbase?.length > 0) && (
        <li key={`ingredient${iteration}`} className="sub-ingredients">
          <ul>
            {recipeDetails.ingredientsbase.map((subIngredient, i) => (
              <li key={i} className="sub-ingredient-item">
                <div>{subIngredient.nom}</div>
                <div className="base">{subIngredient.quantite}gr
                  {eauDetector.test(subIngredient.nom) && (
                    <span className="hydratation"> ({hydra}%)</span>
                  )}

                </div>
                <div className='coef' />
                <div className="recette">
                  {(subIngredient.quantite * adjustmentFactor).toFixed(2)} gr
                </div>
              </li>
            ))}
          </ul></li>
      )}
    </Fragment>
  );
};

export default QuantiteParIngredients;
