import { createContext, useContext, useState } from 'react';
import { useTranslation } from "react-i18next";

const CreateContext = createContext();

export const useCreateContext = () => {
    const context = useContext(CreateContext);
    if (!context) {
        throw new Error('useCreateContext must be used within a CreateProvider');
    }
    return context;
};;

export const CreateProvider = ({ children }) => {
    const [desc, setDesc] = useState("");
    const [name, setName] = useState("");
    const [tbase, setTbase] = useState(0);
    const [urlRecipe, setUrlRecipe] = useState('');
    const [tpate, setTpate] = useState(0);
    const [totalWeightIngredients, setTotalWeightIngredients] = useState(0);
    const [pieces, setPieces] = useState([{ titre: "", nombre: 1 }]);
    const [addRcp, setAddRcp] = useState(false);
    const [editRcp, setEditRcp] = useState(false);
    const [ingredientsbase, setIngredientsBase] = useState([
        { nom: "", quantite: 0, nbEggs: 0 },
    ]);
    const [errors, setErrors] = useState({});
    const [showPieces, setShowPieces] = useState(false);
    const [showTemperatureBase, setshowTemperatureBase] = useState(false);
    const [showUrl, setShowUrl] = useState(false);
    const [showTemperaturePate, setshowTemperaturePate] = useState(false);

    const { t } = useTranslation();

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

    return (
        <CreateContext.Provider value={{
            desc, setDesc,
            name, setName,
            tbase, setTbase,
            tpate, setTpate,
            urlRecipe, setUrlRecipe,
            totalWeightIngredients, setTotalWeightIngredients,
            pieces, setPieces,
            ingredientsbase, setIngredientsBase,
            errors, setErrors,
            editRcp, setEditRcp,
            showPieces, setShowPieces,
            showTemperatureBase, setshowTemperatureBase,
            showTemperaturePate, setshowTemperaturePate,
            showUrl, setShowUrl,
            addRcp, setAddRcp,
            validateFields,
            // Ajoutez d'autres valeurs partagées ici
        }}>
            {children}
        </CreateContext.Provider>
    );
};