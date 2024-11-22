import React, { useContext } from "react";
import { PanemContext } from "../store/centralrecipes";
import Recipes from "./recipes.js";
import Pieces from "./pieces.js";
import Ingredients from "./ingredients.js";
import Menu from "./menu.js";
import Petrissage from "./petrissage.js";
import Temperature from "./temperature.js";
import { CreateProvider } from './recipe/CreateContext';

function Proportions() {

  const { recipes, isLoading } = useContext(PanemContext);

  if (isLoading || !recipes || recipes.length === 0) {
    return <div className="App">loading...</div>;
  }

  return (
    <CreateProvider>
      <div className="App">
        <section className="menu">
          <Menu page="proportions" />
        </section>
        <section className="etalon">
          <Recipes />
        </section>
        <section className="pieces">
          <Pieces />
        </section>
        <section className="ingredients">
          <Ingredients />
        </section>
        <section className="timing">
          <Petrissage />
        </section>
        <section className="temperature">
          <Temperature />
        </section>
      </div>
    </CreateProvider>
  );
}

export default Proportions;
