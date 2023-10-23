import Proportions from "./proportions.js";
import { Routes, Route } from "react-router-dom";

function Home() {
  return (
    <Routes>
      <Route path="/" element={<Proportions />} />
    </Routes>
  );
}

export default Home;
  