export const loadRecipes = (lang) => {
    const recipes = localStorage.getItem(`recipes_${lang.language}`);

    if (!recipes) {
        alert("Aucune recette à exporter");
        return;
    }

    const recipesData = JSON.stringify(JSON.parse(recipes), null, 2);
    const blob = new Blob([recipesData], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'recipes.json';

    link.click();
};