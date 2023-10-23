import React, { Fragment, useContext, useState, useEffect } from "react";
// import datarecipes from "../store/datarecipes.json";
import { PanemContext } from "../store/centralrecipes";
import "../style/styleTemperature.css";

/*
const getAlreadyRegistred = () => {
    let newExisting = datarecipes;
    if(localStorage.getItem("panemportions-recipes") !== null){
        newExisting = newExisting.concat(JSON.parse(localStorage.getItem("panemportions-recipes")).recipes);
    }
    return newExisting;
}
*/

const Temperature = () => {
  const [tBase, setTBase] = useState(undefined);
  const [tFournil, setTFournil] = useState(25);
  const [tFarine, setTFarine] = useState(25);
  const [tEau, setTEau] = useState(0);
  const [tPate, setTPate] = useState(undefined);

  const { recipedata } = useContext(PanemContext);

  const setBase = (rdbase) => {
    if (rdbase !== undefined) setTBase(rdbase);
    // Est utile lorsqu'on switch de recette, il faut redefinir a undefined.
    if (rdbase === undefined) setTBase(undefined);
  };

  const changeTFournil = (degre, direction) => {
    const temperature = degre + direction;
    setTFournil(temperature);
  };

  const changeTFarine = (degre, direction) => {
    const temperature = degre + direction;
    setTFarine(temperature);
  };

  useEffect(() => {
    const calculTeau = () => {
      const tmpBase = tBase === undefined ? 0 : tBase;
      const o = tmpBase - (tFarine + tFournil);
      setTEau(o);
    };
    calculTeau();
  }, [tBase, tFarine, tFournil]);

  useEffect(() => {
    setBase(recipedata.tbase);
    setTPate(recipedata.tpate);

    // setTEau()
  }, [recipedata]);

  const IsTemperatureDeBase = () => {
    if (tBase === undefined) {
      return (
        <Fragment>
          <p className="warning">
            Il n'y a pas de température de base actuellement définit.
          </p>
          <button
            onClick={() => alert("feature a développer")}
            className="definirTemperatureBase"
          >
            Définir une température de base
          </button>
        </Fragment>
      );
    } else {
      return (
        <ul className="temperatures">
          <li className="tbase">Température de base : {tBase}°</li>
          <li>
            Température de fournil : {tFournil}°
            <button onClick={() => changeTFournil(tFournil, -1)}>-</button>
            <button onClick={() => changeTFournil(tFournil, 1)}>+</button>
          </li>
          <li>
            Température de farine : {tFarine}°
            <button onClick={() => changeTFarine(tFarine, -1)}>-</button>
            <button onClick={() => changeTFarine(tFarine, 1)}>+</button>
          </li>
          <li>
            Température de l'eau : <span className="eau">{tEau}</span>°
          </li>
          {tPate === undefined ? (
            <li className="tpate">Température de pâte non définie</li>
          ) : (
            <li className="tpate">
              Température de pâte : <span>{tPate}°</span>
            </li>
          )}
        </ul>
      );
    }
  };

  return <IsTemperatureDeBase />;
};

export default Temperature;
