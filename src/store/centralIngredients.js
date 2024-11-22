import React, { useState, useEffect, createContext, useCallback } from "react";
import { useTranslation } from "react-i18next";

export const IngredientsContext = createContext(null);

function getLocalData(key) {
    return JSON.parse(localStorage.getItem(key));
}

function setLocalData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

export const IngredientsProvider = ({ children }) => {
    const [ingredientsData, setIngredientsData] = useState([]);
    const { i18n } = useTranslation();

    const loadDefaultIngredients = useCallback(async () => {
        try {
            const languageCode = i18n.language.split('-')[0];
            const ingredientsModule = await import(`../data/dataIngredients_${languageCode}.json`);
            const defaultIngredients = ingredientsModule.default;
            setIngredientsData(defaultIngredients);
            setLocalData(`ingredients_${languageCode}`, defaultIngredients);
            return defaultIngredients;
        } catch (error) {
            console.error("Erreur lors du chargement des ingrédients par défaut:", error);
            return [];
        }
    }, [i18n.language]);

    useEffect(() => {
        async function fetchIngredients() {
            const languageCode = i18n.language.split('-')[0];
            let localData = getLocalData(`ingredients_${languageCode}`);
            if (!localData || localData.length === 0) {
                localData = await loadDefaultIngredients();
            }
            setIngredientsData(localData);
        }

        fetchIngredients();
    }, [i18n.language, loadDefaultIngredients]);

    const provider = {
        ingredientsData: ingredientsData,
    };

    return (
        <IngredientsContext.Provider value={provider}>
            {children}
        </IngredientsContext.Provider>
    );
};