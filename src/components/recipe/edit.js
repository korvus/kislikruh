import React, { useContext } from "react";
import { IoMdClose } from "react-icons/io";
import { BsBagPlusFill } from "react-icons/bs";
import Pieces from './create/pieces';
import Ingredients from './create/ingredient';

import { useCreateContext } from './CreateContext';
import { PanemContext } from "../../store/centralrecipes";

const Edit = ({ addRcp, setAddRcp }) => {

    const {
        desc, setDesc,
        name, setName,
        tbase, setTbase,
        tpate, setTpate,
        pieces,
        ingredientsbase, setIngredientsBase,
        errors,
        showPieces, setShowPieces,
        showUrl, setShowUrl,
        showTemperatureBase, setshowTemperatureBase,
        showTemperaturePate, setshowTemperaturePate,
        urlRecipe, setUrlRecipe,
        validateFields,
    } = useCreateContext();


    // const { t } = useTranslation();

    const { addNewRecipe, recipes } = useContext(PanemContext);

    const handleDescChange = (e) => {
        setDesc(e.target.value);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleTbaseChange = (e) => {
        setTbase(e.target.value);
    };

    const handleUrlChange = (e) => {
        setUrlRecipe(e.target.value);
    }

    const handleTpateChange = (e) => {
        setTpate(e.target.value);
    };

    const addNewIngredient = () => {
        setIngredientsBase([...ingredientsbase, { nom: "", quantite: 0 }]);
    };

    const addNewExistingIngredient = (el) => {
        if (isRecipeInIngredients(el)) return; // Si déjà présent
        setIngredientsBase([...ingredientsbase, { nom: el, quantite: 0 }]);
    };

    const togglePiecesVisibility = () => {
        setShowPieces(!showPieces);
    };

    const toggleTemperatureBase = () => {
        setshowTemperatureBase(!showTemperatureBase);
    };

    const toggleUrlField = () => {
        setShowUrl(!showUrl);
    };

    const toggleTemperaturePate = () => {
        setshowTemperaturePate(!showTemperaturePate);
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
            url: urlRecipe,
            tbase,
            tpate,
            pieces,
            ingredientsbase: ingredientsForSubmission,
        };
        addNewRecipe(newRecipe);
        setAddRcp(false);
    };

    return (
        <div>
            <div className={`formAddPrd ${addRcp ? "" : "hide"}`}>
                <fieldset className={errors.name ? "error" : ""}>
                    <label>Nom de la recette</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={handleNameChange}
                    ></input>
                    {errors.name && <div className="error">{errors.name}</div>}
                    <IoMdClose className='close' size={30} onClick={() => setAddRcp(false)} />
                </fieldset>

                <fieldset className={`composition ${errors.ingredients ? "error" : ""}`}>
                    <label>
                        Rentrez ici les différents ingrédients qui composent votre recette de base
                    </label>
                    {errors.ingredients && (
                        <div className="error">{errors.ingredients}</div>
                    )}
                    {/*<div className="metaInfos">
            <Infobulle text="L'icone de liquide signifie que votre ingrédient sera classifié comme liquide, permettant ainsi de calculer le taux d'hydratation.">
              <IoMdInformationCircleOutline />
            </Infobulle>
          </div>*/}
                    {ingredientsbase.map((ingredient, index) => (
                        <Ingredients
                            key={`ingredientbase-${index}`}
                            index={index}
                            ingredient={ingredient}
                        />
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

                {/* Protocole */}
                <fieldset>
                    <label>Protocole</label>
                    <textarea
                        type="text"
                        id="desc"
                        value={desc}
                        placeholder="optionnel"
                        onChange={handleDescChange}
                    ></textarea>
                </fieldset>

                {/* Site web */}
                <fieldset className="toggle">
                    <label onClick={toggleUrlField}>
                        Ajouter un site web
                    </label>
                    <input
                        type="text"
                        id="urlRecipe"
                        className={showUrl ? "" : "hide"}
                        value={urlRecipe}
                        onChange={handleUrlChange}
                    ></input>
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
                    <Pieces />
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
        </div>
    );
};

export default Edit;
