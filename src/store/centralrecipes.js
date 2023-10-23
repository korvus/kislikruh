import React, { useState, useEffect, createContext } from "react";
import { useTranslation } from "react-i18next";

export const PanemContext = createContext(null);

function getLocalData(key) {
  return JSON.parse(localStorage.getItem(key));
}

function setLocalData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function setUrl(i) {
  const url = `(${i})`;
  window.location.hash = url;
}

export const PanemContextProvider = (props) => {
  const [recipedata, setRecipedata] = useState({
    pieces: [],
    ingredientsbase: [],
  });
  const [allStoredRecipes, setAllStoredRecipes] = useState([]);
  const [indexSelected, setIndexSelected] = useState(0);
  const [totaldemande, setTotaldemande] = useState(0);
  const { i18n } = useTranslation();

  function updateStoredRecipes(newData) {
    setAllStoredRecipes((prevData) => {
      if (JSON.stringify(prevData) !== JSON.stringify(newData)) {
        return newData;
      }
      return prevData;
    });
  }

  useEffect(() => {
    async function fetchRecipes() {
      let localData = getLocalData(`recipes_${i18n.language}`);
      let newData = [];
      if (!localData) {
        try {
          const recipesModule = await import(
            `./datarecipes_${i18n.language}.json`
          );
          newData = Object.values(recipesModule.default || localData);
          updateStoredRecipes(newData);
          setLocalData(`recipes_${i18n.language}`, newData);
        } catch (error) {
          console.error("Erreur lors de l'importation des recettes:", error);
        }
      } else {
        newData = Object.values(localData);
        updateStoredRecipes(newData);
      }
      setRecipedata(newData[indexSelected]);
    }

    fetchRecipes();
  }, [i18n.language, indexSelected]);

  useEffect(() => {
    setUrl(indexSelected);
    if (recipedata.length > 0) {
      const newRecipeData = recipedata[indexSelected];
      if (recipedata !== newRecipeData) {
        setRecipedata(newRecipeData);
      }
    }
  }, [indexSelected, recipedata]);

  function updateAllRecipes(updatedRecipe, index) {
    const updatedRecipes = [...allStoredRecipes];
    updatedRecipes[index] = updatedRecipe;
    setLocalData(`recipes_${i18n.language}`, updatedRecipes);
  }

  function updateRecipeData(newData) {
    setRecipedata(newData);
    updateAllRecipes(newData, indexSelected);
  }

  function removeOneRecipe(indexToRemove) {
    const newRecipes = allStoredRecipes.filter(
      (item, i) => i !== indexToRemove
    );
    setLocalData(`recipes_${i18n.language}`, newRecipes);

    // Mettre à jour l'état local avec le nouveau tableau
    setAllStoredRecipes(newRecipes);

    // Gérer le cas où l'index sélectionné devient invalide
    if (indexToRemove === indexSelected) {
      setIndexSelected((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (indexToRemove < indexSelected) {
      setIndexSelected((prev) => prev - 1);
    }
  }

  const provider = {
    recipes: allStoredRecipes,
    updateRecipeData,
    removeOneRecipe,
    indexSelected,
    recipedata,
    setIndexSelected,
    totaldemande,
    setTotaldemande,
  };

  return (
    <PanemContext.Provider value={provider}>
      {props.children}
    </PanemContext.Provider>
  );
};
