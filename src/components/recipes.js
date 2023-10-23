import React, { useState, useContext } from "react";
import { PanemContext } from "../store/centralrecipes";
import { useTranslation } from "react-i18next";
import { BsTrash } from "react-icons/bs";
import Create from "./recipe/create.js";
import "../style/styleRecipes.css";

const Recipes = () => {
  const { setIndexSelected, indexSelected, recipes, removeOneRecipe } =
    useContext(PanemContext);
  const [addRcp, setAddRcp] = useState(false);

  const { t } = useTranslation();
  /* Just usefull for refresh the component when lang is changed */

  const deleteRecipe = (e) => {
    const keyId = parseInt(e.currentTarget.dataset.index);
    if (window.confirm("Êtes vous sûr de vouloir supprimer ?")) {
      removeOneRecipe(keyId);
    }
  };

  const recipe = [];

  if (recipes.length === 0) return;

  const addIngredient = () => {
    setAddRcp(!addRcp);
  };

  const reinitRecipe = () => {
    if (window.confirm(t("areYouSureToReinitRecipe"))) {
      console.log("reinitRecipe");
    }
  };

  for (let a = 0; a < recipes.length; a++) {
    const title = `${recipes[a].titre} :`;

    recipe.push(
      <li className={`recipe${indexSelected === a ? " active" : " "}`} key={a}>
        <span
          data-index={a}
          role="presentation"
          className="recipe"
          title={title}
        >
          <span
            onClick={() => {
              setIndexSelected(a);
            }}
          >
            {recipes[a].titre}
          </span>
          {recipes[a].editable && (
            <span
              data-index={a}
              role="presentation"
              onClick={(e) => deleteRecipe(e)}
              title={t("suppressThisRecipe")}
              className="trash"
            >
              <BsTrash
                alt={t("suppress")}
                style={{ marginTop: "2px" }}
                size="14px"
              />
            </span>
          )}
        </span>
        <div className="moreinfos">
          {recipes[a].pieces &&
            recipes[a].pieces.map((piece, index) => (
              <span key={index}>
                ▶ {piece.nombre} {piece.titre} de {piece.poid}gr
              </span>
            ))}
        </div>
      </li>
    );
  }

  return (
    <section className="existing existingrecipes">
      {recipes.length > 0 && <ul className="recipes">{recipe}</ul>}
      <menu>
        <button onClick={() => addIngredient()} className="bt">
          {t("addRecipe")}
        </button>
        <button onClick={() => reinitRecipe()} className="bt">
          {t("reinitRecipe")}
        </button>
      </menu>
      <Create addRcp={addRcp} setAddRcp={setAddRcp} />
    </section>
  );
};

export default Recipes;
