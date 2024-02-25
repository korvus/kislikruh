import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { BsCalculatorFill } from "react-icons/bs";
import { TbEggCracked } from "react-icons/tb";

import Modal from "../utils/modal";

const EggCalculator = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { t } = useTranslation();

  const displayEggCalculator = () => {
    setIsModalOpen(true);
  };

  const hideEggCalculator = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="eggCalculator">
      {/* ... votre formulaire et autres éléments de l'interface utilisateur ... */}

      <button onClick={displayEggCalculator}>
        <TbEggCracked />
        <BsCalculatorFill />
      </button>

      <Modal isOpen={isModalOpen} onClose={hideEggCalculator}>
        <p>Calculez le poid par rapport aux nombre d'oeufs</p>
        {/* Vous pouvez ajouter d'autres éléments HTML ou composants ici si nécessaire */}
      </Modal>
    </div>
  );
};

export default EggCalculator;
