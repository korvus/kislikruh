import React, { useContext, useState } from "react";
import { PanemContext } from "../../store/centralrecipes";
import { useCreateContext } from './CreateContext';
import { useTranslation } from "react-i18next";
import { IoMdClose } from "react-icons/io";
import Ingredients from './edit/ingredient';
import styles from "../../style/editRecipe.module.css";

const EditRecipe = () => {
    const { recipedata, updateRecipeData } = useContext(PanemContext);
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
                <fieldset>
                    <label>{t("Description")}:</label>
                    <textarea
                        className="desc"
                        value={editedRecipe.desc || ""}
                        onChange={(e) => handleChange("desc", e.target.value)}
                    />
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
                    <button type="button" onClick={handleAddIngredient}>
                        {t("addIngredient")}
                    </button>
                </fieldset>
                <fieldset>
                    <button type="submit">{t("save")}</button>
                    <button type="button" onClick={handleCancel}>
                        {t("cancel")}
                    </button>
                </fieldset>
            </form>
        </div>
    );
};

export default EditRecipe;
