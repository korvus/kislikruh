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

  async function loadDefaultRecipes() {
    try {
      const recipesModule = await import(`./datarecipes_${i18n.language}.json`);
      const defaultRecipes = Object.values(recipesModule.default);
      setAllStoredRecipes(defaultRecipes);
      setLocalData(`recipes_${i18n.language}`, defaultRecipes);
      setRecipedata(defaultRecipes[0]); // ou setIndexSelected(0); selon vos besoins
      return defaultRecipes;
    } catch (error) {
      console.error(
        "Erreur lors du chargement des recettes par défaut:",
        error
      );
      return []; // Retourne un tableau vide en cas d'erreur
    }
  }

  useEffect(() => {
    async function fetchRecipes() {
      let localData = getLocalData(`recipes_${i18n.language}`);
      let newData = [];
      if (!localData) {
        await loadDefaultRecipes();
      } else {
        if (localData.length === 0) {
          await loadDefaultRecipes();
        } else {
          newData = Object.values(localData);
          updateStoredRecipes(newData);
        }
      }
      setRecipedata(newData[indexSelected]);
    }

    fetchRecipes();
  }, [i18n.language, indexSelected]);

  useEffect(() => {
    setUrl(indexSelected);
    if (Array.isArray(allStoredRecipes) && allStoredRecipes.length > 0) {
      const newRecipeData = allStoredRecipes[indexSelected];
      if (newRecipeData && recipedata !== newRecipeData) {
        setRecipedata(newRecipeData);
      }
    }
  }, [indexSelected, recipedata]);

  const addNewRecipe = (recipe) => {
    const updatedRecipes = [...allStoredRecipes, recipe];
    setAllStoredRecipes(updatedRecipes);
    setLocalData(`recipes_${i18n.language}`, updatedRecipes);
  };

  function updateAllRecipes(updatedRecipe, index) {
    const updatedRecipes = [...allStoredRecipes];
    updatedRecipes[index] = updatedRecipe;
    setLocalData(`recipes_${i18n.language}`, updatedRecipes);
  }

  function resetRecipesToDefault() {
    loadDefaultRecipes();
    /*
    // Charger les recettes par défaut (si disponibles) ou simplement réinitialiser le tableau
    let defaultRecipes = []; // Remplacer par la logique de chargement des recettes par défaut
    setAllStoredRecipes(defaultRecipes);
    setLocalData(`recipes_${i18n.language}`, defaultRecipes);
    setIndexSelected(0); // Réinitialiser l'index de recette sélectionné
    */
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
    addNewRecipe,
    resetRecipesToDefault,
  };

  return (
    <PanemContext.Provider value={provider}>
      {props.children}
    </PanemContext.Provider>
  );
};
