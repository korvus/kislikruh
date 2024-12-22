import React, { useContext } from "react";
import { PanemContext } from "../store/centralrecipes";
import styles from "../style/styleMeta.module.css";

const Meta = () => {
    const { recipedata } = useContext(PanemContext);

    if (!recipedata || !recipedata.desc || recipedata.desc.length === 0) return;

    return <p className={styles.meta}><pre>{recipedata.desc}</pre></p>;
};

export default Meta;
