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

      <button onClick={displayEggCalculator}>
        <TbEggCracked />
        <BsCalculatorFill />
      </button>

      <Modal isOpen={isModalOpen} onClose={hideEggCalculator}>
        <p>Calculez le poid par rapport aux nombre d'oeufs</p>
      </Modal>
    </div>
  );
};

export default EggCalculator;
