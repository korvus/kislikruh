import React, { useState, useEffect, useContext } from "react";
import CustomRender from "./CustomRender";
import AddData from "./addIngredientData";
import { IngredientsContext } from "../../store/centralIngredients";
import { VscSymbolBoolean } from "react-icons/vsc";
import { TbPercentage } from "react-icons/tb";
import { FaWeightHanging } from "react-icons/fa";


const IngredientProperties = ({ data, ingredient }) => {
    const { updateIngredient } = useContext(IngredientsContext);

    const standardKeys = ["color", "hydratation", "sucre", "lipides", "protéines", "gluten", "poid", "prix"];
    const availableKeys = standardKeys.filter((key) => !Object.keys(data || {}).includes(key));

    const [selectedKey, setSelectedKey] = useState("");
    const [customKey, setCustomKey] = useState("");
    const [customValue, setCustomValue] = useState("");
    const [customType, setCustomType] = useState("");
    const [customPrice, setCustomPrice] = useState("");
    const [customQuantity, setCustomQuantity] = useState("");


    const handleAddProperty = () => {
        const keyToAdd = selectedKey === "autre" ? customKey.trim() : selectedKey;

        if (!keyToAdd ||
            (keyToAdd !== "gluten" && keyToAdd !== "prix" && customValue.trim() === "") ||
            (keyToAdd === "prix" && (customPrice.trim() === "" || customQuantity.trim() === ""))
        ) return;

        let formattedValue = customValue;
        if (selectedKey === "prix") formattedValue = `${customPrice}|${customQuantity}`;
        if (customType === "bool") formattedValue = customValue === "true";
        if (customType === "percent") formattedValue = `${customValue}%`;

        const updatedData = { ...data, [keyToAdd]: formattedValue };
        updateIngredient(updatedData);

        // Reset des champs après ajout
        setSelectedKey("");
        setCustomKey("");
        setCustomValue("");
        setCustomType("");
        setCustomPrice("");
        setCustomQuantity("");
    };

    useEffect(() => {
        if (selectedKey === "gluten") {
            setCustomValue("false");
        } else if (["hydratation", "sucre", "lipides", "protéines"].includes(selectedKey)) {
            setCustomValue("50");
        } else {
            setCustomValue("");
        }
    }, [selectedKey]);

    if (!data) return <AddData ingredient={ingredient} />;
    const customValueWithoutPercent = parseInt(customValue);

    return (
        <ul className="infos-ingredients-ul">
            {Object.entries(data).map(([key, value]) => (
                <CustomRender key={key} keyName={key} value={value} ingredient={data} />
            ))}

            {availableKeys.length > 0 && (
                <li className='edition'>
                    <label>Ajouter une donnée :</label>
                    <select value={selectedKey} onChange={(e) => setSelectedKey(e.target.value)}>
                        <option value="">Sélectionner</option>
                        {availableKeys.map((key) => (
                            <option key={key} value={key}>{key}</option>
                        ))}
                        <option value="autre">Autre...</option>
                    </select>
                    {selectedKey === "poid" && (
                        <>
                            <input
                                style={{ width: '50px' }}
                                type="number"
                                value={customValue || 0}
                                onChange={(e) => setCustomValue(e.target.value)}
                            /> gr
                        </>
                    )}
                    {["hydratation", "sucre", "lipides", "protéines"].includes(selectedKey) && (
                        <>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={customValueWithoutPercent || 0}
                                onChange={(e) => setCustomValue(`${e.target.value}%`)}
                            />
                            <label>{customValueWithoutPercent || '_'} %</label>
                        </>
                    )}

                    {selectedKey === "gluten" && (
                        <div className="toggle-container" onClick={() => setCustomValue(customValue === "true" ? "false" : "true")}>
                            <div className={`toggle ${customValue === "true" ? "active" : ""}`} />
                            <label>{customValue === "true" ? "Oui" : "Non"}</label>
                        </div>
                    )}
                </li>
            )}

            {selectedKey === "prix" && (
                <>
                    <li className="type-selection">
                        Entrez le prix pour une quantitée donnée.
                    </li>
                    <li className="type-selection">
                        <input
                            type="number"
                            min='0'
                            className='prix'
                            placeholder="Prix"
                            step="0.01"
                            value={customPrice}
                            onChange={(e) => setCustomPrice(e.target.value)}
                        /> € /
                        <input
                            type="number"
                            className='prix'
                            placeholder="Quantitée"
                            value={customQuantity}
                            min="1"
                            onChange={(e) => setCustomQuantity(e.target.value)}
                        /> gr
                    </li>
                </>
            )}

            {/* Champs spécifiques en fonction de la clé sélectionnée */}
            {selectedKey === "autre" && (
                <>
                    <li className='title-value'>
                        <label>Type de valeur :</label>
                    </li>
                    <li className="type-selection">
                        <button
                            className={`bt ${customType === "bool" ? "selected" : ""}`}
                            onClick={() => setCustomType("bool")}
                        >
                            <VscSymbolBoolean size={18} /> Binaire
                        </button>
                        <button
                            className={`bt ${customType === "percent" ? "selected" : ""}`}
                            onClick={() => setCustomType("percent")}
                        >
                            <TbPercentage /> Pourcentage
                        </button>
                        <button
                            className={`bt ${customType === "text" ? "selected" : ""}`}
                            onClick={() => setCustomType("text")}
                        >
                            <FaWeightHanging /> Valeur brute
                        </button>
                    </li>
                </>
            )}

            {selectedKey === "autre" && customType && (
                <li className='new-propertie'>
                    <input
                        type="text"
                        placeholder="Nom propriété"
                        value={customKey}
                        onChange={(e) => setCustomKey(e.target.value)}
                    />
                    {customType === "bool" && (
                        <div className="toggle-container" onClick={() => setCustomValue(customValue === "true" ? "false" : "true")}>
                            <div className={`toggle ${customValue === "true" ? "active" : ""}`} />
                            <label>{customValue === "true" ? "Oui" : "Non"}</label>
                        </div>
                    )}
                    {customType === "percent" && (
                        <>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={customValue || 0}
                                onChange={(e) => setCustomValue(`${e.target.value}%`)}
                            />
                            <label>{customValue || "0"} %</label>
                        </>
                    )}
                    {customType === "text" && (
                        <input
                            type="text"
                            placeholder="Valeur"
                            value={customValue}
                            onChange={(e) => setCustomValue(e.target.value)}
                        />
                    )}
                </li>
            )}

            {selectedKey &&
                (
                    (selectedKey === "prix" && customPrice.trim() !== "" && customQuantity.trim() !== "") ||
                    (selectedKey !== "prix" && customValue.trim() !== "")
                ) &&
                (selectedKey !== "autre" || customKey.trim() !== "") && (
                    <li className='validation'>
                        <button className='bt' onClick={handleAddProperty}>Ajouter</button>
                    </li>
                )}
        </ul>
    );
};

export default IngredientProperties;