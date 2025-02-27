import React, { useContext, useState } from "react";
import { IngredientsContext } from "../../store/centralIngredients";
import { useTranslation } from "react-i18next";
import { WaterPieChart } from './waterPie';
import trashIcon from "../../style/trash.svg";
import Image from 'next/image';

const CustomRender = ({ keyName, value, ingredient }) => {
    const { t } = useTranslation();

    const [customValue, setCustomValue] = useState(value);

    const { updateIngredient, removeIngredientProperty } = useContext(IngredientsContext);

    const handleRemoveProperty = () => {
        removeIngredientProperty(ingredient.label, keyName);
    };

    const handleSaveValue = () => {
        updateIngredient({ ...ingredient, [keyName]: customValue });
    };

    if (keyName === 'label') return null;

    if (keyName === 'color') {
        const handleChangeColor = (event) => {
            const newColor = event.target.value;
            updateIngredient({ ...ingredient, color: newColor });
        };

        return (
            <li key={keyName} className='line'>
                <input type="color" value={value} onChange={handleChangeColor} />
                {value}
            </li>
        );
    }

    if (keyName === 'hydratation') {
        const customValueAsNumber = parseInt(customValue);
        return (<li key={keyName} className='line'>
            <b>{keyName} :</b>
            <WaterPieChart percentage={value} />
            <span title="valeur actuelle" className='percents-originals'>{value} %</span>
            <span title="valeur changée" style={{ color: `${value === customValueAsNumber ? '#b5b5b5' : '#145ebd'}` }} className='percents-tweaked'>
                {value === customValueAsNumber ? '= ' : '≠ '}
                {customValue || '_'} %
            </span>
            <>
                <div className='rangeContainer'>
                    <div className="current">
                        <div className="current-bar" style={{ width: `${value}%` }}></div>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={customValue || 0}
                        onChange={(e) => setCustomValue(e.target.value)}
                    />
                </div>
                {customValue !== value && (
                    <button className="bt save-btn" onClick={handleSaveValue}>
                        sauvegarder
                    </button>
                )}
            </>
            <Image className='trash' width="15" src={trashIcon} alt={t("suppress")} onClick={handleRemoveProperty} />
        </li>)
    }

    if (["true", "false"].includes(String(customValue))) {
        return (<li key={keyName} className='line'>
            <div className="toggle-container" onClick={() => setCustomValue(customValue === "true" ? "false" : "true")}>
                <div className={`toggle ${customValue === "true" ? "active" : ""}`} />
                <label><b>{customValue === "true" ? `Avec ${keyName}` : `Sans ${keyName}`}</b></label>
            </div>

            <Image className='trash' width="15" src={trashIcon} alt={t("suppress")} onClick={handleRemoveProperty} />
        </li>)
    }


    const isPercentage = /^(\d{1,3})%$/.test(value);
    if (isPercentage) {
        const numericValue = parseInt(value, 10);
        const customValueWithoutPercent = parseInt(customValue);
        return (
            <li key={keyName} className='line'>
                <b>{keyName} :</b>
                <span title="valeur actuelle" className='percents-originals'>{numericValue} %</span>
                <span title="valeur changée" style={{ color: `${numericValue === customValueWithoutPercent ? '#b5b5b5' : '#145ebd'}` }} className='percents-tweaked'>
                    {numericValue === customValueWithoutPercent ? '= ' : '≠ '}
                    {customValueWithoutPercent || '_'} %
                </span>
                <>
                    <div className='rangeContainer'>
                        <div className="current">
                            <div className="current-bar" style={{ width: `${numericValue}%` }}></div>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={customValueWithoutPercent || 0}
                            onChange={(e) => setCustomValue(`${e.target.value}%`)}
                        />
                    </div>
                    {customValueWithoutPercent !== numericValue && (
                        <button className="bt save-btn" onClick={handleSaveValue}>
                            sauvegarder
                        </button>
                    )}
                </>
                <Image className='trash' width="15" src={trashIcon} alt={t("suppress")} onClick={handleRemoveProperty} />
            </li>
        );
    }

    if (keyName === 'poid') {
        return (<li key={keyName} className='line'>
            <b>{keyName} :</b>
            <input type='number' onChange={(e) => setCustomValue(e.target.value)} title="valeur actuelle" value={customValue} className='text-originals number-weight' /> gr
            <>
                {customValue !== value && (
                    <button className="bt save-btn" onClick={handleSaveValue}>
                        sauvegarder
                    </button>
                )}
            </>
            <Image className='trash' width="15" src={trashIcon} alt={t("suppress")} onClick={handleRemoveProperty} />
        </li>)
    }

    return (
        <li key={keyName} className='line'>
            <b>{keyName} :</b>
            <input type='text' title="valeur actuelle" onChange={(e) => setCustomValue(e.target.value)} value={customValue} className='text-originals' />
            <>
                {customValue !== value && (
                    <button className="bt save-btn" onClick={handleSaveValue}>
                        sauvegarder
                    </button>
                )}
            </>
            <Image className='trash' width="15" src={trashIcon} alt={t("suppress")} onClick={handleRemoveProperty} />
        </li>
    );
};

export default CustomRender;