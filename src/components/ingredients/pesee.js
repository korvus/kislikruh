import React, { Fragment, useEffect, useState, useContext } from "react";
// import Image from 'next/image';
import { IngredientsContext } from "../../store/centralIngredients";
import { PanemContext } from "../../store/centralrecipes";
import { liquidDetector } from "../functions";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { IoLink } from "react-icons/io5";
import { RiCloseFill } from "react-icons/ri";
import { formatQuantityWithUnits, smartRound, SecondCol, FirstCol } from './detailsIngredients';
import RenderIngredientProperties from './RenderIngredientProperties';



const QuantiteParIngredients = ({
  iteration,
  hydra,
  ingredient,
  fonctions,
}) => {
  const { ingredientsData } = useContext(IngredientsContext);
  const { recipes, indexSelected, setIndexSelected } = useContext(PanemContext);
  const { getWithcoef } = fonctions;
  const [showDetails, setShowDetails] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const toggleDetails = () => {
    setShowDetails((prev) => !prev);
  };

  const ingredientData = ingredientsData.find(
    (item) => item.label.toLowerCase() === ingredient.nom.toLowerCase()
  );

  const toggleInfo = () => {
    setShowInfo((prev) => !prev);
  };

  const handleRecipeClick = () => {
    if (recipeDetails) {
      const recipeIndex = recipes.indexOf(recipeDetails);
      if (recipeIndex !== -1) {
        setIndexSelected(recipeIndex);
      }
    }
  };

  let label = ingredient.nom;
  const recipeDetails = recipes.find((rec) => rec.titre === label);

  if (liquidDetector.test(label)) {
    label = (
      <Fragment>
        {ingredient.nom}
        {hydra !== 0 && <span className="hydratation">({hydra}%)</span>}
      </Fragment>
    );
  }

  useEffect(() => {
    setShowInfo(false); // Ferme tous les panneaux d'informations quand la recette change
  }, [indexSelected]);

  const adjustedIngredientQuantity = getWithcoef(ingredient.quantite);

  const adjustmentFactor = recipeDetails
    ? adjustedIngredientQuantity /
    recipeDetails.ingredientsbase.reduce((sum, ing) => sum + ing.quantite, 0)
    : 1;

  const ingredientIsRecipe = recipeDetails?.ingredientsbase?.length > 0;

  return (
    <Fragment>
      <li className={`infoBase ${showInfo ? 'open' : ''}`} key={iteration}>
        <label className={`ingredient-label ${ingredientIsRecipe && 'deployable'}`}>
          <span onClick={toggleDetails}>{label}
            <span>{ingredientIsRecipe && (
              showDetails ? <BsChevronUp /> : <BsChevronDown />
            )}
            </span>
          </span>
        </label>
        <FirstCol ingredient={ingredient} />
        <div className="coef"></div>
        <SecondCol fonctions={fonctions} isIngredientRecipe={ingredientIsRecipe} ingredient={ingredient} onToggleInfo={toggleInfo} />
      </li>
      {showInfo && (
        <li key={`ingredient${iteration}`} className='infos-ingredients'>
          <RenderIngredientProperties data={ingredientData} ingredient={ingredient.nom} />
          <RiCloseFill className="close" onClick={toggleInfo} />
        </li>)}
      {(showDetails && recipeDetails?.ingredientsbase?.length > 0) && (
        <li key={`recette${iteration}`} className="sub-ingredients">
          <ul>
            <li className="sub-ingredient-item access-recipe"><span className='lienRecette' onClick={handleRecipeClick}><IoLink />Accéder à la recette</span></li>
            {recipeDetails.ingredientsbase.map((subIngredient, i) => (
              <li key={`sousingredients${i}`} className="sub-ingredient-item">
                <div>{subIngredient.nom}</div>
                <div className="base subrecipe">
                  {subIngredient.quantite} gr
                </div>
                <div className="coef" />
                <div className="recette">
                  {
                    formatQuantityWithUnits({
                      ...subIngredient,
                      quantite: smartRound(subIngredient.quantite * adjustmentFactor),
                    }, ingredientsData)}
                </div>
              </li>
            ))}
          </ul>
        </li >
      )}
    </Fragment >
  );
};




export default QuantiteParIngredients;
