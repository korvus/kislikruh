import React, { useState, useEffect, useCallback, createContext } from "react";
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
  const [isLoading, setIsLoading] = useState(true);
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

  const loadDefaultRecipes = useCallback(async () => {
    try {
      const languageCode = i18n.language.split('-')[0];
      const recipesModule = await import(`../data/datarecipes_${languageCode}.json`);
      const defaultRecipes = Object.values(recipesModule.default);
      setAllStoredRecipes(defaultRecipes);
      setLocalData(`recipes_${languageCode}`, defaultRecipes);
      return defaultRecipes; // Pas besoin de définir l'état ici si on le définit dans useEffect
    } catch (error) {
      console.error("Erreur lors du chargement des recettes par défaut:", error);
      return [];
    }
  }, [i18n.language]);

  useEffect(() => {
    async function fetchRecipes() {
      let localData = getLocalData(`recipes_${i18n.language.split('-')[0]}`);
      let newData = [];
      if (!localData || localData.length === 0) {
        newData = await loadDefaultRecipes();
      } else {
        newData = Object.values(localData);
      }
      updateStoredRecipes(newData);
      if (newData.length > 0) {
        setRecipedata(newData[indexSelected]);
      }
      setIsLoading(false);
    }

    fetchRecipes();
  }, [i18n.language, indexSelected, loadDefaultRecipes]);

  useEffect(() => {
    setUrl(indexSelected);
    if (Array.isArray(allStoredRecipes) && allStoredRecipes.length > 0) {
      const newRecipeData = allStoredRecipes[indexSelected];
      if (newRecipeData && recipedata !== newRecipeData) {
        setRecipedata(newRecipeData);
      }
    }
  }, [allStoredRecipes, indexSelected, recipedata]);

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
    isLoading,
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
