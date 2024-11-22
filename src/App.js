// pages/_app.js
// import '../src/style/main.css';
// import '../src/style/page.css';
// import '../src/i18n';
import { PanemContextProvider } from '../src/store/centralrecipes';

function MyApp({ Component, pageProps }) {
  return (
    <PanemContextProvider>
      <Component {...pageProps} />
    </PanemContextProvider>
  );
}

export default MyApp;
/* ============================================================================================= *
import "./style/main.css";
import "./style/page.css";
import "./i18n";
import { PanemContextProvider } from "./store/centralrecipes.js";
import { BrowserRouter } from "react-router-dom";
import Home from "./components/home.js";

function App() {
  return (
    <BrowserRouter>
      <PanemContextProvider>
        <Home />
      </PanemContextProvider>
    </BrowserRouter>
  );
}

export default App;
*/