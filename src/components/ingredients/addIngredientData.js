import React, { useState, useContext } from "react";
import { FaPen } from "react-icons/fa";
import { RiErrorWarningFill } from "react-icons/ri";
import { IngredientsContext } from "../../store/centralIngredients";

const AddData = ({ ingredient }) => {

    const { addIngredient, ingredientsData } = useContext(IngredientsContext);

    const ingredientExists = ingredientsData.some(
        (ing) => ing.label.toLowerCase() === ingredient.toLowerCase()
    );

    const [color, setColor] = useState("#ffffff");

    // Met à jour la couleur et crée l'ingrédient s'il n'existe pas
    const handleChangeColor = (event) => {
        const newColor = event.target.value;
        setColor(newColor);

        if (!ingredientExists) {
            addIngredient({ label: ingredient, color: newColor });
        }
    };

    return <ul className='noData'>
        <li>
            <RiErrorWarningFill className='fa-5x' /> Cet ingrédient n'est associé a aucune données.<br />
            Vous pouvez néanmoins créer des données en commencant ici, en associant une couleur a cet ingrédient :
        </li>
        <li>

        </li>
        <li className='colorCreate'>
            <input
                type="color"
                value={color}
                onChange={handleChangeColor}
            />
        </li>
    </ul>
}

export default AddData;