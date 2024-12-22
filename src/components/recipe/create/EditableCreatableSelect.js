import React, { useState, useRef } from "react";

const EditableAutocompleteInput = ({
    options = [],
    value = null,
    onChange,
    placeholder = "Saisir ou choisir un ingrédient",
}) => {
    const [inputValue, setInputValue] = useState(value?.label || "");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef(null);

    // Filtrer les options en fonction de la saisie
    const filteredOptions = options.filter((option) => {
        const label = typeof option.label === "string" ? option.label.toLowerCase() : "";
        const input = typeof inputValue === "string" ? inputValue.toLowerCase() : "";
        return label.includes(input);
    });

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        setShowSuggestions(true);
        onChange({ label: newValue, value: newValue });
    };

    const handleSuggestionClick = (suggestion) => {
        setInputValue(suggestion.label);
        onChange(suggestion);
        setShowSuggestions(false);
    };

    const handleBlur = () => {
        setTimeout(() => setShowSuggestions(false), 200);
    };

    const handleFocus = () => {
        if (filteredOptions.length > 0) {
            setShowSuggestions(true);
        }
    };

    return (
        <div className="editable-autocomplete-input" style={{ position: "relative" }}>
            <input
                type="text"
                ref={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder={placeholder}
                style={{
                    padding: "6px",
                    borderWidth: "1px",
                    borderRadius: "2px",
                }}
            />

            {showSuggestions && filteredOptions.length > 0 && (
                <ul
                    className="suggestions-dropdown"
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        width: "100%",
                        backgroundColor: "white",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        marginTop: "4px",
                        padding: '0',
                        maxHeight: "150px",
                        overflowY: "auto",
                        zIndex: 1000,
                    }}
                >
                    {filteredOptions.map((option, index) => (
                        <li
                            key={index}
                            onClick={() => handleSuggestionClick(option)}
                            style={{
                                padding: "8px",
                                cursor: "pointer",
                                backgroundColor: "#f9f9f9",
                            }}
                            onMouseEnter={(e) => (e.target.style.backgroundColor = "#e6e6e6")}
                            onMouseLeave={(e) => (e.target.style.backgroundColor = "#f9f9f9")}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default EditableAutocompleteInput;