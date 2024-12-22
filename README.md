# Getting Started with Create React App

un bot qui permet de m'aider a coder une application next qui permet de gérer un ensemble de recette.
Le principe est qu'il y a un set de recette prédéfinies, mais l'utilisateur peut ajouter autant de recette qu'il veux ; Chaque recettes est constituée d'ingredients, avec leur valeur en poid. Il existe deux objets json : un pour les recettes, et un pour les ingredients.
L'utilisateur doit - a terme - pouvoir ajouter des recettes ou des ingredients, mais ces données coté clients sont ajoutées dans le webstorage, avec comme nom "recipes_[code lang]" ou "dataingredients_[code lang]" pour les ingredients.

La technologie du site est react-create-app.
Dans le package.json on retrouve ces dépendances : 
---
  "dependencies": {
    "i18next": "23.4.1",
    "i18next-browser-languagedetector": "7.1.0",
    "i18next-http-backend": "2.2.1",
    "next": "^14.2.15",
    "openai": "^4.28.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-i18next": "13.0.3",
    "react-icons": "4.10.1",
    "react-router-dom": "6.14.2",
    "react-scripts": "^5.0.1",
    "react-select": "^5.7.4",
    "recharts": "^2.13.0",
    "web-vitals": "2.1.4"
  },
---



La structure globale des fichiers dans le dossier src/ est la suivante : 
---
src/
- components/
-- components/ingredients/
--- components/ingredients/header.js
--- components/ingredients/pesee.js
--- components/ingredients/pie.js
-- components/organigramme/
--- components/organigramme/tableau.js
-- components/recipe/
--- components/recipe/create.js
--- components/recipe/CreateContext.js
--- components/recipe/eggCalculator.js
---- components/recipe/create/pieces.js
---- components/recipe/create/ingredient.js
---- components/recipe/create/EditableCreateableSelect.js
----- components/recipe/create/utils/validate.js
--- components/utils/functionsRecipes.js
--- components/utils/infobulle.js
--- components/utils/modal.js
-- components/functions.js
-- components/home.js
-- components/ingredients.js
-- components/menu.js
-- components/meta.js
-- components/petrissage.js
-- components/pieces.js
-- components/proportions.js
-- components/recipes.js
-- components/temperature.js
- store/
-- store/centralrecipes.js
-- store/centralingredients.json
- data/
-- data/dataingredients_en.js
-- data/datarecipes_en.json
- style/
-- style/main.css
-- style/[différents fichiers de css]
- App.js
- i18n.js
- index.js
- index.css

De plus, au même niveau que le répertoire src/, je dispose également du dossier "pages/"
- pages/index.js
- pages/_app.js