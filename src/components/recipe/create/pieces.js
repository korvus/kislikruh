import React from 'react';
import { TbInfoTriangleFilled } from "react-icons/tb";
import { useCreateContext } from '../CreateContext';
// import { useTranslation } from "react-i18next";
// import { PanemContext } from "../../../store/centralrecipes";

const Pieces = () => {
    // const { t } = useContext(PanemContext); // Si vous utilisez i18n dans ce composant

    const { errors, pieces, setPieces, totalWeightIngredients, showPieces } = useCreateContext();

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

    return (
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
        </div>);

};

export default Pieces;