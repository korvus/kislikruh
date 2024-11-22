
import '../src/style/index.css';
import '../src/style/main.css';
import '../src/style/page.css';
import '../src/style/create.css';
import '../src/style/styleMenu.css';
import '../src/style/stylePetrissage.css';
import '../src/style/styleIngredients.css';
import '../src/style/styleRecipes.css';
import '../src/style/styleTemperature.css';
import '../src/style/infobulle.css';
import { PanemContextProvider } from '../src/store/centralrecipes';
import { IngredientsProvider } from "../src/store/centralIngredients";
import '../src/i18n';

function MyApp({ Component, pageProps }) {
    return (
        <PanemContextProvider>
            <IngredientsProvider>
                <Component {...pageProps} />
            </IngredientsProvider>
        </PanemContextProvider>
    );
}

export default MyApp;