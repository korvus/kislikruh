import Recipes from "./recipes.js";
import Pieces from "./pieces.js";
import Ingredients from "./ingredients.js";
import Menu from "./menu.js";
import Petrissage from "./petrissage.js";
import Temperature from "./temperature.js";
// import { PanemContext } from "../store/recipes";

function Proportions() {
  return (
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
  );
}

export default Proportions;
