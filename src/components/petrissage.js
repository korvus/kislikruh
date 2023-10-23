import React, { useContext } from "react";
import { PanemContext } from "../store/centralrecipes";
import "../style/stylePetrissage.css";

const Recipes = () => {
  const { recipedata } = useContext(PanemContext);

  return <p className="petrissage">{recipedata.petrissage}</p>;
};

export default Recipes;
