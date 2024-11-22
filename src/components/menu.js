import React from "react";
import { useTranslation } from "react-i18next";
import { FaLanguage } from "react-icons/fa";
import Select, { components } from "react-select";
// import "../style/styleMenu.css";

const { Option } = components;

const SingleValue = ({ children, ...props }) => (
  <div style={{ display: "flex", alignItems: "center" }}>
    <FaLanguage style={{ marginRight: "5px" }} size="1.5em" />
    {children}
  </div>
);

function Menu({ page }) {
  const { i18n } = useTranslation();

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "fr", label: "Français" },
    { value: "si", label: "Slovenščina" },
  ];

  const handleLanguageChange = (selectedOption) => {
    i18n.changeLanguage(selectedOption.value);
  };

  return (
    <div className={`menu ${page}`}>
      <Select
        className="select"
        onChange={handleLanguageChange}
        value={languageOptions.find((option) => option.value === i18n.language)}
        isSearchable={false}
        options={languageOptions}
        components={{ SingleValue, Option }}
      />
    </div>
  );
}

export default Menu;
