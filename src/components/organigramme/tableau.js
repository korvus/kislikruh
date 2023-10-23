import React, { Fragment, useState, useContext } from "react";
import datarecipes from "../../store/datarecipes.json";
import { PanemContext } from "../../store/selectedrecipes.js";
import Legend from "./legend";
import "../../style/tableau.css";

const getAlreadyRegistred = () => {
  let newExisting = datarecipes;
  if (localStorage.getItem("panemportions-recipes") !== null) {
    newExisting = newExisting.concat(
      JSON.parse(localStorage.getItem("panemportions-recipes")).recipes
    );
  }
  return newExisting;
};

const recipeInsideStorage = getAlreadyRegistred();

const Recipes = () => {
  const {
    listSelected,
    nbHeures,
    // setDisplayModalChoices,
    listSchedule,
    initSchedule,
  } = useContext(PanemContext);
  const [hourselected, setHourselected] = useState(-1);
  const [recipeselected, setRecipeselected] = useState(-1);
  const [hourhovered, setHourhovered] = useState(-1);
  const [recipehovered, setRecipehovered] = useState(-1);
  const [stateSelection, setStateSelection] = useState(false);

  /* Just usefull for refresh the component when lang is changed */
  const recipe = [];
  const entete = [];

  const startselect = (hour, recipeIndex) => {
    // console.log(setHourselected);
    setHourselected(hour);
    setRecipeselected(recipeIndex);
    setStateSelection(true);
  };

  const selecthover = (hour, recipeIndex) => {
    setHourhovered(hour);
    setRecipehovered(recipeIndex);
  };

  const endSelect = (hour, recipeIndex) => {
    setStateSelection(false);
    // setDisplayModalChoices(true);
    initSchedule(hourselected, hour, recipeIndex);
    // console.log("stateSelection", stateSelection);
  };

  const funcIsSelected = (quarter, recipe) => {
    if (stateSelection) {
      if (quarter === hourselected && recipe === recipeselected) {
        return "active";
      }
      if (recipehovered === recipe && recipehovered === recipeselected) {
        if (hourhovered > hourselected) {
          if (quarter < hourhovered && quarter > hourselected) {
            return "active";
          }
        }
        if (hourhovered < hourselected) {
          if (quarter > hourhovered && quarter < hourselected) {
            return "active";
          }
        }
      }
    }
    return "";
  };

  for (let a = 0; a < listSelected.length; a++) {
    const title = `${recipeInsideStorage[listSelected[a]].titre} :`;

    // console.log("nbHeures", nbHeures);
    const arrHours = new Array(nbHeures).fill(["", "", "", ""]);

    recipe.push(
      <li className="line" key={`implementation${a}`}>
        <span
          data-index={a}
          role="presentation"
          title={title}
          className="recipe"
        >
          <b>{recipeInsideStorage[listSelected[a]].titre}</b>
        </span>
        {arrHours.map((d, i) => (
          <div key={`imp${a}${i}`} className={`hour hour${i}`}>
            {listSchedule[a] !== undefined && (
              <Fragment>
                <div
                  onMouseUp={() => {
                    endSelect(i * 4 + 0, a);
                  }}
                  onMouseDown={() => {
                    startselect(i * 4 + 0, a);
                  }}
                  onMouseMove={() => {
                    selecthover(i * 4 + 0, a);
                  }}
                  className={`quarter first ${funcIsSelected(i * 4 + 0, a)} step-${listSchedule[a][(i*4)+0] === "?" ? "_" : listSchedule[a][(i*4)+0]}`}
                >
                  {listSchedule[a][(i*4)+0]}
                </div>
                <div
                  onMouseUp={() => {
                    endSelect(i * 4 + 1, a);
                  }}
                  onMouseDown={() => {
                    startselect(i * 4 + 1, a);
                  }}
                  onMouseMove={() => {
                    selecthover(i * 4 + 1, a);
                  }}
                  className={`quarter second ${funcIsSelected(i * 4 + 1, a)} step-${listSchedule[a][(i*4)+1] === "?" ? "_" : listSchedule[a][(i*4)+1]}`}
                >
                  {listSchedule[a][(i*4)+1]}
                </div>
                <div
                  onMouseUp={() => {
                    endSelect(i * 4 + 2, a);
                  }}
                  onMouseDown={() => {
                    startselect(i * 4 + 2, a);
                  }}
                  onMouseMove={() => {
                    selecthover(i * 4 + 2, a);
                  }}
                  className={`quarter third ${funcIsSelected(i * 4 + 2, a)} step-${listSchedule[a][(i*4)+2] === "?" ? "_" : listSchedule[a][(i*4)+2]}`}
                >
                  {listSchedule[a][(i*4)+2]}
                </div>
                <div
                  onMouseUp={() => {
                    endSelect(i * 4 + 3, a);
                  }}
                  onMouseDown={() => {
                    startselect(i * 4 + 3, a);
                  }}
                  onMouseMove={() => {
                    selecthover(i * 4 + 3, a);
                  }}
                  className={`quarter last ${funcIsSelected(i * 4 + 3, a)} step-${listSchedule[a][(i*4)+3] === "?" ? "_" : listSchedule[a][(i*4)+3]}`}
                >
                  {listSchedule[a][(i*4)+3]}
                </div>
              </Fragment>
            )}
          </div>
        ))}
      </li>
    );
  }

  const hoursEntete = new Array(nbHeures).fill("");
  let b = 0;
  entete.push(
    <li key={b + 1} className="line entete">
      <span>
        <b></b>
      </span>
      {hoursEntete.map((d, i) => (
        <div key={`entete${i}${b}`} className="hourentete">
          {i + 1}h
        </div>
      ))}
    </li>
  );

  return (
    <Fragment>
      {listSelected.length > 0 && (
        <section className="existing">
          <ul className="selected">
            {entete}
            {recipe}
          </ul>
        </section>
      )}
      {listSelected.length === 0 && (
        <div className="none">
          Pas de recettes sélectionnées. Cochez les recettes que vous voulez
          planifier.
        </div>
      )}
      <Legend />
    </Fragment>
  );
};

export default Recipes;
