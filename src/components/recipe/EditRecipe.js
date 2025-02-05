import React, { useContext, useState } from "react";
import { PanemContext } from "../../store/centralrecipes";
import { useCreateContext } from './CreateContext';
import { useTranslation } from "react-i18next";
import { BsBagPlusFill } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import Ingredients from './edit/ingredient';
import styles from "../../style/editRecipe.module.css";

const EditRecipe = () => {
    const { recipedata, updateRecipeData, recipes } = useContext(PanemContext);
    // const { ingredientsData } = useContext(IngredientsContext);
    const { setEditRcp } = useCreateContext();
    const { t } = useTranslation();

    const [editedRecipe, setEditedRecipe] = useState({ ...recipedata });

    const handleSave = (e) => {
        e.preventDefault();
        updateRecipeData(editedRecipe);
        setEditRcp(false);
    };

    const handleCancel = () => {
        setEditedRecipe({ ...recipedata });
        setEditRcp(false);
    };

    const handleChange = (field, value) => {
        setEditedRecipe((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddIngredient = () => {
        const newIngredient = { nom: "", quantite: 0 };
        setEditedRecipe((prev) => ({
            ...prev,
            ingredientsbase: [...prev.ingredientsbase, newIngredient],
        }));
    };

    const isRecipeInIngredients = (recipeTitle) => {
        return editedRecipe.ingredientsbase.some(
            (ingredient) => ingredient.nom === recipeTitle
        );
    };

    const handleAddExistingIngredient = (pieceTitle) => {
        const alreadyExists = editedRecipe.ingredientsbase.some(
            (ingredient) => ingredient.nom === pieceTitle
        );

        if (alreadyExists) return; // Ne pas ajouter de doublons

        const newIngredient = { nom: pieceTitle, quantite: 0 };
        setEditedRecipe((prev) => ({
            ...prev,
            ingredientsbase: [...prev.ingredientsbase, newIngredient],
        }));
    };

    const handleUpdateIngredient = (index, updatedIngredient) => {
        const updatedIngredients = [...editedRecipe.ingredientsbase];
        updatedIngredients[index] = updatedIngredient;
        setEditedRecipe((prev) => ({
            ...prev,
            ingredientsbase: updatedIngredients,
        }));
    };

    const handleDeleteIngredient = (index) => {
        const updatedIngredients = editedRecipe.ingredientsbase.filter(
            (_, i) => i !== index
        );
        setEditedRecipe((prev) => ({
            ...prev,
            ingredientsbase: updatedIngredients,
        }));
    };

    return (
        <div className={styles.section}>
            <form onSubmit={handleSave}>
                <fieldset>
                    <label>{t("Dénomination")}:</label>
                    <input
                        type="text"
                        value={editedRecipe.titre || ""}
                        onChange={(e) => handleChange("titre", e.target.value)}
                    />
                    <IoMdClose className='close' size={30} onClick={() => setEditRcp(false)} />
                </fieldset>
                <fieldset className="composition">
                    <label>{t("Ingrédients")}:</label>
                    {editedRecipe.ingredientsbase.map((ingredient, index) => (
                        <Ingredients
                            key={index}
                            index={index}
                            ingredient={ingredient}
                            onUpdate={(updatedIngredient) =>
                                handleUpdateIngredient(index, updatedIngredient)
                            }
                            onDelete={() => handleDeleteIngredient(index)}
                        />
                    ))}
                    <button type="button" className={styles.addIngredient} onClick={handleAddIngredient}>
                        <BsBagPlusFill />&nbsp;
                        {t("addIngredient")}
                    </button>
                    <div className={styles.alreadyCooked}>
                        <span>
                            Si vous souhaitez faire entrer des recettes dans la composition de votre recette.
                        </span>
                        <ul className="existingPiece">
                            {recipes.map((piece, i) => (
                                <li
                                    key={`piece-${i}`}
                                    onClick={() => handleAddExistingIngredient(piece.titre)}
                                    className={
                                        isRecipeInIngredients(piece.titre)
                                            ? "recipeAsIngredient"
                                            : ""
                                    }
                                >
                                    {piece.titre}
                                </li>
                            ))}
                        </ul>
                    </div>

                </fieldset>
                <fieldset>
                    <label>{t("Description")}:</label>
                    <textarea
                        className="desc"
                        value={editedRecipe.desc || ""}
                        onChange={(e) => handleChange("desc", e.target.value)}
                    />
                </fieldset>
                <fieldset>
                    <label>{t("Site internet")}:</label>
                    <input
                        className={styles.longField}
                        type="url"
                        value={editedRecipe.url || ""}
                        onChange={(e) => handleChange("url", e.target.value)}
                    />
                </fieldset>
                <fieldset className="lastBlock">
                    <div>
                        <label>{t("Températeur de fournil")}:</label>
                        <input
                            type="text"
                            value={editedRecipe.tbase || ""}
                            onChange={(e) => handleChange("tbase", e.target.value)}
                        />
                    </div>
                    <div>
                        <label>{t("Températeur de pâte")}:</label>
                        <input
                            type="text"
                            value={editedRecipe.tpate || ""}
                            onChange={(e) => handleChange("tpate", e.target.value)}
                        />
                    </div>
                </fieldset>
                <fieldset>
                    <button className={styles.submit} type="submit">{t("save")}</button>
                    <button className={styles.cancel} type="button" onClick={handleCancel}>
                        {t("cancel")}
                    </button>
                </fieldset>
            </form>
        </div>
    );
};

export default EditRecipe;
