import React, {
  Fragment,
  useState,
  useCallback,
  useContext,
  useMemo,
  useEffect,
} from "react";
import { PanemContext } from "../store/centralrecipes";
import "../style/styleIngredients.css";
import QuantiteParIngredients from "./ingredients/pesee";
import Entete from "./ingredients/header";
import { useTranslation } from "react-i18next";
import { roundTo, viennoiserieDetector } from "./functions.js";

const farineDetector = new RegExp(/farine/im);
const eauDetector = new RegExp(/eau/im);

const Ingredients = () => {
  const { recipedata, totaldemande } = useContext(PanemContext);

  const { t } = useTranslation();

  const [qtt, setQtt] = useState(recipedata);
  const [coef, setCoef] = useState(1);
  const [newName, setNewName] = useState("");
  const [newWeight, setNewWeight] = useState(0);
  const [percentHydra, setPercentHydra] = useState(0);
  const [addIgrd, setAddIgrd] = useState(false);
  const [detrempe, setDetrempe] = useState(0);

  const getWithcoef = (base) => {
    return roundTo(base * coef, 1);
  };

  const totalRecetteBase = useMemo(() => {
    return qtt.ingredientsbase.reduce((somme, ingredient) => {
      return somme + ingredient.quantite;
    }, 0);
  }, [qtt]);

  const addIngredient = () => {
    setAddIgrd(!addIgrd);
  };

  const setHydra = useCallback(() => {
    if (!qtt || !qtt.ingredientsbase) {
      setPercentHydra(0);
      return;
    }
    const totalFarine = qtt.ingredientsbase.reduce((somme, ingredient) => {
      if (farineDetector.test(ingredient.nom)) {
        return somme + ingredient.quantite;
      }
      return somme;
    }, 0);
    if (totalFarine === 0) {
      setPercentHydra(0);
      return;
    }
    const ingredientEau = qtt.ingredientsbase.find((ingredient) =>
      eauDetector.test(ingredient.nom)
    );
    if (!ingredientEau) {
      setPercentHydra(0);
      return;
    }
    const qttEau = ingredientEau.quantite;
    const percentHydratation = roundTo((qttEau * 100) / totalFarine, 0);
    setPercentHydra(percentHydratation);
  }, [qtt]);

  const updateData = useCallback(
    (quantite) => {
      let viennoiserie = quantite.ingredientsbase.find((el) =>
        viennoiserieDetector.test(el.nom)
      );
      if (!viennoiserie) setDetrempe(0);

      if (viennoiserie) {
        const qttBeurreSec = quantite.ingredientsbase.find((el) =>
          viennoiserieDetector.test(el.nom)
        ).quantite;
        const poidProduitFinal = quantite.ingredientsbase.reduce(
          (somme, ingredient) => {
            return (somme = somme + ingredient.quantite);
          },
          0
        );
        const poidDetrempe = poidProduitFinal - qttBeurreSec;
        setDetrempe(poidDetrempe);
        setQtt(quantite);
        setHydra();
      } else {
        setQtt(quantite);
        setHydra();
      }
    },
    [setHydra]
  );

  useEffect(() => {
    updateData(recipedata);
    if (totaldemande === 0 && totalRecetteBase === 0) {
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

  return (
    <Fragment>
      {qtt && (
        <section>
          <div className="ingredients">
            <ul>
              <Entete />
              {qtt.ingredientsbase.map((ingredient, i) => (
                <QuantiteParIngredients
                  detrempe={detrempe}
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
