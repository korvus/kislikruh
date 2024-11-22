import React, { Fragment } from "react";
import Image from 'next/image';
import trashIcon from "../../style/trash.svg";
import { viennoiserieDetector } from "./../functions.js";

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

const FirstCol = ({ ingredient, ingredientType }) => {
  return <div className="base">{ingredient.quantite}</div>;
};

const SecondCol = ({ ingredient, fonctions }) => {
  const { suppr, getWithcoef } = fonctions;
  return (
    <div className="recette">
      {getWithcoef(ingredient.quantite)}
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
  let ingredientType = "undefined";
  if (ingredient.type !== undefined) {
    if (ingredient.type === "petrisse") ingredientType = "petrisse";
    if (ingredient.type === "global") ingredientType = "global"; // Farine non divisée
    if (ingredient.type === "double") ingredientType = "double";
  }

  let label = ingredient.nom;
  if (eauDetector.test(label)) {
    label = (
      <Fragment>
        {ingredient.nom}
        <span className="hydratation">({hydra}%)</span>
      </Fragment>
    );
  }

  return (
    <li key={iteration}>
      <label>{label}</label>
      <FirstCol ingredientType={ingredientType} ingredient={ingredient} />
      <div className="coef"></div>
      <SecondCol
        fonctions={fonctions}
        ingredientType={ingredientType}
        ingredient={ingredient}
      />
    </li>
  );
};

export default QuantiteParIngredients;
