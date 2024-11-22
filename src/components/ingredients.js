import React, {
  Fragment,
  useState,
  useCallback,
  useContext,
  useMemo,
  useEffect,
} from "react";

import { PanemContext } from "../store/centralrecipes";
import { IngredientsContext } from "../store/centralIngredients";
import QuantiteParIngredients from "./ingredients/pesee";
import PieChartComponent from "./ingredients/pie";
import Entete from "./ingredients/header";
import { useTranslation } from "react-i18next";
import { roundTo, farineDetector, liquidDetector } from "./functions.js";
// import ingredientsData from "../data/dataIngredients_fr.json";

const Ingredients = () => {
  const { recipedata, totaldemande } = useContext(PanemContext);
  const { ingredientsData } = useContext(IngredientsContext);

  const { t } = useTranslation();

  const [qtt, setQtt] = useState(recipedata);
  const [coef, setCoef] = useState(1);
  const [newName, setNewName] = useState("");
  const [newWeight, setNewWeight] = useState(0);
  const [addIgrd, setAddIgrd] = useState(false);
  const [percentHydra, setPercentHydra] = useState(0);
  const [percentHydraEffective, setPercentHydraEffective] = useState(0);

  const getWithcoef = (base) => {
    // return roundTo(base * coef, 1);
    return Math.round(base * coef * 10) / 10;
  };

  const totalRecetteBase = useMemo(() => {
    return qtt.ingredientsbase.reduce((somme, ingredient) => {
      return somme + ingredient.quantite;
    }, 0);
  }, [qtt]);

  const addIngredient = () => {
    setAddIgrd(!addIgrd);
  };

  const findIngredientData = (name) => {
    return ingredientsData.find((ingredient) => ingredient.label.toLowerCase() === name.toLowerCase());
  };

  const setHydra = useCallback(() => {

    // Calcul hydratation boulangère
    if (!qtt || !qtt.ingredientsbase) {
      setPercentHydra(0);
      setPercentHydraEffective(0);
      return;
    }

    const totalFarine = qtt.ingredientsbase.reduce((somme, ingredient) => {
      if (farineDetector.test(ingredient.nom)) {
        return somme + ingredient.quantite;
      }
      return somme;
    }, 0);

    const ingredientEau = qtt.ingredientsbase.find((ingredient) =>
      liquidDetector.test(ingredient.nom)
    );

    if (!ingredientEau) {
      setPercentHydra(0);
    } else {
      const qttEau = ingredientEau.quantite;
      const percentHydratation = roundTo((qttEau * 100) / totalFarine, 0);
      setPercentHydra(percentHydratation);
    }

    if (totalFarine === 0) {
      setPercentHydra(0);
    }

    // Calcul hydratation effective
    const totalEau = qtt.ingredientsbase.reduce((somme, ingredient) => {
      const ingredientData = findIngredientData(ingredient.nom);
      if (ingredientData && ingredientData.hydratation) {
        return somme + (ingredientData.hydratation / 100) * ingredient.quantite;
      }
      return somme;
    }, 0);

    const totalIngredients = qtt.ingredientsbase.reduce((somme, ingredient) => {
      return somme + ingredient.quantite;
    }, 0);

    const percentHydratationEffective = Math.round((totalEau * 100) / totalIngredients);
    setPercentHydraEffective(percentHydratationEffective);

  }, [qtt]);

  const updateData = useCallback(
    (quantite) => {
      setQtt(quantite);
      setHydra();
    },
    [setHydra]
  );

  useEffect(() => {
    updateData(recipedata);
    if (totaldemande === 0 && qtt.ingredientsbase.length === 0) {
      setCoef(1);
    } else {
      setCoef(roundTo(totaldemande / totalRecetteBase, 2));
    }
  }, [qtt, updateData, recipedata, totalRecetteBase, totaldemande]);

  const suppr = (piece) => {
    for (var i = 0; i < qtt.ingredientsbase.length; i++) {
      if (qtt.ingredientsbase[i].nom === piece.nom) {
        delete qtt.ingredientsbase[i];
        break;
      }
    }
    setQtt({ ...qtt });
  };

  const handleNewName = (e) => {
    setNewName(e.target.value);
  };

  const handleNewWeight = (e) => {
    setNewWeight(parseInt(e.target.value));
  };

  const setNewIngrd = () => {
    let newingredient = {
      nom: newName,
      quantite: newWeight,
    };
    qtt.ingredientsbase.push(newingredient);
    setAddIgrd(!addIgrd);
    setQtt({ ...qtt });
  };

  const getDefaultColor = (index) => {
    // Génère une variation de gris ou de brun
    const shades = ['#e8dec8', '#8B4513', '#D3D3D3', '#A52A2A', '#C0C0C0'];
    return shades[index % shades.length];
  };

  const chartData = recipedata.ingredientsbase.map((ingredient, index) => {
    const ingredientData = ingredientsData.find((ing) => ing.label.toLowerCase() === ingredient.nom.toLowerCase());
    return {
      name: ingredient.nom,
      value: ingredient.quantite,
      color: ingredientData?.color || getDefaultColor(index)
    }
  });

  return (
    <Fragment>
      {qtt && (
        <section>
          <div className="ingredients">
            <ul>
              <Entete />
              {qtt.ingredientsbase.map((ingredient, i) => (
                <QuantiteParIngredients
                  hydra={percentHydra}
                  key={i}
                  iteration={i}
                  ingredient={ingredient}
                  fonctions={{ getWithcoef, suppr }}
                />
              ))}
              <li className="total">
                <label>Total</label>
                <div className="base">
                  <b>{totalRecetteBase}</b>gr
                </div>
                <div className="coef">{coef}</div>
                <div>
                  <b>{totaldemande}</b>gr
                </div>
              </li>
              <li className="hydratationLine">
                <label>Hydratation</label>
                <div className="base">
                  <span><b>Hydratation boulangére : {percentHydra}</b>% {/* Pourcentage d'hydratation */}</span>
                  <span><b>Hydratation effective  : {percentHydraEffective}</b>%</span>
                </div>
                <div className="expanded">
                  <PieChartComponent data={chartData} />
                </div>
              </li>
              <li className={`${addIgrd ? "hide" : "addIngredient"}`}>
                <div>
                  <button onClick={() => addIngredient()} className="bt">
                    {t("addIngredient")}
                  </button>
                </div>
              </li>
            </ul>
            <div className={`formAddPrd ${addIgrd ? "" : "hide"}`}>
              <fieldset>
                <label>Nom de l'ingredient</label>
                <input
                  type="text"
                  id="title"
                  value={newName}
                  onChange={handleNewName}
                ></input>
              </fieldset>
              <fieldset>
                <label>
                  Poid dans la recette de base (pour 1000gr de farine)
                </label>
                <input
                  value={newWeight}
                  type="number"
                  id="poid"
                  onChange={handleNewWeight}
                ></input>
              </fieldset>
              <input
                onClick={() => setNewIngrd()}
                type="submit"
                className="submit"
                value="Ajouter"
              />
              <span onClick={() => setAddIgrd(false)}>Annuler</span>
            </div>
          </div>
        </section>
      )}
    </Fragment>
  );
};

export default Ingredients;
