import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { FaDroplet } from "react-icons/fa6";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { BsBagPlusFill } from "react-icons/bs";
import { TbInfoTriangleFilled } from "react-icons/tb";
import Infobulle from "../utils/Infobulle";
import { BsTrash } from "react-icons/bs";
import { liquidDetector, eggDetector } from "../functions";
import "../../style/create.css";

import { PanemContext } from "../../store/centralrecipes";

const Create = ({ addRcp, setAddRcp }) => {
  const [desc, setDesc] = useState("");
  const [name, setName] = useState("");
  const [tbase, setTbase] = useState(0);
  const [tpate, setTpate] = useState(0);
  const [nbEggs, setNbEggs] = useState(0);
  const [totalWeightIngredients, setTotalWeightIngredients] = useState(0);
  const [pieces, setPieces] = useState([{ titre: "", nombre: 1 }]);
  const [ingredientsbase, setIngredientsBase] = useState([
    { nom: "", quantite: 0, nbEggs: 0 },
  ]);
  const [errors, setErrors] = useState({});
  const [showPieces, setShowPieces] = useState(false);
  const [showTemperatureBase, setshowTemperatureBase] = useState(false);
  const [showTemperaturePate, setshowTemperaturePate] = useState(false);

  const { t } = useTranslation();

  const { addNewRecipe, recipes } = useContext(PanemContext);

  const validateFields = () => {
    const newErrors = {};
    // Validation du nom de la recette
    if (!name.trim()) {
      newErrors.name = t("Naming the recipe is mandatory");
    }

    // ingredients
    if (ingredientsbase.length <= 0) {
      newErrors.ingredients = t(
        "Une recette comporte au moins 2 ingrédients !"
      );
    }

    // Vérification des pièces
    if (pieces.length > 1 || (pieces.length === 1 && pieces[0].titre)) {
      // Plus d'une pièce ou la pièce par défaut a été modifiée
      pieces.forEach((piece, index) => {
        if (!piece.titre.trim()) {
          newErrors[`pieceTitle${index}`] =
            "Le titre de la pièce est obligatoire.";
        }
        if (!piece.nombre || piece.nombre <= 0) {
          newErrors[`pieceNombre${index}`] =
            "Le nombre de pièces doit être supérieur à 0.";
        }
        if (!piece.poid || piece.poid < 10) {
          newErrors[`piecePoid${index}`] =
            "Le poids de la pièce doit être d'au moins 10g.";
        }
      });
    } else {
      // Aucune pièce supplémentaire ajoutée, utiliser les valeurs par défaut
      const defaultPiece = {
        titre: name,
        nombre: 1,
        poid: totalWeightIngredients,
      };
      pieces[0] = defaultPiece;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retourne true si aucun erreur
  };

  const handleLiquidChange = (index, e) => {
    const newIngredients = [...ingredientsbase];
    newIngredients[index].liquid = e.target.checked;
    setIngredientsBase(newIngredients);
  };

  const handleDescChange = (e) => {
    setDesc(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleTbaseChange = (e) => {
    setTbase(e.target.value);
  };

  const handleTpateChange = (e) => {
    setTpate(e.target.value);
  };

  const handleIngredientNameChange = (index, e) => {
    const newIngredients = ingredientsbase.map((ingredient, idx) => {
      if (idx === index) {
        return {
          ...ingredient,
          nom: e.target.value,
          liquid: liquidDetector.test(e.target.value),
        };
      }
      // Pour les autres éléments, conservez l'objet tel quel
      return ingredient;
    });

    setIngredientsBase(newIngredients);
  };

  const generateNewWeight = (newIngredients) => {
    const newWeight = newIngredients.reduce(
      (acc, ingredient) => acc + ingredient.quantite,
      0
    );
    setTotalWeightIngredients(newWeight);
  };

  const handleIngredientQuantityChange = (index, e) => {
    const newIngredients = [...ingredientsbase];
    const newQuantity = Number(e.target.value);
    newIngredients[index].quantite = Number(e.target.value);

    // Mettre à jour nbEggs si l'ingrédient est un œuf
    if (eggDetector.test(newIngredients[index].nom)) {
      const eggWeight = 50;
      newIngredients[index].nbEggs = Math.round(newQuantity / eggWeight);
    }

    generateNewWeight(newIngredients);
    setIngredientsBase(newIngredients);
  };

  const changeNbEggs = (direction, index) => {
    setIngredientsBase((currentIngredients) => {
      const newIngredients = currentIngredients.map((ingredient, idx) => {
        if (idx === index && eggDetector.test(ingredient.nom)) {
          const newNbEggs = Math.max(0, ingredient.nbEggs + direction);
          return { ...ingredient, nbEggs: newNbEggs, quantite: newNbEggs * 58 };
        }
        return ingredient;
      });

      generateNewWeight(newIngredients);
      return newIngredients;
    });
  };

  const handlePieceTitleChange = (index, e) => {
    const newPieces = [...pieces];
    newPieces[index].titre = e.target.value;
    setPieces(newPieces);
  };

  const handlePieceNumberChange = (index, e) => {
    const newPieces = [...pieces];
    newPieces[index].nombre = Number(e.target.value);
    setPieces(newPieces);
  };

  const addNewPiece = () => {
    setPieces([...pieces, { titre: "", nombre: 1 }]);
  };

  const addNewIngredient = () => {
    setIngredientsBase([...ingredientsbase, { nom: "", quantite: 0 }]);
  };

  const addNewExistingIngredient = (el) => {
    if (isRecipeInIngredients(el)) return; // Si déjà présent
    setIngredientsBase([...ingredientsbase, { nom: el, quantite: 0 }]);
  };

  const deleteIngredient = (index) => {
    const newIngredients = ingredientsbase.filter((_, idx) => idx !== index);
    setIngredientsBase(newIngredients);
  };

  const togglePiecesVisibility = () => {
    setShowPieces(!showPieces);
  };
  const toggleTemperatureBase = () => {
    setshowTemperatureBase(!showTemperatureBase);
  };
  const toggleTemperaturePate = () => {
    setshowTemperaturePate(!showTemperaturePate);
  };

  const isIngredientInRecipes = (ingredientName) => {
    return recipes.some((recipe) => recipe.titre === ingredientName);
  };

  const isRecipeInIngredients = (recipeName) => {
    return ingredientsbase.some(
      (ingredientBase) => ingredientBase.nom === recipeName
    );
  };

  const handleSubmitRecipe = () => {
    if (!validateFields()) return;

    const ingredientsForSubmission = ingredientsbase.map(
      ({ nbEggs, ...ingredient }) => ingredient
    );

    const newRecipe = {
      editable: true,
      desc,
      titre: name,
      tbase,
      tpate,
      pieces,
      ingredientsbase: ingredientsForSubmission,
    };
    addNewRecipe(newRecipe);
    setAddRcp(false);
  };

  return (
    <div className={`formAddPrd ${addRcp ? "" : "hide"}`}>
      <fieldset className={errors.name ? "error" : ""}>
        <label>Nom de la nouvelle recette</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={handleNameChange}
        ></input>
        {errors.name && <div className="error">{errors.name}</div>}
      </fieldset>

      <fieldset className={`composition ${errors.ingredients ? "error" : ""}`}>
        <label>
          Rentrez ici les différents ingrédients qui composent votre recette de
          base
        </label>
        {errors.ingredients && (
          <div className="error">{errors.ingredients}</div>
        )}
        <div className="metaInfos">
          <Infobulle text="L'icone de liquide signifie que votre ingrédient sera classifié comme liquide, permettant ainsi de calculer le taux d'hydratation.">
            <IoMdInformationCircleOutline />
          </Infobulle>
        </div>
        {ingredientsbase.map((ingredient, index) => (
          <div key={index} className="ingredients">
            <label>
              <input
                type="checkbox"
                checked={ingredient.liquid || false}
                onChange={(e) => handleLiquidChange(index, e)}
                className="hide"
              />
              <FaDroplet
                style={{ opacity: ingredient.liquid ? 1 : 0.5 }} // Style conditionnel
              />
            </label>
            <input
              type="text"
              className="ingredientName"
              value={ingredient.nom}
              placeholder="ingrédient"
              onChange={(e) => handleIngredientNameChange(index, e)}
              readOnly={isIngredientInRecipes(ingredient.nom)}
            ></input>
            {eggDetector.test(ingredient.nom) && (
              <div className="nombre">
                {" "}
                <button onClick={() => changeNbEggs(-1, index)}>-</button>
                <b>{ingredient.nbEggs}</b>
                <button onClick={() => changeNbEggs(1, index)}>+</button>
              </div>
            )}
            <input
              type="number"
              value={ingredient.quantite}
              placeholder="poid en gramme"
              onChange={(e) => handleIngredientQuantityChange(index, e)}
            ></input>
            <span className="unity">{ingredient.liquid ? "ml" : "gr"}</span>
            <span
              onClick={() => deleteIngredient(index)}
              title={t("suppressThisRecipe")}
              className="trash"
            >
              <BsTrash
                alt={t("suppress")}
                style={{ marginTop: "2px" }}
                size="14px"
              />
            </span>
          </div>
        ))}
        <button className="addIngredient" onClick={addNewIngredient}>
          <BsBagPlusFill />
          &nbsp; Ajouter un ingrédient
        </button>
        <div className="alreadyCooked">
          <span>
            Si vous souhaitez faire entrer des éléments déjà cuisiné dans la
            composition de votre recette.
          </span>
          <ul className="existingPiece">
            {recipes.map((piece, i) => (
              <li
                key={`piece-${i}`}
                onClick={() => addNewExistingIngredient(piece.titre)}
                className={
                  isRecipeInIngredients(piece.titre) ? "recipeAsIngredient" : ""
                }
              >
                {piece.titre}
              </li>
            ))}
          </ul>
        </div>
      </fieldset>

      {/* Description */}
      <fieldset>
        <label>Description</label>
        <textarea
          type="text"
          id="desc"
          value={desc}
          placeholder="optionnel"
          onChange={handleDescChange}
        ></textarea>
      </fieldset>

      {/* Température de base */}
      <fieldset className="toggle">
        <label onClick={toggleTemperatureBase}>
          Ajouter une température de base
        </label>
        <input
          type="number"
          id="tbase"
          className={showTemperatureBase ? "" : "hide"}
          value={tbase}
          onChange={handleTbaseChange}
        ></input>
      </fieldset>

      {/* Température de la pâte */}
      <fieldset className="toggle">
        <label onClick={toggleTemperaturePate}>
          Ajouter une Température de pâte
        </label>
        <input
          type="number"
          id="tpate"
          className={showTemperaturePate ? "" : "hide"}
          value={tpate}
          onChange={handleTpateChange}
        ></input>
      </fieldset>

      {/* Pièces */}
      <fieldset className="composition toggle">
        <label onClick={togglePiecesVisibility}>
          Si la recette se divise en pièces / portions
        </label>
        <div className={showPieces ? "" : "hide"}>
          <span className="currentWeight">
            <TbInfoTriangleFilled /> Pour indication, la somme du poid de vos
            ingrédients pour la recette de base est de {totalWeightIngredients}
            gr
          </span>
          {pieces.map((piece, index) => (
            <div key={index} className="pieces">
              <div className="fields">
                <input
                  type="text"
                  value={piece.titre}
                  className={errors[`pieceTitle${index}`] ? "error" : ""}
                  placeholder="Nom"
                  onChange={(e) => handlePieceTitleChange(index, e)}
                ></input>
                &nbsp;Nombre :
                <input
                  type="number"
                  value={piece.nombre}
                  placeholder="Nombre"
                  className={errors[`pieceNombre${index}`] ? "error" : ""}
                  name="nombre"
                  onChange={(e) => handlePieceNumberChange(index, e)}
                ></input>
                &nbsp;poid :
                <input
                  type="number"
                  value={piece.poid}
                  placeholder="poid"
                  className={errors[`piecePoid${index}`] ? "error" : ""}
                  name="poid"
                  onChange={(e) => handlePieceNumberChange(index, e)}
                ></input>
                gr
              </div>
              {errors[`pieceTitle${index}`] && (
                <div className="error">{errors[`pieceTitle${index}`]}</div>
              )}
              {errors[`pieceNombre${index}`] && (
                <div className="error">{errors[`pieceNombre${index}`]}</div>
              )}
              {errors[`piecePoid${index}`] && (
                <div className="error">{errors[`piecePoid${index}`]}</div>
              )}
            </div>
          ))}
          <button onClick={addNewPiece}>Ajouter une pièce</button>
        </div>
      </fieldset>

      <div className="submitBt">
        <input
          onClick={handleSubmitRecipe}
          type="submit"
          className="submit"
          value="Ajouter la recette"
        />
        <span className="cancel" onClick={() => setAddRcp(false)}>
          Annuler
        </span>
      </div>
    </div>
  );
};

export default Create;
