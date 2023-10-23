import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const Create = ({ addRcp, setAddRcp }) => {
  const [desc, setDesc] = useState("");
  const [name, setName] = useState("");
  const [tbase, setTbase] = useState(0);
  const [tpate, setTpate] = useState(0);
  const [piece, setPiece] = useState("");
  const [ingredientsbase, setIngredientsBase] = useState([
    { nom: "", quantite: 0 },
  ]);

  const { t } = useTranslation();

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

  const handlePieceChange = (e) => {
    setPiece(e.target.value);
  };

  const handleIngredientNameChange = (index, e) => {
    const newIngredients = [...ingredientsbase];
    newIngredients[index].nom = e.target.value;
    setIngredientsBase(newIngredients);
  };

  const handleIngredientQuantityChange = (index, e) => {
    const newIngredients = [...ingredientsbase];
    newIngredients[index].quantite = e.target.value;
    setIngredientsBase(newIngredients);
  };

  const addNewIngredient = () => {
    setIngredientsBase([...ingredientsbase, { nom: "", quantite: 0 }]);
  };

  const handleSubmitRecipe = () => {
    const newRecipe = {
      desc,
      name,
      tbase,
      tpate,
      pieces: [{ titre: piece }],
      ingredientsbase,
    };
  };

  return (
    <div className={`formAddPrd ${addRcp ? "" : "hide"}`}>
      {/* Nom */}
      <fieldset>
        <label>Nom</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={handleNameChange}
        ></input>
      </fieldset>

      {/* Ingrédients de base */}
      <fieldset className="composition">
        <label>
          Rentrez ici les différents ingrédients qui composent votre recette
        </label>
        {/* Ici, vous pouvez utiliser des champs dynamiques pour ajouter plusieurs ingrédients */}
        {ingredientsbase.map((ingredient, index) => (
          <div key={index} className="ingredients">
            <input
              type="text"
              value={ingredient.nom}
              placeholder="ingrédient"
              onChange={(e) => handleIngredientNameChange(index, e)}
            ></input>
            <input
              type="number"
              value={ingredient.quantite}
              placeholder="1000"
              onChange={(e) => handleIngredientQuantityChange(index, e)}
            ></input>
          </div>
        ))}
        <button onClick={addNewIngredient}>Ajouter un ingrédient</button>
      </fieldset>

      {/* Description */}
      <fieldset>
        <label>Description</label>
        <input
          type="text"
          id="desc"
          value={desc}
          onChange={handleDescChange}
        ></input>
      </fieldset>

      {/* Température de base */}
      <fieldset>
        <label>Température de base</label>
        <input
          type="number"
          id="tbase"
          value={tbase}
          onChange={handleTbaseChange}
        ></input>
      </fieldset>

      {/* Température de la pâte */}
      <fieldset>
        <label>Température de la pâte</label>
        <input
          type="number"
          id="tpate"
          value={tpate}
          onChange={handleTpateChange}
        ></input>
      </fieldset>

      {/* Pièces */}
      <fieldset>
        <label>Pièces</label>
        {/* Ici, vous pouvez utiliser un champ dynamique pour ajouter plusieurs pièces ou un champ simple si c'est toujours une seule pièce */}
        <input
          type="text"
          id="piece"
          value={piece}
          onChange={handlePieceChange}
        ></input>
      </fieldset>

      <input
        onClick={handleSubmitRecipe}
        type="submit"
        className="submit"
        value="Ajouter la recette"
      />
      <span onClick={() => setAddRcp(false)}>Annuler</span>
    </div>
  );
};

export default Create;
