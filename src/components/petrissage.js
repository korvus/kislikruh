import React, { useContext } from "react";
import { PanemContext } from "../store/centralrecipes";
import "../style/stylePetrissage.css";

const Recipes = () => {
  const { recipedata } = useContext(PanemContext);

  if (!recipedata || recipedata.pieces.length === 0) return;

  return <p className="petrissage">{recipedata.petrissage}</p>;
};

export default Recipes;
