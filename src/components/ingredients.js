import React, {
    Fragment,
    useCallback,
    useContext,
    useMemo,
    useEffect,
    useState,
} from "react";

import { PanemContext } from "../store/centralrecipes";
import { IngredientsContext } from "../store/centralIngredients";
import QuantiteParIngredients from "./ingredients/pesee";
// import PieChartComponent from "./ingredients/pie";
import BarChartComponent from './ingredients/barchart';
import Entete from "./ingredients/header";
import { useTranslation } from "react-i18next";
import { roundTo, farineDetector, liquidDetector } from "./functions.js";

const Ingredients = () => {
    const { recipedata, totaldemande, updateRecipeData, recipes } = useContext(PanemContext);
    const { ingredientsData } = useContext(IngredientsContext);

    const { t } = useTranslation();

    const [coef, setCoef] = useState(1);
    const [newName, setNewName] = useState("");
    const [newWeight, setNewWeight] = useState(0);
    const [addIgrd, setAddIgrd] = useState(false);
    const [percentHydra, setPercentHydra] = useState(0);
    const [percentHydraEffective, setPercentHydraEffective] = useState(0);


    const getWithcoef = (base) => {
        return Math.round(base * coef * 10) / 10;
    };

    const totalRecetteBase = useMemo(() => {
        return recipedata.ingredientsbase.reduce((somme, ingredient) => {
            return somme + ingredient.quantite;
        }, 0);
    }, [recipedata]);


    const findIngredientData = useCallback(
        (name) => {
            return ingredientsData.find(
                (ingredient) => ingredient.label.toLowerCase() === name.toLowerCase()
            );
        },
        [ingredientsData]
    );

    const setHydra = useCallback(() => {
        if (!recipedata || !recipedata.ingredientsbase || recipedata.ingredientsbase.length === 0) {
            setPercentHydra(0);
            setPercentHydraEffective(0);
            return;
        }

        let totalFarine = 0;
        let totalEauBoulangere = 0;
        let totalEauEffective = 0;
        let totalIngredients = 0;

        recipedata.ingredientsbase.forEach((ingredient) => {
            const recipeDetails = recipes.find((rec) => rec.titre === ingredient.nom);

            if (!recipeDetails) {
                totalIngredients += ingredient.quantite;
            }

            if (farineDetector.test(ingredient.nom)) {
                totalFarine += ingredient.quantite;
            } else if (liquidDetector.test(ingredient.nom)) {
                totalEauBoulangere += ingredient.quantite; // Eau pour hydratation boulangère
                totalEauEffective += ingredient.quantite; // Eau pour hydratation effective
            }

            const ingredientData = findIngredientData(ingredient.nom);
            if (ingredientData && ingredientData.hydratation) {
                totalEauEffective += (ingredientData.hydratation / 100) * ingredient.quantite;
            }

            if (recipeDetails) {
                const totalRecetteBase = recipeDetails.ingredientsbase.reduce((sum, ing) => sum + ing.quantite, 0);

                recipeDetails.ingredientsbase.forEach((subIngredient) => {
                    const adjustedQuantity = (subIngredient.quantite * ingredient.quantite) / totalRecetteBase;

                    if (farineDetector.test(subIngredient.nom)) {
                        // totalFarine += adjustedQuantity;
                    } else if (liquidDetector.test(subIngredient.nom)) {
                        // totalEauBoulangere += adjustedQuantity;
                        totalEauEffective += adjustedQuantity;
                    }

                    const subIngredientData = findIngredientData(subIngredient.nom);
                    if (subIngredientData && subIngredientData.hydratation) {
                        totalEauEffective += (subIngredientData.hydratation / 100) * adjustedQuantity;
                    }

                    totalIngredients += adjustedQuantity;
                });
            }
        });

        // Calcul de l’hydratation boulangère (eau / farine)
        const percentHydratationBoulangere = totalFarine > 0 ? roundTo((totalEauBoulangere * 100) / totalFarine, 1) : 0;
        setPercentHydra(percentHydratationBoulangere);

        // Calcul de l’hydratation effective (eau / total ingrédients)
        const percentHydratationEffective = totalIngredients > 0 ? roundTo((totalEauEffective * 100) / totalIngredients, 1) : 0;
        setPercentHydraEffective(percentHydratationEffective);

    }, [findIngredientData, recipedata, recipes]);

    useEffect(() => {
        if (totaldemande === 0 && recipedata.ingredientsbase.length === 0) {
            setCoef(1);
        } else {
            setCoef(totaldemande / totalRecetteBase);
            // setCoef(roundTo(totaldemande / totalRecetteBase, 2));
        }
        setHydra();
    }, [recipedata, totalRecetteBase, totaldemande, setHydra]);

    /*
    const suppr = (piece) => {
        const updatedIngredients = recipedata.ingredientsbase.filter(
            (ingredient) => ingredient.nom !== piece.nom
        );
        const updatedRecipedata = {
            ...recipedata,
            ingredientsbase: updatedIngredients,
        };
        updateRecipeData(updatedRecipedata);
    };
    */

    const handleNewName = (e) => {
        setNewName(e.target.value);
    };

    const handleNewWeight = (e) => {
        setNewWeight(parseInt(e.target.value));
    };

    const setNewIngrd = () => {
        const newIngredient = {
            nom: newName,
            quantite: newWeight,
        };
        const updatedRecipedata = {
            ...recipedata,
            ingredientsbase: [...recipedata.ingredientsbase, newIngredient],
        };
        updateRecipeData(updatedRecipedata);
        setAddIgrd(!addIgrd);
    };

    const getDefaultColor = (index) => {
        const shades = ['#e8dec8', '#8B4513', '#D3D3D3', '#A52A2A', '#C0C0C0'];
        return shades[index % shades.length];
    };

    const chartData = recipedata.ingredientsbase.map((ingredient, index) => {
        const ingredientData = ingredientsData.find(
            (ing) => ing.label.toLowerCase() === ingredient.nom.toLowerCase()
        );
        return {
            name: ingredient.nom,
            value: ingredient.quantite,
            color: ingredientData?.color || getDefaultColor(index),
        };
    });

    return (
        <Fragment>
            {recipedata && (
                <section>
                    <div className="ingredients">
                        <ul>
                            <Entete />
                            {recipedata.ingredientsbase.map((ingredient, i) => (
                                <QuantiteParIngredients
                                    hydra={percentHydra}
                                    key={i}
                                    iteration={i}
                                    ingredient={ingredient}
                                    fonctions={{ getWithcoef }}
                                />
                            ))}
                            <li className="total">
                                <label>Total</label>
                                <div className="base">
                                    <b>{totalRecetteBase}</b>gr
                                </div>
                                <div className="coef tooltip-container">
                                    <span className="tooltipFull">{coef}</span>
                                    {coef.toFixed(2)}…
                                </div>
                                <div>
                                    <b>{totaldemande}</b>gr
                                </div>
                            </li>
                            <li className="hydratationLine">
                                <div className="base">
                                    {percentHydra !== 0 && <span><b>Hydratation boulangére : {percentHydra}</b>%</span>}
                                    <span><b>Hydratation {percentHydra !== 0 && "effective"}  : {percentHydraEffective}</b>%</span>
                                </div>
                                <div className="expanded">
                                    <BarChartComponent data={chartData} />
                                    {/*<PieChartComponent data={chartData} />*/}
                                </div>
                            </li>
                            <li className={`${addIgrd ? "hide" : "addIngredient"}`}>
                                <div>
                                    <button onClick={() => setAddIgrd(!addIgrd)} className="bt">
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
                                onClick={setNewIngrd}
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
