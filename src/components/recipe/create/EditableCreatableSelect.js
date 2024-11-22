import React, { useState, useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';

const EditableCreatableSelect = ({
    options,
    value,
    onChange,
    placeholder,
    styles,
    isDisabled
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value ? value.label : "");

    // Mettre à jour la valeur d'entrée si la valeur du select change
    useEffect(() => {
        if (value && value.label !== inputValue) {
            setInputValue(value.label);
        }
    }, [inputValue, value]);

    // Gérer la validation de l'entrée et revenir au mode Select
    const handleBlur = () => {
        if (inputValue.trim() !== "") {
            onChange({ label: inputValue, value: inputValue });
        }
        setIsEditing(false);
    };

    return (
        <div>
            {isEditing ? (
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onBlur={handleBlur}
                    autoFocus
                    className='inputSelect'
                />
            ) : (
                <CreatableSelect
                    options={options}
                    onChange={(newValue) => {
                        if (!newValue) {
                            setInputValue(""); // Réinitialiser la valeur si effacée
                        } else {
                            onChange(newValue);
                        }
                    }}
                    onInputChange={(newInputValue) => setInputValue(newInputValue)}
                    value={value}
                    placeholder={placeholder}
                    styles={styles}
                    isDisabled={isDisabled}
                    onMenuClose={() => setIsEditing(true)} // Activer l'édition si aucune option n'est choisie
                />
            )}
        </div>
    );
};

export default EditableCreatableSelect;