import React, { useContext } from "react";
import { PanemContext } from "../store/centralrecipes";
import { useTranslation } from "react-i18next";
import { BsTrash } from "react-icons/bs";
import Create from "./recipe/create.js";
// import "../style/styleRecipes.css";
import { FaDownload } from "react-icons/fa";
import { CgDanger } from "react-icons/cg";
import { loadRecipes } from './utils/functionsRecipes';

import { useCreateContext } from './recipe/CreateContext';

const Recipes = () => {

  const { i18n } = useTranslation();

  const {
    addRcp, setAddRcp,
  } = useCreateContext();

  const {
    setIndexSelected,
    indexSelected,
    recipes,
    removeOneRecipe,
    resetRecipesToDefault,
  } = useContext(PanemContext);

  const { t } = useTranslation();
  /* Just usefull for refresh the component when lang is changed */

  if (!recipes || recipes.length === 0) {
    return <div>...</div>;
  }

  const deleteRecipe = (e) => {
    const keyId = parseInt(e.currentTarget.dataset.index);
    if (window.confirm(t("areYouSureToSuppress"))) {
      removeOneRecipe(keyId);
    }
  };

  const recipe = [];

  if (recipes.length === 0) return;

  const addRecipe = () => {
    setAddRcp(!addRcp);
  };

  const reinitRecipe = () => {
    if (window.confirm(t("areYouSureToReinitRecipe"))) {
      resetRecipesToDefault();
    }
  };

  if (recipes.length === 0) return;

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
        <button onClick={() => addRecipe()} className="bt">
          {t("addRecipe")}
        </button>
        <button onClick={() => reinitRecipe()} className="bt">
          <CgDanger /> {t("reinitRecipe")}
        </button>
        <button onClick={() => loadRecipes(i18n)} className="bt">
          <FaDownload /> {t("exportRecipes")}
        </button>
      </menu>
      {addRcp && <Create addRcp={addRcp} setAddRcp={setAddRcp} />}
    </section>
  );
};

export default Recipes;
